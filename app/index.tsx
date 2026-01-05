import '@/constants/i18n'; // Import i18n config
import { Colors } from '@/constants/theme';
import { app, auth, db, firebaseConfig } from '@/services/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { CountryPicker } from "react-native-country-codes-picker";

// Phone number formats for major countries
const PLACEHOLDERS: { [key: string]: string } = {
    '+90': '5XX XXX XX XX', // Turkey
    '+1': '(XXX) XXX-XXXX', // USA/Canada
    '+44': '7XXX XXXXXX',   // UK
    '+49': '1XX XXXXXXX',   // Germany
    '+33': '6 XX XX XX XX', // France
    '+39': '3XX XXXXXXX',   // Italy
    '+34': '6XX XX XX XX',  // Spain
    '+7': '(XXX) XXX-XX-XX',// Russia
    '+81': 'XX-XXXX-XXXX',  // Japan
    '+86': '1XX XXXX XXXX', // China
};

export default function LoginScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [countryCode, setCountryCode] = useState('+90');
    const [countryFlag, setCountryFlag] = useState('🇹🇷');
    const [phonePlaceholder, setPhonePlaceholder] = useState('5XX XXX XX XX'); // Default TR
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    // Auth State
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Ref for Native Modal
    const recaptchaVerifierModal = useRef<FirebaseRecaptchaVerifierModal | null>(null);
    // Ref for Web Verifier
    const recaptchaVerifierWeb = useRef<RecaptchaVerifier | null>(null);
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(Platform.OS !== 'web');

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    // Reset state on mount
    useEffect(() => {
        setVerificationId(null);
        setLoading(false);
        setPhone('');
        setCode('');
    }, []);

    // Robust Initialization Function with Direct DOM manipulation
    const initializeRecaptcha = async () => {
        if (Platform.OS !== 'web') return;

        // If we already have a verified instance, use it
        if (recaptchaVerifierWeb.current) {
            setIsRecaptchaReady(true);
            return;
        }

        try {
            if (!auth) {
                console.log("Auth not ready yet");
                return;
            }

            // 1. COMPLETELY REMOVE old container to prevent "already rendered" error
            // @ts-ignore
            const oldContainer = document.getElementById('recaptcha-container');
            if (oldContainer) {
                oldContainer.remove();
            }

            // 2. Create a FRESH container
            // @ts-ignore
            const container = document.createElement('div');
            container.id = 'recaptcha-container';
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            // @ts-ignore
            document.body.appendChild(container);

            // 3. Reset internal ref
            recaptchaVerifierWeb.current = null;

            console.log("Initializing Recaptcha with FRESH container...");
            recaptchaVerifierWeb.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    console.log("Recaptcha resolved");
                },
                'expired-callback': () => {
                    console.log("Recaptcha expired");
                }
            });

            setIsRecaptchaReady(true);
            console.log("Web Recaptcha Ready");
        } catch (e) {
            console.error("Recaptcha Init Error:", e);
            recaptchaVerifierWeb.current = null;
        }
    };

    // Initialize on Mount & Auth change
    useEffect(() => {
        initializeRecaptcha();

        // Cleanup on unmount - optional but good practice
        return () => {
            if (Platform.OS === 'web') {
                // @ts-ignore
                const el = document.getElementById('recaptcha-container');
                if (el) el.remove();
                recaptchaVerifierWeb.current = null;
            }
        };
    }, [auth]);

    const handleSendVerification = async () => {
        if (phone.length < 4) {
            alert(t('login.validation'));
            return;
        }

        // Ensure web recaptcha is ready
        if (Platform.OS === 'web' && !recaptchaVerifierWeb.current) {
            await initializeRecaptcha();
        }

        setLoading(true);
        try {
            const formattedPhone = `${countryCode}${phone}`;
            console.log("Starting verification for:", formattedPhone);

            if (Platform.OS === 'web') {
                // Web specific method
                const verifier = recaptchaVerifierWeb.current;
                if (!verifier) throw new Error("Recaptcha not initialized");

                console.log("Using signInWithPhoneNumber for Web...");
                const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
                console.log("Code sent successfully (Web). Verif ID:", confirmationResult.verificationId);

                setVerificationId(confirmationResult.verificationId);

            } else {
                // Native specific method
                const phoneProvider = new PhoneAuthProvider(auth);
                const verifier = recaptchaVerifierModal.current;

                if (!verifier) throw new Error("Native Recaptcha not initialized");

                console.log("Using PhoneAuthProvider for Native...");
                // @ts-ignore - Firebase types mismatch sometimes
                const vId = await phoneProvider.verifyPhoneNumber(
                    formattedPhone,
                    verifier
                );
                console.log("Code sent successfully (Native). Verif ID:", vId);
                setVerificationId(vId);
            }

        } catch (error: any) {
            console.error("Verification Error:", error);
            if (error.code === 'auth/internal-error') {
                alert(`Firebase Internal Error. \n1. Check if 'localhost' is in Firebase Authorized Domains.\n2. Check API Key validity.\nOriginal: ${error.message}`);
            } else {
                alert(`Error sending code: ${error.message}`);
            }

            // Web Cleanup
            if (Platform.OS === 'web') {
                try {
                    recaptchaVerifierWeb.current?.clear();
                } catch (e) { }
                recaptchaVerifierWeb.current = null;
                setIsRecaptchaReady(false);
                setTimeout(initializeRecaptcha, 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper for timeouts
    const withTimeout = (promise: Promise<any>, ms: number, errorMessage: string) => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(errorMessage)), ms);
            promise.then(
                (res) => { clearTimeout(timer); resolve(res); },
                (err) => { clearTimeout(timer); reject(err); }
            );
        });
    };

    const handleConfirmCode = async () => {
        if (!verificationId || code.length < 6) {
            alert("Please enter the verification code (6 digits).");
            return;
        }
        setLoading(true);
        try {
            console.log("Attempting to sign in with credential...");
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            );

            // Sign In with Timeout (10s reduced from 15s)
            const userCredential: any = await withTimeout(
                signInWithCredential(auth, credential),
                10000,
                "Sign-in timed out. Please check your internet connection."
            );

            console.log("User signed in successfully:", userCredential.user.uid);

            // Check Firestore with Timeout (Reduced to 5s, no retries)
            console.log("Checking user profile in Firestore...");
            try {
                const userDocRef = doc(db, 'users', userCredential.user.uid);

                // Single attempt with short timeout (bumped to 7s)
                const userDoc: any = await withTimeout(
                    getDoc(userDocRef),
                    7000,
                    "Firestore check timed out"
                );

                if (userDoc.exists()) {
                    console.log("User profile found.");
                    router.replace('/(tabs)');
                } else {
                    console.log("User profile not found.");
                    // Don't alert here, just go straight to register to be smoother
                    router.replace(`/register?phone=${encodeURIComponent(countryCode + phone)}`);
                }
            } catch (dbError: any) {
                console.log("Firestore Error/Timeout (Handled):", dbError.message);
                // Fail fast to register
                console.log("Redirecting to register on DB error (Safety Fallback).");
                router.replace(`/register?phone=${encodeURIComponent(countryCode + phone)}`);
            }

        } catch (error: any) {
            console.error("Verification Error:", error);
            // If user cancelled, don't show alert, just log it.
            if (error.message && error.message.includes('Cancelled by user')) {
                return;
            }
            alert(`Giriş Başarısız: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/gym_bg_v2.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                <SafeAreaView style={styles.safeArea}>

                    {/* Native Modal Setup */}
                    {Platform.OS !== 'web' && (
                        <FirebaseRecaptchaVerifierModal
                            ref={recaptchaVerifierModal}
                            firebaseConfig={firebaseConfig}
                            // @ts-ignore
                            app={app}
                        // attemptInvisibleVerification={true} 
                        />
                    )}

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={styles.header}>
                            <Text style={styles.logo}>RAVE GYM</Text>
                            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
                        </View>

                        <View style={styles.form}>
                            {!verificationId ? (
                                <>
                                    <Text style={styles.label}>{t('login.label')}</Text>
                                    <View style={styles.inputContainer}>
                                        <TouchableOpacity
                                            style={styles.countryCodeContainer}
                                            onPress={() => setShowCountryPicker(true)}
                                        >
                                            <Text style={styles.countryCodeText}>{countryFlag} {countryCode}</Text>
                                        </TouchableOpacity>

                                        <View style={styles.separator} />

                                        <TextInput
                                            style={styles.input}
                                            placeholder={phonePlaceholder}
                                            placeholderTextColor="#666"
                                            keyboardType="phone-pad"
                                            value={phone}
                                            onChangeText={setPhone}
                                            autoFocus
                                            maxLength={15}
                                        />
                                    </View>

                                    {/* Web Recaptcha Anchor - Attached to a persistent, visible view */}
                                    <TouchableOpacity
                                        testID="sign-in-button"
                                        style={styles.button}
                                        onPress={handleSendVerification}
                                        disabled={loading}
                                    >
                                        {loading ? <ActivityIndicator color="#000" /> : (
                                            <>
                                                <Text style={styles.buttonText}>{t('login.button')}</Text>
                                                <ArrowRight color="#000" size={20} />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {/* Code Input View */}
                                    <Text style={styles.label}>ENTER CODE</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.input, { textAlign: 'center', marginLeft: 0 }]}
                                            placeholder="XXXXXX"
                                            placeholderTextColor="#666"
                                            keyboardType="number-pad"
                                            value={code}
                                            onChangeText={setCode}
                                            autoFocus
                                            maxLength={6}
                                        />
                                    </View>

                                    <TouchableOpacity style={styles.button} onPress={handleConfirmCode} disabled={loading}>
                                        {loading ? <ActivityIndicator color="#000" /> : (
                                            <>
                                                <Text style={styles.buttonText}>VERIFY</Text>
                                                <ArrowRight color="#000" size={20} />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setVerificationId(null)} style={{ marginTop: 16, alignSelf: 'center' }}>
                                        <Text style={{ color: '#ccc', fontFamily: 'Inter_400Regular' }}>Change Phone Number</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </KeyboardAvoidingView>


                    <CountryPicker
                        show={showCountryPicker}
                        style={{
                            modal: {
                                height: 500,
                                backgroundColor: '#1a1a1a',
                            },
                            line: {
                                backgroundColor: "#333"
                            },
                            textInput: {
                                color: "#fff",
                                backgroundColor: "#333",
                                padding: 12,
                                borderRadius: 8,
                                fontFamily: 'Inter_400Regular'
                            },
                            countryButtonStyles: {
                                backgroundColor: 'transparent',
                                borderBottomWidth: 1,
                                borderBottomColor: "#333",
                                height: 50
                            },
                            dialCode: {
                                color: "#fff",
                                fontFamily: 'Inter_400Regular'
                            },
                            countryName: {
                                color: "#ccc",
                                fontFamily: 'Inter_400Regular'
                            }
                        }}
                        pickerButtonOnPress={(item) => {
                            setCountryCode(item.dial_code);
                            setCountryFlag(item.flag);
                            const newPlaceholder = PLACEHOLDERS[item.dial_code] || 'XXX XXX XXXX';
                            setPhonePlaceholder(newPlaceholder);
                            setShowCountryPicker(false);
                            setPhone('');
                        }}
                        onBackdropPress={() => setShowCountryPicker(false)}
                        lang={i18n.language === 'tr' ? 'tr' : 'en'}
                    />



                    {/* Language Switcher */}
                    <View style={styles.langContainer}>
                        <TouchableOpacity onPress={() => changeLanguage('tr')} style={[styles.langButton, i18n.language === 'tr' && styles.langButtonActive]}>
                            <Text style={[styles.langText, i18n.language === 'tr' && styles.langTextActive]}>TR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('en')} style={[styles.langButton, i18n.language === 'en' && styles.langButtonActive]}>
                            <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>EN</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 60,
        alignItems: 'center',
    },
    logo: {
        fontSize: 56,
        color: Colors.dark.primary,
        letterSpacing: 4,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
    },
    subtitle: {
        color: '#ccc',
        marginTop: 8,
        fontSize: 14,
        letterSpacing: 4,
        fontFamily: 'Oswald_300Light',
        textTransform: 'uppercase',
    },
    form: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 32,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    label: {
        color: Colors.dark.text,
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'Oswald_400Regular',
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 24,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#666',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    countryCodeText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Oswald_500Medium',
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#666',
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        letterSpacing: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.primary,
        height: 60,
        borderRadius: 4,
        gap: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 20,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    langContainer: {
        position: 'absolute',
        top: 60,
        right: 24,
        flexDirection: 'row',
        gap: 8,
        zIndex: 10,
    },
    langButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    langButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    langText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Oswald_500Medium',
    },
    langTextActive: {
        color: '#000',
    }
});

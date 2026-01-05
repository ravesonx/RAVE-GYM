import '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { auth, db } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { ArrowRight, CheckSquare, Mail, Square, User, X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const KVKK_TEXT = `KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) AYDINLATMA METNİ

Veri Sorumlusu: RAVE GYM

Rave Gym olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, kişisel verileriniz aşağıda açıklanan çerçevede işlenebilecektir.

1. Kişisel Verilerin İşlenme Amacı
Toplanan kişisel verileriniz (Ad, Soyad, Telefon, E-posta vb.); üyelik işlemlerinin gerçekleştirilmesi, hizmetlerimizden faydalanmanızın sağlanması, iletişim faaliyetlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.

2. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi
Kişisel verileriniz, mobil uygulamamız üzerinden elektronik ortamda, üyelik sözleşmesinin kurulması ve ifası hukuki sebebine dayalı olarak toplanmaktadır.

3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği
Kişisel verileriniz, yasal düzenlemelerin öngördüğü kapsamda yetkili kamu kurum ve kuruluşlarına ve hizmetin ifası için gerekli olması halinde iş ortaklarımıza KVKK’nın 8. ve 9. maddelerinde belirtilen şartlara uygun olarak aktarılabilecektir.

4. Veri Sahibinin Hakları
KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz.

Her türlü soru ve talepleriniz için uygulama içerisindeki iletişim kanallarını kullanabilirsiniz.`;

export default function RegisterScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ phone: string }>();
    const phone = typeof params.phone === 'string' ? params.phone : params.phone?.[0];
    const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [kvkkAccepted, setKvkkAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showKvkk, setShowKvkk] = useState(false);

    // Safety check for Auth persistence on refresh with Timeout
    const waitForUser = async (): Promise<any> => {
        if (auth.currentUser) return auth.currentUser;

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                resolve(null); // Resolve null on timeout to handle in logic
            }, 5000); // 5s wait max

            const unsubscribe = auth.onAuthStateChanged((user) => {
                clearTimeout(timeoutId);
                unsubscribe();
                resolve(user);
            });
        });
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const handleComplete = async () => {
        console.log("handleComplete called");
        if (!kvkkAccepted) {
            alert(t('register.validationKVKK'));
            return;
        }
        if (!name || !surname || !email) {
            alert(t('register.validationFields'));
            return;
        }

        setLoading(true);

        try {
            // Ensure we have a user (waits for Firebase init on refresh)
            let user = auth.currentUser;
            if (!user) {
                console.log("Auth user is null, waiting for auth state...");
                user = await waitForUser();
            }

            console.log("Current User:", user);
            const uid = user?.uid;

            if (!uid) {
                console.error("No user logged in after wait");
                alert("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
                setLoading(false);
                return;
            }

            console.log("Processing registration for:", uid);

            // 1. Save to Local Storage FIRST (Optimistic)
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userSurname', surname);
            await AsyncStorage.setItem('userEmail', email);
            if (phone) await AsyncStorage.setItem('userPhone', phone);
            console.log("AsyncStorage save successful");

            // 2. Try to save to Firestore in background/parallel
            // We won't block the UI strictly on this if it's slow
            const firestorePromise = setDoc(doc(db, 'users', uid), {
                name,
                surname,
                email,
                phone: phone || user?.phoneNumber || "",
                createdAt: new Date().toISOString(),
            });

            // Wait max 5 seconds for DB, but don't fail the whole process if it times out
            try {
                await Promise.race([
                    firestorePromise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error("DB_TIMEOUT")), 5000))
                ]);
                console.log("Firestore save successful");
            } catch (dbError: any) {
                console.warn("Firestore save timed out or failed, but continuing locally:", dbError.message);
                // We proceed anyway because we saved locally
            }

            console.log("Navigating to main application...");
            setLoading(false);
            router.replace('/(tabs)');
        } catch (e: any) {
            console.error("Critical Error", e);
            alert("Beklenmedik bir hata oluştu: " + e.message);
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

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent}>

                            <View style={styles.header}>
                                <Text style={styles.title}>{t('register.title')}</Text>
                                <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
                            </View>

                            <View style={styles.form}>
                                {/* Name */}
                                <View style={styles.inputContainer}>
                                    <User color={Colors.dark.icon} size={20} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t('register.namePlaceholder')}
                                        placeholderTextColor="#888"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

                                {/* Surname */}
                                <View style={styles.inputContainer}>
                                    <User color={Colors.dark.icon} size={20} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t('register.surnamePlaceholder')}
                                        placeholderTextColor="#888"
                                        value={surname}
                                        onChangeText={setSurname}
                                    />
                                </View>

                                {/* Email */}
                                <View style={styles.inputContainer}>
                                    <Mail color={Colors.dark.icon} size={20} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t('register.emailPlaceholder')}
                                        placeholderTextColor="#888"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>

                                {/* KVKK Checkbox */}
                                <View style={styles.checkboxContainer}>
                                    <TouchableOpacity
                                        onPress={() => setKvkkAccepted(!kvkkAccepted)}
                                        style={{ padding: 4 }}
                                    >
                                        {kvkkAccepted ? (
                                            <CheckSquare color={Colors.dark.primary} size={24} />
                                        ) : (
                                            <Square color={Colors.dark.icon} size={24} />
                                        )}
                                    </TouchableOpacity>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.checkboxText}>
                                            {t('register.kvkkText')}
                                            <Text
                                                style={{ fontFamily: 'Oswald_600SemiBold', color: Colors.dark.primary, textDecorationLine: 'underline' }}
                                                onPress={() => setShowKvkk(true)}
                                            >
                                                {t('register.kvkkHighlight')}
                                            </Text>
                                            {t('register.kvkkTextSuffix')}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
                                    onPress={handleComplete}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#000" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>{t('register.button')}</Text>
                                            <ArrowRight color="#000" size={20} />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>

                    {/* KVKK Modal */}
                    <Modal
                        visible={showKvkk}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setShowKvkk(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>KVKK Aydınlatma Metni</Text>
                                    <TouchableOpacity onPress={() => setShowKvkk(false)} style={styles.closeButton}>
                                        <X color="#fff" size={24} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.modalScroll}>
                                    <Text style={styles.modalText}>
                                        {KVKK_TEXT}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>

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
    },
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
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 40,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 48,
        color: Colors.dark.text,
        marginBottom: 8,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        letterSpacing: 1,
        fontFamily: 'Inter_300Light',
    },
    form: {
        width: '100%',
        backgroundColor: 'rgba(20,20,20,0.8)',
        padding: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(50,50,50,0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 24,
        marginBottom: 24,
        gap: 12,
    },
    checkboxText: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_300Light',
        lineHeight: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.primary,
        height: 60,
        borderRadius: 4,
        gap: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#222',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_600SemiBold',
    },
    closeButton: {
        padding: 4,
    },
    modalScroll: {
        padding: 16,
    },
    modalText: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_300Light',
        lineHeight: 22,
        marginBottom: 20,
    },
});

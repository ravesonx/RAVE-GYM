import '@/constants/i18n';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, CheckSquare, Mail, Phone, Square, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MembershipRegisterScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    // Form State
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [tcIdentity, setTcIdentity] = useState('');
    const [isNotCitizen, setIsNotCitizen] = useState(false);
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const uName = await AsyncStorage.getItem('userName');
        const uSurname = await AsyncStorage.getItem('userSurname');
        const uEmail = await AsyncStorage.getItem('userEmail');
        const uPhone = await AsyncStorage.getItem('userPhone');

        if (uName) setName(uName);
        if (uSurname) setSurname(uSurname);
        if (uEmail) setEmail(uEmail);
        if (uPhone) setPhone(uPhone);
    };

    const handleConfirm = () => {
        // TC Validation
        if (!isNotCitizen) {
            if (tcIdentity.length !== 11) {
                Alert.alert("Hata", t('register.validationFields') || 'Lütfen geçerli bir TC Kimlik No giriniz.');
                return;
            }
        }

        // Date Validation - Support both DD/MM/YYYY and DDMMYYYY
        let cleanDate = birthDate.replace(/[^0-9]/g, '');

        if (cleanDate.length !== 8) {
            Alert.alert("Hata", "Lütfen geçerli bir doğum tarihi giriniz (GG/AA/YYYY)");
            return;
        }

        const day = cleanDate.substring(0, 2);
        const month = cleanDate.substring(2, 4);
        const year = cleanDate.substring(4, 8);

        // Basic validity check
        if (parseInt(month) < 1 || parseInt(month) > 12 || parseInt(day) < 1 || parseInt(day) > 31) {
            Alert.alert("Hata", "Geçersiz tarih.");
            return;
        }

        const birth = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        let age = today.getFullYear() - parseInt(year);
        const m = today.getMonth() - (parseInt(month) - 1);
        if (m < 0 || (m === 0 && today.getDate() < parseInt(day))) {
            age--;
        }

        if (age < 16) {
            Alert.alert("Uyarı", t('profile.membership.form.under16'));
            return;
        }

        if (!gender) {
            Alert.alert("Hata", "Lütfen cinsiyet seçiniz.");
            return;
        }

        // Proceed
        console.log("Navigating to addons...");
        router.push('/membership/addons');
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

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.membership.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.content}>

                            {/* Section 1: Personal Info */}
                            <Text style={styles.sectionTitle}>{t('profile.membership.form.personalInfo')}</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    value={name}
                                    editable={false}
                                    placeholder="Name"
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={[styles.input, styles.halfInput]}
                                    value={surname}
                                    editable={false}
                                    placeholder="Surname"
                                    placeholderTextColor="#666"
                                />
                            </View>

                            {/* TC Identity */}
                            <View style={styles.inputContainer}>
                                <User color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={tcIdentity}
                                    onChangeText={setTcIdentity}
                                    placeholder={t('profile.membership.form.identityNo')}
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={11}
                                    editable={!isNotCitizen}
                                />
                            </View>

                            {/* Not Citizen Checkbox */}
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => {
                                    setIsNotCitizen(!isNotCitizen);
                                    if (!isNotCitizen) setTcIdentity('');
                                }}
                            >
                                {isNotCitizen ? <CheckSquare color={Colors.dark.primary} size={20} /> : <Square color="#666" size={20} />}
                                <Text style={styles.checkboxText}>{t('profile.membership.form.notCitizen')}</Text>
                            </TouchableOpacity>

                            {/* Birth Date */}
                            <Text style={styles.label}>{t('profile.membership.form.birthDate')}</Text>
                            <View style={styles.inputContainer}>
                                <CalendarDays color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={birthDate}
                                    onChangeText={(text) => {
                                        // Auto-format DD/MM/YYYY
                                        const numeric = text.replace(/[^0-9]/g, '');
                                        let formatted = numeric;
                                        if (numeric.length > 2) formatted = numeric.substring(0, 2) + '/' + numeric.substring(2);
                                        if (numeric.length > 4) formatted = formatted.substring(0, 5) + '/' + numeric.substring(4, 8);
                                        setBirthDate(formatted);
                                    }}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>
                            <Text style={styles.warningText}>{t('profile.membership.form.under16')}</Text>

                            {/* Gender */}
                            <Text style={styles.label}>{t('profile.membership.form.gender')}</Text>
                            <View style={styles.genderContainer}>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                    onPress={() => setGender('male')}
                                >
                                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>{t('profile.membership.form.male')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                    onPress={() => setGender('female')}
                                >
                                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>{t('profile.membership.form.female')}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            {/* Section 2: Contact Info */}
                            <Text style={styles.sectionTitle}>{t('profile.membership.form.contactInfo')}</Text>

                            <View style={styles.inputContainer}>
                                <Phone color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={phone}
                                    editable={false} // Pre-filled and presumably locked or editable? User said "otomatik gelecek". Often locked for security but editable is fine. Let's make it locked as per description implying data comes from reg.
                                    placeholder={t('profile.membership.form.phone')}
                                    placeholderTextColor="#666"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Mail color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={email}
                                    editable={false}
                                    placeholder={t('profile.membership.form.email')}
                                    placeholderTextColor="#666"
                                />
                            </View>

                            {/* Confirm Button */}
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.confirmButtonText}>{t('profile.membership.form.confirm')}</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </KeyboardAvoidingView>

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
        backgroundColor: 'rgba(0,0,0,0.92)',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 16,
        letterSpacing: 1,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    halfInput: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 8, // reduced for warning text underneath
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 56,
    },
    inputWithIcon: {
        flex: 1,
        marginLeft: 12,
        color: '#fff',
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
    checkboxText: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    label: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 8,
        marginTop: 8,
        letterSpacing: 1,
    },
    warningText: {
        color: '#d32f2f', // Red warning color
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        marginBottom: 16,
        marginTop: 4,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    genderButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    genderText: {
        color: '#ccc',
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 1,
    },
    genderTextActive: {
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 24,
    },
    confirmButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 32,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    }
});

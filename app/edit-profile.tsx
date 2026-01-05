import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const InputField = ({ label, value, onChange, placeholder, numeric = false, editable = true }: any) => (
    <View style={[styles.inputContainer, !editable && { opacity: 0.5 }]}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, !editable && { backgroundColor: 'rgba(255,255,255,0.02)' }]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#666"
            keyboardType={numeric ? 'numeric' : 'default'}
            editable={editable}
        />
    </View>
);

export default function EditProfileScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [title, setTitle] = useState('Standard Member');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | ''>('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const uName = await AsyncStorage.getItem('userName');
            const uSurname = await AsyncStorage.getItem('userSurname');
            const uTitle = await AsyncStorage.getItem('userTitle');
            const uDob = await AsyncStorage.getItem('userDob');
            const uGender = await AsyncStorage.getItem('userGender');
            const uHeight = await AsyncStorage.getItem('userHeight');
            const uWeight = await AsyncStorage.getItem('userWeight');

            if (uName) setName(uName);
            if (uSurname) setSurname(uSurname);
            if (uTitle) setTitle(uTitle);
            if (uDob) setBirthDate(uDob);
            if (uGender) setGender(uGender as any);
            if (uHeight) setHeight(uHeight);
            if (uWeight) setWeight(uWeight);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userSurname', surname);
            await AsyncStorage.setItem('userTitle', title);
            await AsyncStorage.setItem('userDob', birthDate);
            await AsyncStorage.setItem('userGender', gender);
            await AsyncStorage.setItem('userHeight', height);
            await AsyncStorage.setItem('userWeight', weight);

            router.back();
        } catch (e) {
            console.error(e);
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

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.editProfile.header')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.content}>

                            <InputField
                                label={t('profile.editProfile.name')}
                                value={name}
                                onChange={setName}
                                placeholder="Name"
                            />

                            <InputField
                                label={t('profile.editProfile.surname')}
                                value={surname}
                                onChange={setSurname}
                                placeholder="Surname"
                            />

                            <InputField
                                label={t('profile.editProfile.memberProfile')}
                                value={title}
                                onChange={setTitle}
                                placeholder="e.g. Pro Athlete"
                                editable={false}
                            />

                            <InputField
                                label={t('profile.editProfile.birthDate')}
                                value={birthDate}
                                onChange={(text: string) => {
                                    // Remove non-numeric characters
                                    const numeric = text.replace(/[^0-9]/g, '');

                                    // Format as DD.MM.YYYY
                                    let formatted = numeric;
                                    if (numeric.length > 2) {
                                        formatted = numeric.substring(0, 2) + '.' + numeric.substring(2);
                                    }
                                    if (numeric.length > 4) {
                                        formatted = formatted.substring(0, 5) + '.' + numeric.substring(4, 8);
                                    }

                                    setBirthDate(formatted);
                                }}
                                placeholder="DD.MM.YYYY"
                                numeric
                            />

                            {/* Gender Selection */}
                            <Text style={styles.label}>{t('profile.editProfile.gender.label')}</Text>
                            <View style={styles.genderContainer}>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                    onPress={() => setGender('male')}
                                >
                                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                                        {t('profile.editProfile.gender.male')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                    onPress={() => setGender('female')}
                                >
                                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                                        {t('profile.editProfile.gender.female')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <InputField
                                        label={t('profile.editProfile.height')}
                                        value={height}
                                        onChange={setHeight}
                                        placeholder="180"
                                        numeric
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <InputField
                                        label={t('profile.editProfile.weight')}
                                        value={weight}
                                        onChange={setWeight}
                                        placeholder="80"
                                        numeric
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>{t('profile.editProfile.save')}</Text>
                                <Check color="#000" size={20} />
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
        backgroundColor: 'rgba(0,0,0,0.9)',
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
        padding: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 16,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    genderButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    genderText: {
        color: '#888',
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
    },
    genderTextActive: {
        color: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    saveButton: {
        backgroundColor: Colors.dark.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 8,
        marginTop: 20,
        gap: 10,
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

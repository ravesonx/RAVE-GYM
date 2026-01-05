import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Circle, Ruler, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ManualMeasurementScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    // Form States
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [neck, setNeck] = useState('');
    const [waist, setWaist] = useState('');
    const [hip, setHip] = useState('');

    const handleSave = async () => {
        try {
            if (!weight && !waist && !hip) {
                Alert.alert(t('register.validationFields'), "Lütfen en az bir değer giriniz.");
                return;
            }

            const newMeasurement = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                gender,
                birthDate,
                height,
                weight,
                neck,
                waist,
                hip
            };

            const existingData = await AsyncStorage.getItem('userMeasurements');
            const measurements = existingData ? JSON.parse(existingData) : [];

            measurements.unshift(newMeasurement);

            await AsyncStorage.setItem('userMeasurements', JSON.stringify(measurements));
            router.back();
        } catch (error) {
            console.error('Error saving measurement:', error);
            Alert.alert("Hata", "Kaydedilirken bir sorun oluştu.");
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
                        <Text style={styles.headerTitle}>{t('profile.measurements.manual')}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.content}>

                            <Text style={styles.sectionTitle}>{t('profile.measurements.form.title')}</Text>

                            <View style={styles.formCard}>

                                {/* Gender Selection (Simplified for now) */}
                                <View style={styles.row}>
                                    <TouchableOpacity
                                        style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                                        onPress={() => setGender('male')}
                                    >
                                        <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>{t('profile.editProfile.gender.male')}</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 12 }} />
                                    <TouchableOpacity
                                        style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                                        onPress={() => setGender('female')}
                                    >
                                        <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>{t('profile.editProfile.gender.female')}</Text>
                                    </TouchableOpacity>
                                </View>

                                <InputField
                                    icon={Calendar}
                                    placeholder={t('profile.measurements.form.birthDate')}
                                    value={birthDate}
                                    onChange={setBirthDate}
                                // In a real app, use a DatePicker
                                />

                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <InputField
                                            icon={Ruler}
                                            placeholder={t('profile.measurements.form.height')}
                                            value={height}
                                            onChange={setHeight}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={{ width: 12 }} />
                                    <View style={{ flex: 1 }}>
                                        <InputField
                                            icon={Circle} // Use a weight icon if available, Circle as placeholder
                                            placeholder={t('profile.measurements.form.weight')}
                                            value={weight}
                                            onChange={setWeight}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <InputField
                                    icon={Ruler}
                                    placeholder={t('profile.measurements.form.neck')}
                                    value={neck}
                                    onChange={setNeck}
                                    keyboardType="numeric"
                                />

                                <InputField
                                    icon={Ruler}
                                    placeholder={t('profile.measurements.form.waist')}
                                    value={waist}
                                    onChange={setWaist}
                                    keyboardType="numeric"
                                />

                                <InputField
                                    icon={Ruler}
                                    placeholder={t('profile.measurements.form.hip')}
                                    value={hip}
                                    onChange={setHip}
                                    keyboardType="numeric"
                                />

                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>

                    {/* Footer Save Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Save color="#000" size={24} />
                            <Text style={styles.saveButtonText}>{t('profile.measurements.form.save')}</Text>
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

function InputField({ icon: Icon, placeholder, value, onChange, keyboardType = 'default' }: any) {
    return (
        <View style={styles.inputContainer}>
            <Icon color={Colors.dark.icon} size={20} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#888"
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    formCard: {
        backgroundColor: 'rgba(20,20,20,0.6)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        color: '#fff',
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    genderButton: {
        flex: 1,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    genderButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    genderText: {
        color: '#888',
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
    },
    genderTextActive: {
        color: '#000',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#000',
    },
    saveButton: {
        backgroundColor: Colors.dark.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 0.5,
    },
});

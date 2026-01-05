import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowRight, MapPin, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MAJOR_CITIES_TR = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
    "Gaziantep", "Mersin", "Kocaeli", "Diyarbakır", "Hatay", "Manisa",
    "Kayseri", "Samsun", "Balıkesir", "Kahramanmaraş", "Van", "Aydın",
    "Denizli", "Sakarya", "Tekirdağ", "Muğla", "Eskişehir", "Mardin"
];

export default function CitySelectionScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [search, setSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const filteredCities = MAJOR_CITIES_TR.filter(city =>
        city.toLowerCase().includes(search.toLowerCase())
    );

    const handleContinue = async () => {
        if (!selectedCity) return;
        try {
            await AsyncStorage.setItem('userCity', selectedCity);
            router.replace('/(tabs)');
        } catch (e) {
            console.error('Failed to save city', e);
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
                    {/* Top Left Logo */}
                    <View style={styles.topLogoContainer}>
                        <Image
                            source={require('@/assets/images/rave_logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Language Switcher */}
                    <View style={styles.langContainer}>
                        <TouchableOpacity onPress={() => changeLanguage('tr')} style={[styles.langButton, i18n.language === 'tr' && styles.langButtonActive]}>
                            <Text style={[styles.langText, i18n.language === 'tr' && styles.langTextActive]}>TR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage('en')} style={[styles.langButton, i18n.language === 'en' && styles.langButtonActive]}>
                            <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>EN</Text>
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>{t('citySelection.title')}</Text>
                            <Text style={styles.subtitle}>{t('citySelection.subtitle')}</Text>
                        </View>

                        <View style={styles.content}>
                            {/* Search Bar */}
                            <View style={styles.searchContainer}>
                                <Search color="#888" size={20} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder={t('citySelection.searchPlaceholder')}
                                    placeholderTextColor="#888"
                                    value={search}
                                    onChangeText={setSearch}
                                />
                            </View>

                            {/* City List */}
                            <ScrollView
                                style={styles.cityList}
                                contentContainerStyle={styles.cityListContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {filteredCities.map((city, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.cityItem,
                                            selectedCity === city && styles.cityItemActive
                                        ]}
                                        onPress={() => setSelectedCity(city)}
                                    >
                                        <View style={styles.cityInfo}>
                                            <MapPin
                                                size={20}
                                                color={selectedCity === city ? Colors.dark.primary : '#888'}
                                            />
                                            <Text style={[
                                                styles.cityName,
                                                selectedCity === city && styles.cityNameActive
                                            ]}>
                                                {city}
                                            </Text>
                                        </View>
                                        {selectedCity === city && (
                                            <View style={styles.activeIndicator} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Continue Button */}
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    !selectedCity && styles.buttonDisabled
                                ]}
                                onPress={handleContinue}
                                disabled={!selectedCity}
                            >
                                <Text style={styles.buttonText}>{t('citySelection.continue')}</Text>
                                <ArrowRight color="#000" size={20} />
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    safeArea: {
        flex: 1,
    },
    topLogoContainer: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10,
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    header: {
        marginTop: 120, // Space for logo
        marginBottom: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: Colors.dark.text,
        marginBottom: 8,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        fontFamily: 'Inter_300Light',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    cityList: {
        flex: 1,
        marginBottom: 24,
    },
    cityListContent: {
        gap: 12,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cityItemActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: Colors.dark.primary,
    },
    cityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cityName: {
        fontSize: 18,
        color: '#888',
        fontFamily: 'Oswald_400Regular',
    },
    cityNameActive: {
        color: Colors.dark.text,
        fontFamily: 'Oswald_500Medium',
    },
    activeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.dark.primary,
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
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#444',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
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
    },
});

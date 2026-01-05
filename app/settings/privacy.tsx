import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacySettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const value = await AsyncStorage.getItem('accountPrivacy');
                if (value !== null) {
                    setIsPrivate(JSON.parse(value));
                }
            } catch (error) {
                console.error('Failed to load privacy settings:', error);
            }
        };
        loadSettings();
    }, []);

    const toggleSwitch = async (value: boolean) => {
        setIsPrivate(value);
        try {
            await AsyncStorage.setItem('accountPrivacy', JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save privacy settings:', error);
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
                        <Text style={styles.headerTitle}>{t('profile.settings.privacy')}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Text style={styles.label}>{t('profile.settings.privacyPage.label')}</Text>
                            <Switch
                                trackColor={{ false: '#333', true: Colors.dark.primary }}
                                thumbColor={isPrivate ? '#000' : '#f4f3f4'}
                                ios_backgroundColor="#333"
                                onValueChange={toggleSwitch}
                                value={isPrivate}
                            />
                        </View>
                        <Text style={styles.description}>
                            {t('profile.settings.privacyPage.description')}
                        </Text>
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
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    content: {
        paddingHorizontal: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 16,
    },
    label: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_500Medium',
    },
    description: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
        paddingHorizontal: 4,
    },
});

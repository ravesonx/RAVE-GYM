import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Check, Dumbbell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MembershipAddonsScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    // State
    const [ptSelected, setPtSelected] = useState(false);
    const [planName, setPlanName] = useState('');
    const [planPrice, setPlanPrice] = useState(0);

    // PT Price Constant
    const PT_PRICE = 1500;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedName = await AsyncStorage.getItem('selectedPlanName');
            const storedPrice = await AsyncStorage.getItem('selectedPlanPrice');

            if (storedName) setPlanName(storedName);
            if (storedPrice) setPlanPrice(parseInt(storedPrice, 10));
        } catch (e) {
            console.error("Failed to load plan data", e);
        }
    };

    const totalPrice = planPrice + (ptSelected ? PT_PRICE : 0);

    const handleContinue = async () => {
        // Save final details for Payment screen
        await AsyncStorage.setItem('finalPrice', totalPrice.toString());
        await AsyncStorage.setItem('hasPT', ptSelected ? 'true' : 'false');

        router.push('/membership/payment');
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
                        <Text style={styles.headerTitle}>{t('profile.membership.addons.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>

                        <Text style={styles.subtitle}>{t('profile.membership.addons.subtitle')}</Text>

                        {/* Selected Package Summary */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.cardLabel}>{t('profile.membership.currentPackage')}</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.planName}>{planName || 'Standart'}</Text>
                                <Text style={styles.planPrice}>{planPrice} TL</Text>
                            </View>
                        </View>

                        {/* PT Option Card */}
                        <TouchableOpacity
                            style={[styles.servicesCard, ptSelected && styles.cardSelected]}
                            onPress={() => setPtSelected(!ptSelected)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.iconContainer}>
                                <Dumbbell color={ptSelected ? "#000" : Colors.dark.primary} size={28} />
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={[styles.serviceTitle, ptSelected && styles.textSelected]}>
                                    PERSONAL TRAINER DESTEĞİ
                                </Text>
                                <Text style={[styles.serviceDesc, ptSelected && styles.textSelectedDim]}>
                                    Aylık Birebir Koçluk Hizmeti
                                </Text>
                                <Text style={[styles.servicePrice, ptSelected && styles.textSelected]}>
                                    + {PT_PRICE} TL
                                </Text>
                            </View>

                            <View style={[styles.checkbox, ptSelected && styles.checkboxSelected]}>
                                {ptSelected && <Check color="#000" size={16} />}
                            </View>
                        </TouchableOpacity>

                    </ScrollView>

                    {/* Footer / Total & Action */}
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>TOPLAM TUTAR</Text>
                            <Text style={styles.totalAmount}>{totalPrice} TL</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueButtonText}>{t('profile.membership.addons.continue')}</Text>
                            <ArrowRight color="#000" size={20} />
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
        backgroundColor: 'rgba(0,0,0,0.94)',
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
        paddingBottom: 120, // Space for footer
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center'
    },
    summaryCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardLabel: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 8,
        letterSpacing: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        color: Colors.dark.primary,
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
    },
    planPrice: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
    },
    servicesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardSelected: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    serviceTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    serviceDesc: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        marginBottom: 8,
    },
    servicePrice: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontFamily: 'Oswald_700Bold',
    },
    textSelected: {
        color: '#000',
    },
    textSelectedDim: {
        color: 'rgba(0,0,0,0.7)',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    checkboxSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 2,
    },
    totalAmount: {
        color: Colors.dark.primary,
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
    },
    continueButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        gap: 8,
    },
    continueButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});

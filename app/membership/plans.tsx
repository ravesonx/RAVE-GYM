import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, CheckCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PLANS = {
    CLASSIC: {
        basePrice: 3500,
        discountedBase: 2000,
        features: ["profile.membership.packages.classic.features.0", "profile.membership.packages.classic.features.1", "profile.membership.packages.classic.features.2"]
    },
    GOLD: {
        basePrice: 5000,
        discountedBase: 3500,
        features: ["profile.membership.packages.gold.features.0", "profile.membership.packages.gold.features.1", "profile.membership.packages.gold.features.2"]
    },
    PLATINUM: {
        basePrice: 7500,
        discountedBase: 5500,
        features: ["profile.membership.packages.platinum.features.0", "profile.membership.packages.platinum.features.1", "profile.membership.packages.platinum.features.2"]
    }
};

const getCityMultiplier = (city: string) => {
    const tier1 = ["İstanbul", "Ankara", "İzmir", "Antalya", "Muğla"];
    const tier2 = ["Bursa", "Eskişehir", "Kocaeli", "Adana", "Mersin", "Gaziantep", "Kayseri", "Samsun", "Tekirdağ", "Sakarya", "Denizli", "Trabzon"];

    if (tier1.includes(city)) return 1.0;
    if (tier2.includes(city)) return 0.85; // %15 Cheaper
    return 0.70; // %30 Cheaper for others
};

export default function MembershipPlansScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city: string }>();

    const multiplier = city ? getCityMultiplier(city) : 1.0;

    const [billingCycle, setBillingCycle] = useState<'monthly' | 'upfront'>('upfront');
    const [selectedPackage, setSelectedPackage] = useState<'CLASSIC' | 'GOLD' | 'PLATINUM' | null>(null);
    const [promoCode, setPromoCode] = useState('');

    const toggleBilling = (cycle: 'monthly' | 'upfront') => {
        setBillingCycle(cycle);
    };

    const renderPackageCard = (type: 'CLASSIC' | 'GOLD' | 'PLATINUM', data: any) => {
        const isSelected = selectedPackage === type;

        // Calculate prices with multiplier
        const finalPrice = Math.floor((billingCycle === 'upfront' ? data.discountedBase : data.basePrice) * multiplier);
        const originalPrice = billingCycle === 'upfront' ? Math.floor(data.basePrice * multiplier) : null;

        return (
            <TouchableOpacity
                key={type}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedPackage(type)}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                        {t(`profile.membership.packages.${type.toLowerCase()}.name`)}
                    </Text>
                    {isSelected && <CheckCircle color="#000" size={24} fill={Colors.dark.primary} />}
                </View>

                {/* Price Section */}
                <View style={styles.priceContainer}>
                    {originalPrice && (
                        <Text style={styles.originalPrice}>
                            {originalPrice} TL
                        </Text>
                    )}
                    <Text style={[styles.price, isSelected && styles.priceSelected]}>
                        {finalPrice} TL
                        <Text style={[styles.period, isSelected && styles.periodSelected]}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</Text>
                    </Text>
                </View>

                {/* Divider */}
                <View style={[styles.divider, isSelected && styles.dividerSelected]} />

                {/* Features */}
                <View style={styles.featuresList}>
                    {data.features.map((featureKey: string, index: number) => (
                        <View key={index} style={styles.featureItem}>
                            <Check color={isSelected ? "#000" : Colors.dark.primary} size={16} />
                            <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                                {t(featureKey)}
                            </Text>
                        </View>
                    ))}
                </View>

            </TouchableOpacity>
        );
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
                        <Text style={styles.headerTitle}>{t('profile.membership.plansTitle')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>

                        {/* Billing Toggle - Top Section */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleOption, billingCycle === 'monthly' && styles.toggleOptionActive]}
                                onPress={() => toggleBilling('monthly')}
                            >
                                <Text style={[styles.toggleTitle, billingCycle === 'monthly' && styles.toggleTextActive]}>{t('profile.membership.monthly')}</Text>
                                <Text style={styles.toggleDesc}>{t('profile.membership.monthlyDesc')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.toggleOption, billingCycle === 'upfront' && styles.toggleOptionActive]}
                                onPress={() => toggleBilling('upfront')}
                            >
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>%20</Text>
                                </View>
                                <Text style={[styles.toggleTitle, billingCycle === 'upfront' && styles.toggleTextActive]}>{t('profile.membership.upfront')}</Text>
                                <Text style={styles.toggleDesc}>{t('profile.membership.upfrontDesc')}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>{t('profile.membership.buy')}</Text>

                        {/* Package Cards */}
                        {renderPackageCard('CLASSIC', PLANS.CLASSIC)}
                        {renderPackageCard('GOLD', PLANS.GOLD)}
                        {renderPackageCard('PLATINUM', PLANS.PLATINUM)}

                        {/* Promo Code */}
                        <View style={styles.promoContainer}>
                            <Text style={styles.inputLabel}>{t('profile.membership.promoCode')}</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={promoCode}
                                    onChangeText={setPromoCode}
                                    placeholder="CODE"
                                    placeholderTextColor="#666"
                                />
                                <TouchableOpacity style={styles.applyButton}>
                                    <Text style={styles.applyText}>{t('profile.membership.apply')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[styles.continueButton, !selectedPackage && { backgroundColor: '#333', opacity: 0.5 }]}
                            disabled={!selectedPackage}
                            onPress={async () => {
                                if (!selectedPackage) return;
                                const plan = PLANS[selectedPackage];
                                const price = Math.floor((billingCycle === 'upfront' ? plan.discountedBase : plan.basePrice) * multiplier);

                                await AsyncStorage.setItem('selectedPlanName', t(`profile.membership.packages.${selectedPackage.toLowerCase()}.name`));
                                await AsyncStorage.setItem('selectedPlanPrice', price.toString());

                                router.push('/membership/register');
                            }}
                        >
                            <Text style={[styles.continueButtonText, !selectedPackage && { color: '#666' }]}>
                                {t('profile.membership.buy')}
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>

                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

// Helper for CheckCircle icon since it's not imported directly from lucide-react-native in some versions or I missed it.
// Actually I imported it above.


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
        backgroundColor: 'rgba(0,0,0,0.95)', // Slightly darker for cards
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
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 32,
    },
    toggleOption: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    toggleOptionActive: {
        backgroundColor: Colors.dark.primary,
    },
    toggleTitle: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 4,
    },
    toggleTextActive: {
        color: '#000',
    },
    toggleDesc: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
    },
    discountBadge: {
        position: 'absolute',
        top: -8,
        right: 10,
        backgroundColor: '#FF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 16,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 24,
        marginBottom: 16,
    },
    cardSelected: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
    },
    cardTitleSelected: {
        color: '#000',
    },
    priceContainer: {
        marginBottom: 16,
    },
    originalPrice: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Oswald_500Medium',
        textDecorationLine: 'line-through',
        marginBottom: 2,
    },
    price: {
        color: Colors.dark.primary,
        fontSize: 28,
        fontFamily: 'Oswald_700Bold',
    },
    priceSelected: {
        color: '#000',
    },
    period: {
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        color: '#888',
    },
    periodSelected: {
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 16,
    },
    dividerSelected: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    featuresList: {
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    featureTextSelected: {
        color: '#000',
    },
    promoContainer: {
        marginTop: 24,
    },
    inputLabel: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1,
    },
    applyButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    applyText: {
        color: '#fff',
        fontFamily: 'Oswald_600SemiBold',
    },
    continueButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 32,
        marginBottom: 20,
    },
    continueButtonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    }
});

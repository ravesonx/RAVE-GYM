import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MembershipInfoScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    // Mock Random Member ID
    const [memberId] = useState(Math.floor(10000000 + Math.random() * 90000000).toString());

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

                    <View style={styles.content}>

                        {/* Info Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{t('profile.membership.currentPackage')}</Text>
                                <CreditCard color={Colors.dark.primary} size={24} />
                            </View>

                            <Text style={styles.packageName}>CLASSIC</Text>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <View>
                                    <Text style={styles.label}>{t('profile.membership.memberId')}</Text>
                                    <Text style={styles.value}>{memberId}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.label}>{t('profile.membership.status')}</Text>
                                    <View style={styles.statusContainer}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.statusText}>{t('profile.membership.active')}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Renew Button */}
                        <TouchableOpacity
                            style={styles.renewButton}
                            onPress={() => router.push('/membership/selection')}
                        >
                            <Text style={styles.renewButtonText}>{t('profile.membership.renew')}</Text>
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
        marginBottom: 40,
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
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 32,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 1,
    },
    packageName: {
        color: '#fff',
        fontSize: 32,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50', // Green
    },
    statusText: {
        color: '#4CAF50',
        fontSize: 14,
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 0.5,
    },
    renewButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 8,
    },
    renewButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
    }
});

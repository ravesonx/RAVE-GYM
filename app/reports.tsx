import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ChevronLeft, Clock, Dumbbell, Flame } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportsScreen() {
    const { t } = useTranslation(); // Ideally use translations but defaults will be Turkish as requested
    const router = useRouter();
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    // Dummy Data
    const weeklyStats = {
        workoutCount: 4,
        duration: '120 dk',
        calories: '2400 kcal',
        weight: '15000 kg'
    };

    const monthlyStats = {
        workoutCount: 18,
        duration: '650 dk',
        calories: '12500 kcal',
        weight: '65000 kg'
    };

    const currentStats = period === 'weekly' ? weeklyStats : monthlyStats;

    const StatCard = ({ icon: Icon, value, label, color }: { icon: any, value: string, label: string, color: string }) => (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
                <Icon color={color} size={24} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardValue}>{value}</Text>
                <Text style={styles.cardLabel}>{label}</Text>
            </View>
        </View>
    );

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
                            <ChevronLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.reports.title')}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Toggle Period */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, period === 'weekly' && styles.toggleButtonActive]}
                            onPress={() => setPeriod('weekly')}
                        >
                            <Text style={[styles.toggleText, period === 'weekly' && styles.toggleTextActive]}>{t('profile.reports.weekly')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, period === 'monthly' && styles.toggleButtonActive]}
                            onPress={() => setPeriod('monthly')}
                        >
                            <Text style={[styles.toggleText, period === 'monthly' && styles.toggleTextActive]}>{t('profile.reports.monthly')}</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>

                        {/* Upper Section: Workouts & Duration */}
                        <Text style={styles.sectionTitle}>Antrenman Süreci</Text>
                        <View style={styles.row}>
                            <View style={styles.halfCard}>
                                <StatCard
                                    icon={Dumbbell}
                                    value={currentStats.workoutCount.toString()}
                                    label={t('profile.reports.stats.count')}
                                    color={Colors.dark.primary}
                                />
                            </View>
                            <View style={styles.halfCard}>
                                <StatCard
                                    icon={Clock}
                                    value={currentStats.duration}
                                    label={t('profile.reports.stats.time')}
                                    color="#4ADE80"
                                />
                            </View>
                        </View>

                        {/* Lower Section: Calories & Weight */}
                        <Text style={styles.sectionTitle}>Performans</Text>
                        <View style={styles.fullCardContainer}>
                            <StatCard
                                icon={Flame}
                                value={currentStats.calories}
                                label={t('profile.reports.stats.kcal')}
                                color="#F87171"
                            />
                        </View>

                        <View style={styles.fullCardContainer}>
                            <StatCard
                                icon={Dumbbell}
                                value={currentStats.weight}
                                label={t('profile.reports.stats.weight')}
                                color="#60A5FA"
                            />
                        </View>

                    </ScrollView>

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
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 24,
        borderRadius: 12,
        padding: 4,
        marginBottom: 32,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    toggleText: {
        color: '#666',
        fontFamily: 'Oswald_400Regular',
        fontSize: 16,
    },
    toggleTextActive: {
        color: '#fff',
        fontFamily: 'Oswald_600SemiBold',
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
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    halfCard: {
        flex: 1,
        height: 120, // force height
    },
    fullCardContainer: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'rgba(20,20,20,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardValue: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 4,
    },
    cardLabel: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    }
});

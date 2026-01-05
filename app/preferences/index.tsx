import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Activity, ArrowLeft, CalendarDays, ChevronRight, Dumbbell, Target, Timer, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreferencesScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const menuItems = [
        { id: 'target', title: t('profile.preferences.target.title'), icon: <Target size={24} color={Colors.dark.primary} /> },
        { id: 'experience', title: t('profile.preferences.experience.title'), icon: <Dumbbell size={24} color={Colors.dark.primary} /> },
        { id: 'frequency', title: t('profile.preferences.frequency.title'), icon: <Activity size={24} color={Colors.dark.primary} /> },
        { id: 'formLevel', title: t('profile.preferences.formLevel.title'), icon: <TrendingUp size={24} color={Colors.dark.primary} /> },
        { id: 'weekly', title: t('profile.preferences.weekly.title'), icon: <CalendarDays size={24} color={Colors.dark.primary} /> },
        { id: 'daily', title: t('profile.preferences.daily.title'), icon: <Timer size={24} color={Colors.dark.primary} /> },
    ];

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
                        <Text style={styles.headerTitle}>{t('profile.preferences.title')}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => router.push(`/preferences/${item.id}`)}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={styles.iconContainer}>
                                        {item.icon}
                                    </View>
                                    <Text style={styles.menuText}>{item.title}</Text>
                                </View>
                                <ChevronRight color="#666" size={20} />
                            </TouchableOpacity>
                        ))}
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
        textTransform: 'uppercase',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(227, 255, 59, 0.1)', // Primary color opacity
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});

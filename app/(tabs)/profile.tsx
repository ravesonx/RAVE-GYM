import { Colors } from '@/constants/theme';
import { auth } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { Camera, ChevronRight, LogOut, Settings, Trophy, User, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ImageBackground, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [name, setName] = useState('MEMBER');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock Data
    const totalPoints = 1250;
    const stats = {
        workouts: 12,
        kcal: 4500,
        time: 320
    };

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const uName = await AsyncStorage.getItem('userName');
                const uSurname = await AsyncStorage.getItem('userSurname');
                const uImage = await AsyncStorage.getItem('userImage');

                if (uName && uSurname) setName(`${uName} ${uSurname}`);
                if (uImage) setProfileImage(uImage);
            };
            loadData();
        }, [])
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            await AsyncStorage.setItem('userImage', result.assets[0].uri);
        }
    };

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        try {
            console.log("Logging out...");

            // Race signOut with a 2-second timeout so UI doesn't freeze
            await Promise.race([
                auth.signOut(),
                new Promise((resolve) => setTimeout(resolve, 2000))
            ]);

            await AsyncStorage.clear();

            console.log("Navigating to Login Screen...");
            router.replace('/');
        } catch (error) {
            console.error("Logout error", error);
            // Even if error, force redirect
            router.replace('/');
        } finally {
            setLoading(false);
        }
    };

    const MenuItem = ({ title, onPress }: { title: string, onPress?: () => void }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Text style={styles.menuText}>{title}</Text>
            <ChevronRight color="#666" size={20} />
        </TouchableOpacity>
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
                        <View style={{ width: 24 }} />

                        <View style={styles.headerContent}>
                            {/* Profile Picture */}
                            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <User color="#555" size={40} />
                                    </View>
                                )}
                                <View style={styles.editIconBadge}>
                                    <Camera color="#000" size={12} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.nameText}>{name}</Text>
                                <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
                                    <Text style={styles.editText}>{t('profile.edit')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                            <Settings color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                        {/* Gamification / Points */}
                        <View style={styles.pointsContainer}>
                            <View style={styles.trophyCircle}>
                                <Trophy color={Colors.dark.primary} size={32} />
                            </View>
                            <Text style={styles.pointsValue}>{totalPoints}</Text>
                            <Text style={styles.pointsLabel}>{t('profile.pointsParams')}</Text>
                            <TouchableOpacity style={styles.leaderboardButton} onPress={() => router.push('/leaderboard')}>
                                <Text style={styles.leaderboardText}>{t('profile.leaderboardLabel')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.workouts}</Text>
                                <Text style={styles.statLabel}>{t('profile.stats.workouts')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.kcal}</Text>
                                <Text style={styles.statLabel}>{t('profile.stats.kcal')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.time}</Text>
                                <Text style={styles.statLabel}>{t('profile.stats.time')}</Text>
                            </View>
                        </View>

                        {/* Menu List */}
                        <View style={styles.menuContainer}>
                            <MenuItem title={t('profile.menu.membership')} onPress={() => router.push('/membership')} />
                            <MenuItem title={t('profile.menu.reports')} onPress={() => router.push('/reports')} />
                            <MenuItem title={t('profile.menu.measurements')} onPress={() => router.push('/measurements')} />
                            <MenuItem title={t('profile.menu.preferences')} onPress={() => router.push('/preferences')} />

                            <TouchableOpacity
                                style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 24 }]}
                                onPress={handleLogout}
                                disabled={loading}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    {loading ? (
                                        <ActivityIndicator color="#EF4444" size="small" />
                                    ) : (
                                        <LogOut color="#EF4444" size={20} />
                                    )}
                                    <Text style={[styles.menuText, { color: '#EF4444' }]}>
                                        {loading ? "ÇIKIŞ YAPILIYOR..." : "ÇIKIŞ"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                    {/* Settings Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={settingsVisible}
                        onRequestClose={() => setSettingsVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{t('profile.settings.title')}</Text>
                                    <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                                        <X color="#fff" size={24} />
                                    </TouchableOpacity>
                                </View>

                                <MenuItem title={t('profile.settings.privacy')} onPress={() => { setSettingsVisible(false); router.push('/settings/privacy'); }} />
                                <MenuItem title={t('profile.settings.contact')} onPress={async () => {
                                    const url = 'https://wa.me/'; // You can add a number like https://wa.me/905555555555
                                    const supported = await Linking.canOpenURL(url);
                                    if (supported) {
                                        await Linking.openURL(url);
                                    } else {
                                        // Try opening as a web page if app fails, or alert
                                        await Linking.openURL('https://web.whatsapp.com/');
                                    }
                                }} />
                                <MenuItem title={t('profile.settings.terms')} onPress={() => { setSettingsVisible(false); router.push('/settings/terms'); }} />
                            </View>
                        </View>
                    </Modal>

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
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 20,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center', // Center everything vertically in the header content
    },
    avatarContainer: {
        width: 80,
        height: 80,
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.dark.primary,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    nameText: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    editButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
    },
    editText: {
        color: '#ccc',
        fontSize: 10,
        fontFamily: 'Oswald_400Regular',
        letterSpacing: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    pointsContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    trophyCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    pointsValue: {
        color: Colors.dark.primary, // White or Theme Color
        fontSize: 48,
        fontFamily: 'Oswald_700Bold',
        lineHeight: 56,
    },
    pointsLabel: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        letterSpacing: 2,
        marginBottom: 16,
    },
    leaderboardButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    leaderboardText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(20,20,20,0.6)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 4,
    },
    statLabel: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    menuContainer: {
        marginBottom: 32,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_400Regular',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#111',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
    }
});

import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Crown, Medal, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MOCK_NAMES = [
    "Ahmet Y.", "Ayşe K.", "Mehmet D.", "Fatma S.", "Mustafa A.",
    "Zeynep B.", "Ali C.", "Elif T.", "Emre O.", "Selin P.",
    "Can R.", "Gökçe H.", "Burak M.", "Ceren N.", "Barış U."
];

// Generate random leaderboard data
const generateLeaderboard = (userPoints: number, userName: string) => {
    let data = MOCK_NAMES.map((name, index) => ({
        id: `mock-${index}`,
        name,
        points: Math.floor(Math.random() * (3000 - 1000) + 1000), // Random points between 1000-3000
        isUser: false,
        rank: 0
    }));

    // Add User
    data.push({
        id: 'user',
        name: userName || 'YOU',
        points: userPoints,
        isUser: true,
        rank: 0
    });

    // Sort by points descending
    data.sort((a, b) => b.points - a.points);

    // Assign ranks
    data = data.map((item, index) => ({ ...item, rank: index + 1 }));

    return data;
};

export default function LeaderboardScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const uName = await AsyncStorage.getItem('userName');
            const uSurname = await AsyncStorage.getItem('userSurname');
            // Assuming user points is fetched or static for now
            const userPoints = 1250;
            const fullName = uName ? `${uName} ${uSurname?.charAt(0)}.` : 'YOU';

            setLeaderboardData(generateLeaderboard(userPoints, fullName));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUser = item.isUser;
        const isTop3 = item.rank <= 3;

        let rankColor = '#666';
        let RankIcon = null;

        if (item.rank === 1) {
            rankColor = '#FFD700'; // Gold
            RankIcon = <Crown color={rankColor} size={20} fill={rankColor} />;
        } else if (item.rank === 2) {
            rankColor = '#C0C0C0'; // Silver
            RankIcon = <Medal color={rankColor} size={20} />;
        } else if (item.rank === 3) {
            rankColor = '#CD7F32'; // Bronze
            RankIcon = <Medal color={rankColor} size={20} />;
        }

        return (
            <View style={[styles.row, isUser && styles.userRow]}>
                <View style={[styles.rankContainer, isTop3 && styles.rankContainerTop]}>
                    {RankIcon ? RankIcon : <Text style={styles.rankText}>{item.rank}</Text>}
                </View>

                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, isUser && styles.userAvatar]}>
                        <User color={isUser ? "#000" : "#fff"} size={16} />
                    </View>
                </View>

                <Text style={[styles.nameText, isUser && styles.userNameText]}>
                    {item.name} {isUser && `(${t('profile.leaderboardScreen.you')})`}
                </Text>

                <Text style={[styles.pointsText, isTop3 && { color: rankColor }, isUser && styles.userPointsText]}>
                    {item.points}
                </Text>
            </View>
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
                        <Text style={styles.headerTitle}>{t('profile.leaderboardScreen.title')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { width: 40, textAlign: 'center' }]}>{t('profile.leaderboardScreen.rank')}</Text>
                        <View style={{ width: 40 }} />
                        <Text style={[styles.tableHeaderText, { flex: 1 }]}>{t('profile.leaderboardScreen.member')}</Text>
                        <Text style={styles.tableHeaderText}>{t('profile.leaderboardScreen.points')}</Text>
                    </View>

                    <FlatList
                        data={leaderboardData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

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
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: 8,
    },
    tableHeaderText: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Oswald_500Medium',
        letterSpacing: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    userRow: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        borderBottomWidth: 0,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankContainerTop: {
        // Special styling for top 3 if needed
    },
    rankText: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Oswald_700Bold',
    },
    avatarContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        backgroundColor: Colors.dark.primary,
    },
    nameText: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        flex: 1,
    },
    userNameText: {
        color: '#fff',
        fontFamily: 'Inter_700Bold',
    },
    pointsText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
    },
    userPointsText: {
        color: Colors.dark.primary,
    },
});

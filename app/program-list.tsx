import { Colors } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProgramListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { zone } = useLocalSearchParams();

    // Map zone key to display content
    const zoneTitle = zone ? t(`home.zones.${zone}`) : t('home.programTitle');

    // Get programs array safely
    const programsRaw = t(`home.programs.${zone}`, { returnObjects: true });
    // Ensure it's an array, otherwise fallback
    const programsList = Array.isArray(programsRaw) ? programsRaw : ["Program 1", "Program 2", "Program 3"];

    const workouts = [
        { id: 1, title: programsList[0] || t('home.workout1'), duration: '45 MIN', level: 'BEGINNER' },
        { id: 2, title: programsList[1] || t('home.workout2'), duration: '60 MIN', level: 'INTERMEDIATE' },
        { id: 3, title: programsList[2] || t('home.workout3'), duration: '75 MIN', level: 'ADVANCED' },
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
                        <Text style={styles.title}>{zoneTitle}</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {workouts.map((workout, index) => (
                            <TouchableOpacity
                                key={workout.id}
                                style={styles.workoutCard}
                                onPress={() => router.push({
                                    pathname: '/workout-detail',
                                    params: {
                                        zone: zone as string,
                                        programIndex: index,
                                        title: workout.title
                                    }
                                })}
                            >
                                <View style={styles.workoutIcon}>
                                    <Play color="#000" size={24} fill="#000" />
                                </View>
                                <View style={styles.workoutInfo}>
                                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                                    <View style={styles.metaContainer}>
                                        <Text style={styles.metaText}>{workout.duration}</Text>
                                        <Text style={styles.metaSeparator}>•</Text>
                                        <Text style={styles.metaText}>{workout.level}</Text>
                                    </View>
                                </View>
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
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
    },
    content: {
        paddingHorizontal: 24,
    },
    workoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    workoutIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    workoutInfo: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Oswald_500Medium',
        marginBottom: 4,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
    metaSeparator: {
        color: '#888',
        marginHorizontal: 8,
    },
});

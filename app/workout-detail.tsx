import { Colors } from '@/constants/theme';
import { WORKOUT_DATA } from '@/constants/workouts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WorkoutDetailScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse params
    const zone = params.zone as string;
    const programIndex = parseInt(params.programIndex as string) || 0;
    const programTitle = params.title as string;

    // Fetch data
    const workoutData = WORKOUT_DATA[zone]?.[programIndex];

    // State for checking off exercises
    const [checked, setChecked] = useState<{ [key: number]: boolean }>({});

    const toggleCheck = (idx: number) => {
        setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
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
                        <Text style={styles.title}>{programTitle}</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {workoutData ? (
                            workoutData.exercises.map((exercise, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.exerciseCard, checked[index] && styles.exerciseCardChecked]}
                                    onPress={() => toggleCheck(index)}
                                >
                                    <View style={styles.checkContainer}>
                                        {checked[index] ? (
                                            <CheckCircle2 color={Colors.dark.primary} size={24} />
                                        ) : (
                                            <Circle color="#666" size={24} />
                                        )}
                                    </View>

                                    <View style={styles.exerciseInfo}>
                                        <Text style={[styles.exerciseName, checked[index] && styles.exerciseNameChecked]}>
                                            {exercise.name}
                                        </Text>
                                        <View style={styles.metaRow}>
                                            <Text style={styles.metaText}>{exercise.sets} SETS</Text>
                                            <Text style={styles.metaSeparator}>x</Text>
                                            <Text style={styles.metaText}>{exercise.reps} REPS</Text>
                                        </View>
                                        {exercise.note && (
                                            <Text style={styles.noteText}>{exercise.note}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Program details coming soon.</Text>
                            </View>
                        )}
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
        backgroundColor: 'rgba(0,0,0,0.92)', // Slightly darker for focus
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
        fontSize: 22, // Slightly smaller to fit long names
        color: '#fff',
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    exerciseCardChecked: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderColor: '#333',
    },
    checkContainer: {
        marginRight: 16,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Oswald_500Medium',
        marginBottom: 4,
    },
    exerciseNameChecked: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontFamily: 'Oswald_400Regular',
    },
    metaSeparator: {
        color: '#666',
        marginHorizontal: 8,
        fontSize: 12,
    },
    noteText: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        fontStyle: 'italic',
        marginTop: 4,
    },
    errorContainer: {
        padding: 24,
        alignItems: 'center',
    },
    errorText: {
        color: '#666',
    }
});

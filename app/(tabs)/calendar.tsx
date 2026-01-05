import { Colors } from '@/constants/theme';
import { ChevronLeft, ChevronRight, Flame, Footprints } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    const today = new Date();

    // Month Names
    const monthNamesTR = [
        'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
        'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'
    ];

    // Day Names
    const dayNamesTR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDays = getDaysInMonth(year, month);
        const daysArray = [];

        for (let i = 1; i <= numDays; i++) {
            const date = new Date(year, month, i);
            const dayName = dayNamesTR[date.getDay()];
            daysArray.push({ day: i, name: dayName });
        }
        return daysArray;
    };

    const days = generateDays();

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);

        // If going back to current month, default to today, else 1st
        const isCurrentMonth = newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear();
        setSelectedDay(isCurrentMonth ? today.getDate() : 1);
    };

    const headerText = `${monthNamesTR[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Check if a day is in the future
    const isFutureDay = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const cleanCheck = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
        const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        return cleanCheck.getTime() > cleanToday.getTime();
    };

    // Check if we can navigate to next month
    const canGoNext = () => {
        const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const cleanNextMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 1);
        const cleanToday = new Date(today.getFullYear(), today.getMonth(), 1);

        return cleanNextMonth.getTime() <= cleanToday.getTime();
    };

    // Deterministic mock stats generation
    const getStatsForDay = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Create a seed based on the date
        const seed = year * 10000 + (month + 1) * 100 + day;

        // Simple seeded random function
        const random = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const r1 = random(seed);
        const r2 = random(seed + 1);

        // Generate realistic looking data
        // Steps: 2000 to 12000
        const steps = Math.floor(r1 * 10000) + 2000;

        // Calories: roughly 0.04 - 0.05 per step plus base burn
        const calories = Math.floor(steps * 0.045 + (r2 * 200));

        return { steps, calories };
    };

    const stats = getStatsForDay(selectedDay);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/gym_bg_v2.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay} />
                <SafeAreaView style={styles.safeArea}>

                    {/* Header: Date */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => changeMonth(-1)} style={{ padding: 8 }}>
                            <ChevronLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{headerText}</Text>

                        <View style={{ width: 40, alignItems: 'center' }}>
                            {canGoNext() && (
                                <TouchableOpacity onPress={() => changeMonth(1)} style={{ padding: 8 }}>
                                    <ChevronRight color="#fff" size={24} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Date Strip */}
                    <View style={styles.dateStripContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.dateStripContent}
                        >
                            {days.map((item) => {
                                const disabled = isFutureDay(item.day);
                                return (
                                    <TouchableOpacity
                                        key={item.day}
                                        style={[
                                            styles.dateItem,
                                            selectedDay === item.day && styles.dateItemActive,
                                            disabled && { opacity: 0.3 }
                                        ]}
                                        onPress={() => !disabled && setSelectedDay(item.day)}
                                        disabled={disabled}
                                    >
                                        <Text style={[styles.dayNumber, selectedDay === item.day && styles.dayNumberActive]}>{item.day}</Text>
                                        <Text style={[styles.dayName, selectedDay === item.day && styles.dayNameActive]} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Weekly Toggle */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>{t('calendar.showWeekly', 'Haftalık Göster')}</Text>
                        <ChevronRight color="#888" size={16} style={{ transform: [{ rotate: '90deg' }] }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.mainContent}>
                        {/* Stats Grid */}
                        <View style={styles.statsRow}>
                            {/* Steps Card */}
                            <View style={styles.statCard}>
                                <View style={styles.iconContainer}>
                                    <Footprints color={Colors.dark.primary} size={24} />
                                </View>
                                <Text style={styles.statValue}>
                                    {stats.steps.toLocaleString('tr-TR')} <Text style={styles.statTotal}>/ 10.000</Text>
                                </Text>
                                <Text style={styles.statLabel}>{t('calendar.dailySteps', 'Günlük Adım')}</Text>

                                {/* Simple Progress Bar */}
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${Math.min((stats.steps / 10000) * 100, 100)}%` }]} />
                                </View>
                            </View>

                            {/* Calories Card */}
                            <View style={styles.statCard}>
                                <View style={styles.iconContainer}>
                                    <Flame color="#FF4500" size={24} />
                                </View>
                                <Text style={styles.statValue}>
                                    {stats.calories} <Text style={styles.statUnit}>kcal</Text>
                                </Text>
                                <Text style={styles.statLabel}>{t('calendar.calories', 'Kalori')}</Text>

                                {/* Simple Progress Bar */}
                                <View style={styles.progressBarBg}>
                                    <View style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min((stats.calories / 1000) * 100, 100)}%`,
                                            backgroundColor: '#FF4500'
                                        }
                                    ]} />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.92)' },
    safeArea: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 24
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1
    },

    dateStripContainer: {
        marginBottom: 8
    },
    dateStripContent: {
        paddingHorizontal: 24,
        gap: 12
    },
    dateItem: {
        width: 60,
        height: 80,
        borderRadius: 30, // Pill shape
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    dateItemActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary
    },
    dayNumber: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 4
    },
    dayNumberActive: {
        color: '#000'
    },
    dayName: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        textTransform: 'uppercase'
    },
    dayNameActive: {
        color: '#000',
        fontFamily: 'Inter_700Bold'
    },

    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 8
    },
    toggleText: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_500Medium'
    },

    mainContent: {
        paddingHorizontal: 24
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    iconContainer: {
        marginBottom: 16
    },
    statValue: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 4
    },
    statTotal: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_500Medium'
    },
    statUnit: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_500Medium'
    },
    statLabel: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginBottom: 16
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.dark.primary,
        borderRadius: 3
    }
});

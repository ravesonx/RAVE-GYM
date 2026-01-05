import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BarChart, ChevronRight, Clock, Flame, Search, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus padding

const MOCK_EXERCISES = [
    { name: 'Bench Press', sets: '3', reps: '10' },
    { name: 'Squat', sets: '3', reps: '12' },
    { name: 'Deadlift', sets: '3', reps: '8' },
    { name: 'Overhead Press', sets: '3', reps: '12' },
    { name: 'Barbell Row', sets: '3', reps: '12' },
];

const MOCK_PROGRAMS = [
    {
        id: '1', title: '5x5 Stronglifts', subtitle: 'Foundation of Strength', duration: '45', level: 'Beginner', kcal: '400',
        image: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
        exercises: [
            { name: 'Squat', sets: '5', reps: '5' },
            { name: 'Bench Press', sets: '5', reps: '5' },
            { name: 'Barbell Row', sets: '5', reps: '5' },
        ]
    },
    {
        id: '2', title: 'HIIT 1000 Burn', subtitle: 'Maximum Fat Loss', duration: '30', level: 'Advanced', kcal: '800',
        image: { uri: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800' },
        exercises: [
            { name: 'Burpees', sets: '4', reps: '20' },
            { name: 'Mountain Climbers', sets: '4', reps: '40 sec' },
            { name: 'Jump Squats', sets: '4', reps: '20' },
        ]
    },
    {
        id: '3', title: 'German Volume Training', subtitle: 'Mass Building 10x10', duration: '60', level: 'Advanced', kcal: '600',
        image: { uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800' },
        exercises: [
            { name: 'Bench Press', sets: '10', reps: '10' },
            { name: 'Lat Pulldown', sets: '10', reps: '10' },
        ]
    },
    {
        id: '4', title: 'Push / Pull / Legs', subtitle: '3 Day Split', duration: '50', level: 'Intermediate', kcal: '500',
        image: { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800' },
        exercises: MOCK_EXERCISES
    },
    {
        id: '5', title: 'Runner\'s High', subtitle: 'Endurance Focus', duration: '45', level: 'Intermediate', kcal: '600',
        image: { uri: 'https://images.unsplash.com/photo-1552674605-469523254d5d?w=800' },
        exercises: [{ name: 'Running', sets: '1', reps: '5km' }]
    },
    {
        id: '6', title: 'Upper / Lower Split', subtitle: '4 Day Athletic', duration: '55', level: 'Intermediate', kcal: '550',
        image: { uri: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800' },
        exercises: MOCK_EXERCISES
    },
    {
        id: '7', title: 'Glute & Hamstring Focus', subtitle: 'Leg Day Specialized', duration: '60', level: 'Intermediate', kcal: '450',
        image: { uri: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800' },
        exercises: MOCK_EXERCISES
    },
    {
        id: '8', title: 'Tabata Finisher', subtitle: 'High Intensity', duration: '20', level: 'All Levels', kcal: '250',
        image: { uri: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800' },
        exercises: MOCK_EXERCISES
    },
    {
        id: '9', title: 'Calisthenics Mastery', subtitle: 'Bodyweight Control', duration: '40', level: 'All Levels', kcal: '350',
        image: { uri: 'https://images.unsplash.com/photo-1598971639058-211a73287750?w=800' },
        exercises: [{ name: 'Pull Ups', sets: '3', reps: 'Max' }, { name: 'Dips', sets: '3', reps: 'Max' }]
    },
    {
        id: '10', title: 'Morning Mobility', subtitle: 'Start Your Day', duration: '15', level: 'Beginner', kcal: '100',
        image: { uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800' },
        exercises: [{ name: 'Cat Cow', sets: '1', reps: '2 min' }, { name: 'World\'s Greatest Stretch', sets: '1', reps: '2 min each' }]
    },
];

const SUGGESTED_PROGRAMS = [
    {
        id: '11', title: 'Core Crusher', duration: '15', level: 'Beginner', kcal: '120',
        image: { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        exercises: [
            { name: 'Crunches', sets: '3', reps: '20' },
            { name: 'Plank', sets: '3', reps: '1 min' },
            { name: 'Leg Raises', sets: '3', reps: '15' },
        ]
    },
    {
        id: '12', title: 'Arm Blaster', duration: '40', level: 'Intermediate', kcal: '350',
        image: { uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
        exercises: [
            { name: 'Bicep Curls', sets: '4', reps: '12' },
            { name: 'Tricep Extensions', sets: '4', reps: '12' },
            { name: 'Hammer Curls', sets: '3', reps: '10' },
        ]
    },
    {
        id: '13', title: 'Kettlebell Flow', duration: '35', level: 'Advanced', kcal: '400',
        image: { uri: 'https://images.unsplash.com/photo-1517963879466-e825c6329097?w=400' },
        exercises: [
            { name: 'KB Swings', sets: '4', reps: '20' },
            { name: 'KB Snatch', sets: '4', reps: '10 each' },
        ]
    },
    {
        id: '14', title: 'Runner\'s Warmup', duration: '10', level: 'All Levels', kcal: '80',
        image: { uri: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400' },
        exercises: [
            { name: 'Leg Swings', sets: '2', reps: '20' },
            { name: 'High Knees', sets: '2', reps: '30 sec' },
        ]
    },
];

export default function WorkoutsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('trainer');
    const [subCategory, setSubCategory] = useState<'workout' | 'program'>('workout');
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        level: '',
        focus: '',
        goal: '',
        category: '',
        duration: ''
    });
    const [createdWorkouts, setCreatedWorkouts] = useState<any[]>([]);

    // Favorites States
    const [favSubCategory, setFavSubCategory] = useState<'workout' | 'program'>('workout');
    const [favWorkouts, setFavWorkouts] = useState<any[]>([]);
    const [favPrograms, setFavPrograms] = useState<any[]>([]);

    // Modal & Selection State
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleProgramPress = (item: any) => {
        setSelectedProgram(item);
        setModalVisible(true);
    };

    const generateRandomWorkouts = () => {
        // Simulate fetching random workouts
        const randomSelection = [...SUGGESTED_PROGRAMS]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(item => ({ ...item, id: `fav-w-${Date.now()}-${item.id}` }));
        setFavWorkouts(randomSelection);
    };

    const generateRandomPrograms = () => {
        // Simulate fetching random programs
        const randomSelection = [...MOCK_PROGRAMS]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(item => ({ ...item, id: `fav-p-${Date.now()}-${item.id}` }));
        setFavPrograms(randomSelection);
    };


    const handleSaveWorkout = () => {
        if (!formData.name) return; // Simple validation

        const newWorkout = {
            id: Date.now().toString(),
            image: require('@/assets/images/workout_placeholder.png'), // Default image
            title: formData.name,
            subtitle: formData.description,
            kcal: '0',
            ...formData,
            // Ensure defaults if empty after spread
            level: formData.level || 'All Levels',
            duration: formData.duration || '0',
        };

        setCreatedWorkouts([newWorkout, ...createdWorkouts]);
        setFormData({
            name: '',
            description: '',
            level: '',
            focus: '',
            goal: '',
            category: '',
            duration: ''
        });
        setIsCreating(false);
    };

    const flatListRef = useRef<FlatList>(null);

    const scrollToNext = (currentIndex: number) => {
        if (flatListRef.current && currentIndex < MOCK_PROGRAMS.length - 1) {
            flatListRef.current.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
                viewOffset: 0
            });
        }
    };

    const scrollToPrev = (currentIndex: number) => {
        if (flatListRef.current && currentIndex > 0) {
            flatListRef.current.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
                viewOffset: 0
            });
        }
    };

    /* 
    const categories = [
        { id: 'created', label: t('profile.workouts.categories.created') },
        { id: 'trainer', label: t('profile.workouts.categories.trainer') },
        { id: 'favorites', label: t('profile.workouts.categories.favorites') },
        { id: 'recent', label: t('profile.workouts.categories.recent') },
    ];
    */

    const renderTopProgram = ({ item, index }: any) => (
        <TouchableOpacity style={styles.topCard}>
            <ImageBackground source={item.image} style={styles.topCardImage} imageStyle={{ borderRadius: 16 }}>
                <View style={styles.topCardOverlay} />

                <View style={styles.topHeader}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{item.level}</Text>
                    </View>
                </View>

                {/* Left Arrow Button to Scroll Prev (Only if not first item) */}
                {index > 0 && (
                    <TouchableOpacity
                        style={styles.prevArrowButton}
                        onPress={() => scrollToPrev(index)}
                    >
                        <ChevronRight color="#000" size={20} style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                )}

                {/* Right Arrow Button to Scroll Next (Only if not last item) */}
                {index < MOCK_PROGRAMS.length - 1 && (
                    <TouchableOpacity
                        style={styles.nextArrowButton}
                        onPress={() => scrollToNext(index)}
                    >
                        <ChevronRight color="#000" size={20} />
                    </TouchableOpacity>
                )}

                <View style={styles.topCardContent}>
                    <Text style={styles.topCardSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.topCardTitle}>{item.title}</Text>

                    <View style={styles.metaRowBig}>
                        <View style={styles.metaItemBig}>
                            <Clock size={16} color={Colors.dark.primary} />
                            <Text style={styles.metaTextBig}>{item.duration} {t('profile.workouts.programCard.duration')}</Text>
                        </View>
                        <View style={styles.metaDivider} />
                        <View style={styles.metaItemBig}>
                            <Flame size={16} color={Colors.dark.primary} />
                            <Text style={styles.metaTextBig}>{item.kcal} {t('profile.workouts.programCard.kcal')}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    const renderSuggestedProgram = ({ item }: any) => (
        <TouchableOpacity style={styles.suggestedCard} onPress={() => handleProgramPress(item)}>
            <Image source={item.image} style={styles.suggestedImage} />
            <View style={styles.suggestedContent}>
                <Text style={styles.suggestedTitle}>{item.title}</Text>
                <Text style={styles.suggestedLevel}>{item.level}</Text>
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Clock size={12} color="#888" />
                        <Text style={styles.metaText}>{item.duration} {t('profile.workouts.programCard.duration')}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Flame size={12} color="#888" />
                        <Text style={styles.metaText}>{item.kcal || '0'} {t('profile.workouts.programCard.kcal')}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.arrowContainer}>
                <BarChart size={20} color={Colors.dark.primary} style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
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
                        <Text style={styles.screenTitle}>{t('profile.workouts.tab')}</Text>
                        <View style={styles.searchContainer}>
                            <Search color="#000" size={20} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('profile.workouts.searchPlaceholder')}
                                placeholderTextColor="#666"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {searchQuery.trim().length > 0 ? (
                            <View style={{ paddingHorizontal: 24, paddingVertical: 16, gap: 16 }}>
                                <Text style={styles.sectionHeader}>ARAMA SONUÇLARI</Text>
                                {(() => {
                                    const allItems = [...MOCK_PROGRAMS, ...createdWorkouts, ...favWorkouts, ...favPrograms];
                                    const filtered = allItems.filter(item =>
                                        item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                    if (filtered.length === 0) {
                                        return (
                                            <View style={styles.emptyState}>
                                                <Text style={styles.emptyText}>Sonuç bulunamadı.</Text>
                                            </View>
                                        );
                                    }

                                    return filtered.map((item, index) => (
                                        <View key={`${item.id}-${index}`}>
                                            {renderSuggestedProgram({ item })}
                                        </View>
                                    ));
                                })()}
                            </View>
                        ) : (
                            <>
                                {/* Categories */}
                                <View style={styles.categoriesContainer}>
                                    {/* Home Page (Trainer) - Main, Top, Big */}
                                    <TouchableOpacity
                                        style={[styles.categoryTab, { width: '100%', marginBottom: 12, height: 60, flexDirection: 'row', gap: 12 }, activeCategory === 'trainer' && styles.categoryTabActive]}
                                        onPress={() => {
                                            setActiveCategory('trainer');
                                            setIsCreating(false);
                                        }}
                                    >
                                        <BarChart color={activeCategory === 'trainer' ? '#000' : '#888'} size={24} style={{ transform: [{ rotate: '90deg' }] }} />
                                        <Text style={[styles.categoryText, { fontSize: 16, fontFamily: 'Oswald_700Bold' }, activeCategory === 'trainer' && styles.categoryTextActive]}>
                                            {t('profile.workouts.categories.trainer')}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Sub Options Row */}
                                    <TouchableOpacity
                                        style={[styles.categoryTab, activeCategory === 'created' && styles.categoryTabActive]}
                                        onPress={() => {
                                            setActiveCategory('created');
                                        }}
                                    >
                                        <Text style={[styles.categoryText, activeCategory === 'created' && styles.categoryTextActive]}>
                                            {t('profile.workouts.categories.created')}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.categoryTab, activeCategory === 'favorites' && styles.categoryTabActive]}
                                        onPress={() => {
                                            setActiveCategory('favorites');
                                            setIsCreating(false);
                                        }}
                                    >
                                        <Text style={[styles.categoryText, activeCategory === 'favorites' && styles.categoryTextActive]}>
                                            {t('profile.workouts.categories.favorites')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {activeCategory === 'created' ? (
                                    <View style={{ paddingHorizontal: 24 }}>
                                        {isCreating ? (
                                            <View style={styles.createForm}>
                                                <TouchableOpacity onPress={() => setIsCreating(false)} style={styles.backButton}>
                                                    <ChevronRight size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
                                                    <Text style={styles.backText}>{t('profile.workouts.subCategories.workout')}</Text>
                                                </TouchableOpacity>

                                                <Text style={styles.formTitle}>{t('profile.workouts.create.title')}</Text>

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>{t('profile.workouts.create.name')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholderTextColor="#666"
                                                        placeholder={t('profile.workouts.create.name')}
                                                        value={formData.name}
                                                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                                                    />
                                                </View>

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>{t('profile.workouts.create.description')}</Text>
                                                    <TextInput
                                                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                                        placeholderTextColor="#666"
                                                        placeholder={t('profile.workouts.create.description')}
                                                        multiline
                                                        value={formData.description}
                                                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                                                    />
                                                </View>

                                                <View style={styles.rowInputs}>
                                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                                        <Text style={styles.label}>{t('profile.workouts.create.level')}</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholderTextColor="#666"
                                                            value={formData.level}
                                                            onChangeText={(text) => setFormData({ ...formData, level: text })}
                                                        />
                                                    </View>
                                                    <View style={[styles.inputGroup, { flex: 1 }]}>
                                                        <Text style={styles.label}>{t('profile.workouts.create.duration')}</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholderTextColor="#666"
                                                            keyboardType="numeric"
                                                            value={formData.duration}
                                                            onChangeText={(text) => setFormData({ ...formData, duration: text })}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>{t('profile.workouts.create.focus')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholderTextColor="#666"
                                                        value={formData.focus}
                                                        onChangeText={(text) => setFormData({ ...formData, focus: text })}
                                                    />
                                                </View>

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>{t('profile.workouts.create.goal')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholderTextColor="#666"
                                                        value={formData.goal}
                                                        onChangeText={(text) => setFormData({ ...formData, goal: text })}
                                                    />
                                                </View>

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>{t('profile.workouts.create.category')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholderTextColor="#666"
                                                        value={formData.category}
                                                        onChangeText={(text) => setFormData({ ...formData, category: text })}
                                                    />
                                                </View>

                                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
                                                    <Text style={styles.saveButtonText}>{t('profile.workouts.create.save')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View>
                                                <View style={styles.subCategoryContainer}>
                                                    <TouchableOpacity
                                                        style={[styles.subTab, subCategory === 'workout' && styles.subTabActive]}
                                                        onPress={() => setSubCategory('workout')}
                                                    >
                                                        <Text style={[styles.subTabText, subCategory === 'workout' && styles.subTabTextActive]}>
                                                            {t('profile.workouts.subCategories.workout')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.subTab, subCategory === 'program' && styles.subTabActive]}
                                                        onPress={() => setSubCategory('program')}
                                                    >
                                                        <Text style={[styles.subTabText, subCategory === 'program' && styles.subTabTextActive]}>
                                                            {t('profile.workouts.subCategories.program')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {subCategory === 'workout' ? (
                                                    <View>
                                                        <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                                                            <Text style={styles.createButtonText}>+ {t('profile.workouts.create.button')}</Text>
                                                        </TouchableOpacity>

                                                        {createdWorkouts.length > 0 ? (
                                                            <View>
                                                                {createdWorkouts.map((item) => (
                                                                    <View key={item.id} style={{ marginBottom: 12 }}>
                                                                        {renderSuggestedProgram({ item })}
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        ) : (
                                                            <View style={styles.emptyState}>
                                                                <Text style={styles.emptyText}>Henüz oluşturulmuş antrenman yok.</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <View style={styles.emptyState}>
                                                        <Text style={styles.emptyText}>Henüz oluşturulmuş program yok.</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ) : activeCategory === 'favorites' ? (
                                    <View style={{ paddingHorizontal: 24 }}>
                                        <View style={styles.subCategoryContainer}>
                                            <TouchableOpacity
                                                style={[styles.subTab, favSubCategory === 'workout' && styles.subTabActive]}
                                                onPress={() => setFavSubCategory('workout')}
                                            >
                                                <Text style={[styles.subTabText, favSubCategory === 'workout' && styles.subTabTextActive]}>
                                                    {t('profile.workouts.favorites.getWorkouts')}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.subTab, favSubCategory === 'program' && styles.subTabActive]}
                                                onPress={() => setFavSubCategory('program')}
                                            >
                                                <Text style={[styles.subTabText, favSubCategory === 'program' && styles.subTabTextActive]}>
                                                    {t('profile.workouts.favorites.getPrograms')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {favSubCategory === 'workout' ? (
                                            <View>
                                                <TouchableOpacity style={styles.genButton} onPress={generateRandomWorkouts}>
                                                    <Search color={Colors.dark.primary} size={20} />
                                                    <Text style={styles.genButtonText}>{t('profile.workouts.favorites.getWorkouts')}</Text>
                                                </TouchableOpacity>

                                                {favWorkouts.length > 0 ? (
                                                    <View>
                                                        {favWorkouts.map((item) => (
                                                            <View key={item.id} style={{ marginBottom: 12 }}>
                                                                {renderSuggestedProgram({ item })}
                                                            </View>
                                                        ))}
                                                    </View>
                                                ) : (
                                                    <View style={styles.emptyState}>
                                                        <Text style={styles.emptyText}>{t('profile.workouts.favorites.emptyWorkouts')}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        ) : (
                                            <View>
                                                <TouchableOpacity style={styles.genButton} onPress={generateRandomPrograms}>
                                                    <Search color={Colors.dark.primary} size={20} />
                                                    <Text style={styles.genButtonText}>{t('profile.workouts.favorites.getPrograms')}</Text>
                                                </TouchableOpacity>

                                                {favPrograms.length > 0 ? (
                                                    <View>
                                                        {favPrograms.map((item) => (
                                                            <View key={item.id} style={{ marginBottom: 12 }}>
                                                                {renderSuggestedProgram({ item })}
                                                            </View>
                                                        ))}
                                                    </View>
                                                ) : (
                                                    <View style={styles.emptyState}>
                                                        <Text style={styles.emptyText}>{t('profile.workouts.favorites.emptyPrograms')}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <>
                                        {/* Top 10 Section */}
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>{t('profile.workouts.top10Title')}</Text>
                                            <FlatList
                                                ref={flatListRef}
                                                horizontal
                                                data={MOCK_PROGRAMS}
                                                renderItem={renderTopProgram}
                                                keyExtractor={(item) => item.id}
                                                showsHorizontalScrollIndicator={false}
                                                snapToInterval={CARD_WIDTH + 16} // Card width + gap
                                                snapToAlignment="start"
                                                decelerationRate="fast"
                                                contentContainerStyle={{ paddingRight: 24, gap: 16 }}
                                            />
                                        </View>

                                        {/* Suggested Section */}
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>{t('profile.workouts.suggestedTitle')}</Text>
                                            {SUGGESTED_PROGRAMS.map((item) => (
                                                <View key={item.id} style={{ marginBottom: 12 }}>
                                                    {renderSuggestedProgram({ item })}
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </>
                        )}

                    </ScrollView>

                    {/* Program Details Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <X color="#fff" size={24} />
                                </TouchableOpacity>

                                {selectedProgram && (
                                    <>
                                        <Text style={styles.modalTitle}>{selectedProgram.title}</Text>
                                        <Text style={styles.modalSubtitle}>{selectedProgram.subtitle}</Text>

                                        <View style={styles.modalMeta}>
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{selectedProgram.level || 'All'}</Text>
                                            </View>
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{selectedProgram.duration || '0'} min</Text>
                                            </View>
                                            {selectedProgram.kcal && (
                                                <View style={styles.badge}>
                                                    <Text style={styles.badgeText}>{selectedProgram.kcal} kcal</Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={styles.sectionHeader}>ANTRENMAN İÇERİĞİ</Text>
                                        <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
                                            {selectedProgram.exercises && selectedProgram.exercises.length > 0 ? (
                                                selectedProgram.exercises.map((ex: any, idx: number) => (
                                                    <View key={idx} style={styles.exerciseItem}>
                                                        <View style={styles.exerciseNumber}>
                                                            <Text style={styles.exerciseNumberText}>{idx + 1}</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={styles.exerciseName}>{ex.name}</Text>
                                                            <Text style={styles.exerciseMeta}>{ex.sets} SET x {ex.reps}</Text>
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.noExercises}>Bu program için egzersiz detayı bulunmuyor.</Text>
                                            )}
                                        </ScrollView>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

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
    header: { paddingHorizontal: 24, paddingTop: 16, marginBottom: 16 },
    screenTitle: {
        color: '#fff',
        fontSize: 28,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#fff'
    },
    searchInput: { flex: 1, marginLeft: 12, color: '#000', fontSize: 16, fontFamily: 'Inter_400Regular' },
    scrollContent: { paddingBottom: 100 },

    // Categories
    categoriesContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12
    },
    categoryTab: {
        width: '48%', // 2-col grid
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0
    },
    categoryTabActive: { backgroundColor: Colors.dark.primary, borderColor: Colors.dark.primary },
    categoryText: { color: '#888', fontSize: 13, fontFamily: 'Oswald_500Medium', textAlign: 'center' },
    categoryTextActive: { color: '#000' },

    // Top 10
    section: { marginBottom: 32, paddingLeft: 24 },
    sectionTitle: { color: '#fff', fontSize: 18, fontFamily: 'Oswald_700Bold', marginBottom: 16, letterSpacing: 0.5 },
    topCard: { width: CARD_WIDTH, height: 220, marginRight: 0 },
    topCardImage: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 20 },
    topCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16 },
    topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    rankBadge: { backgroundColor: Colors.dark.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    rankText: { fontSize: 14, fontFamily: 'Oswald_700Bold', color: '#000' },
    levelBadge: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    levelText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#fff' },

    topCardContent: {},
    topCardSubtitle: { color: Colors.dark.primary, fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 4, textTransform: 'uppercase' },
    topCardTitle: { color: '#fff', fontSize: 24, fontFamily: 'Oswald_700Bold', marginBottom: 12 },

    metaRowBig: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
    metaItemBig: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaTextBig: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
    metaDivider: { width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 12 },

    // New Next Button
    nextArrowButton: {
        position: 'absolute',
        right: 16,
        top: '50%',
        marginTop: -20, // Center vertically
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },

    // Suggested
    suggestedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        marginRight: 24, // To account for paddingLeft of section
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    suggestedImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
    suggestedContent: { flex: 1 },
    suggestedTitle: { color: '#fff', fontSize: 16, fontFamily: 'Oswald_500Medium', marginBottom: 2 },
    suggestedLevel: { color: Colors.dark.primary, fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 4 },
    arrowContainer: { padding: 8 },

    // Meta
    metaRow: { flexDirection: 'row', gap: 12 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { color: '#ccc', fontSize: 10, fontFamily: 'Inter_400Regular' },

    // Sub Categories
    subCategoryContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    subTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    subTabActive: {
        backgroundColor: Colors.dark.primary,
    },
    subTabText: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Oswald_500Medium',
    },
    subTabTextActive: {
        color: '#000',
    },

    // Create Workout Form
    createForm: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 32
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8
    },
    backText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_500Medium'
    },
    formTitle: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 24,
        textTransform: 'uppercase'
    },
    inputGroup: {
        marginBottom: 16
    },
    label: {
        color: '#ccc',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        marginBottom: 8,
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_400Regular'
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 16
    },
    saveButton: {
        backgroundColor: Colors.dark.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_700Bold',
        textTransform: 'uppercase'
    },

    // Workout List within My Created
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 24,
        borderStyle: 'dashed'
    },
    createButtonText: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        textTransform: 'uppercase'
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center'
    },
    genButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold tint
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 24,
        gap: 8
    },
    genButtonText: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        textTransform: 'uppercase'
    },

    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        padding: 24
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        maxHeight: '80%'
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 8
    },
    modalTitle: {
        color: '#fff',
        fontSize: 28,
        fontFamily: 'Oswald_700Bold',
        marginBottom: 4,
        textTransform: 'uppercase',
        paddingRight: 32
    },
    modalSubtitle: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginBottom: 16,
        textTransform: 'uppercase'
    },
    modalMeta: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold'
    },
    sectionHeader: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 12,
        letterSpacing: 1
    },
    exerciseList: {

    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12
    },
    exerciseNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.dark.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    exerciseNumberText: {
        color: '#000',
        fontSize: 10,
        fontFamily: 'Oswald_700Bold'
    },
    exerciseName: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 2
    },
    exerciseMeta: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular'
    },
    noExercises: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        marginTop: 20
    },

    prevArrowButton: {
        position: 'absolute',
        left: 16,
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    }

});

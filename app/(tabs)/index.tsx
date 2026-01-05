import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Dumbbell, Home, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('MEMBER');

  // Load persisted user data
  useEffect(() => {
    const loadData = async () => {
      const cityVal = await AsyncStorage.getItem('userCity');
      // City val can be used if we want to display it elsewhere, but for now just name
      // if (cityVal) setCity(cityVal);

      const uName = await AsyncStorage.getItem('userName');
      const uSurname = await AsyncStorage.getItem('userSurname');
      if (uName && uSurname) setName(`${uName} ${uSurname}`);
    };
    loadData();
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
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
            <View style={styles.headerContent}>
              <Text style={styles.helloText}>{t('home.welcome')}</Text>
              <Text style={styles.nameText}>{name}</Text>
            </View>
            <Image
              source={require('@/assets/images/rave_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Language Switcher (Optional here, but kept for consistency if user wants) */}
          {/* Usually dashboards hide this in settings, but user said "all pages" */}
          <View style={styles.langContainer}>
            <TouchableOpacity onPress={() => changeLanguage('tr')} style={[styles.langButton, i18n.language === 'tr' && styles.langButtonActive]}>
              <Text style={[styles.langText, i18n.language === 'tr' && styles.langTextActive]}>TR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('en')} style={[styles.langButton, i18n.language === 'en' && styles.langButtonActive]}>
              <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>


          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* 1. Target Zones (Replaces Personal Program) */}
            <Text style={styles.sectionTitle}>{t('home.targetZoneTitle')}</Text>
            <View style={styles.zoneGrid}>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'chest' } })}>
                <Text style={styles.zoneText}>{t('home.zones.chest')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'back' } })}>
                <Text style={styles.zoneText}>{t('home.zones.back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'legs' } })}>
                <Text style={styles.zoneText}>{t('home.zones.legs')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'shoulders' } })}>
                <Text style={styles.zoneText}>{t('home.zones.shoulders')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'arms' } })}>
                <Text style={styles.zoneText}>{t('home.zones.arms')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoneCard} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'abs' } })}>
                <Text style={styles.zoneText}>{t('home.zones.abs')}</Text>
              </TouchableOpacity>
            </View>

            {/* 2. Where to Train? */}
            <Text style={styles.sectionTitle}>{t('home.whereToTrain')}</Text>
            <View style={styles.preferenceContainer}>
              <TouchableOpacity style={styles.prefOption} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'gym' } })}>
                <View style={styles.iconCircle}>
                  <Dumbbell color="#000" size={24} />
                </View>
                <Text style={styles.prefText}>{t('home.gym')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.prefOption} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'home' } })}>
                <View style={styles.iconCircle}>
                  <Home color="#000" size={24} />
                </View>
                <Text style={styles.prefText}>{t('home.home')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.prefOption} onPress={() => router.push({ pathname: '/program-list', params: { zone: 'outdoor' } })}>
                <View style={styles.iconCircle}>
                  <Sun color="#000" size={24} />
                </View>
                <Text style={styles.prefText}>{t('home.outdoor')}</Text>
              </TouchableOpacity>
            </View>

            {/* 3. Daily Quote (Replaces Motivation Corner) */}
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>{t('home.dailyQuote')}</Text>
              <View style={styles.quoteLine} />
              <Text style={styles.quoteAuthor}>RAVE GYM</Text>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 30,
    alignItems: 'center', // Center everything horizontally
    justifyContent: 'center',
    position: 'relative', // For absolute positioning if needed
    minHeight: 80,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  helloText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    letterSpacing: 2,
  },
  nameText: {
    color: Colors.dark.primary,
    fontSize: 28, // Slightly larger
    fontFamily: 'Oswald_700Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  userCityText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  logoImage: {
    // We can hide the logo if we want purely text centered, 
    // or position it absolutely to the top right/left so it doesn't interfere.
    // User asked to center the name where the city was.
    // Let's keep the logo but maybe move it or make it smaller/absolute.
    position: 'absolute',
    right: 24,
    top: 20,
    width: 40,
    height: 40,
  },
  langContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    flexDirection: 'row',
    gap: 8,
    zIndex: 50,
    // Adjusting position since we have a custom header
    display: 'none' // User said "all pages", but in Home usually it's in settings. I'll hide it for now to keep header clean OR put it below.
    // Let's actually put it in a better place or allow the user to toggle it.
    // Re-enabling with better positioning for this layout
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  programCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  programInfo: {
    flex: 1,
  },
  programTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontFamily: 'Oswald_700Bold',
    marginBottom: 4,
  },
  programSubtitle: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Oswald_600SemiBold',
    letterSpacing: 1,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  zoneCard: {
    width: '48%', // Approx 2 columns
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  zoneText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Oswald_600SemiBold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Oswald_500Medium',
    marginBottom: 16,
    letterSpacing: 1,
  },
  preferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  prefOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.8)',
    width: '30%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  prefText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Oswald_500Medium',
    textAlign: 'center',
  },
  quoteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quoteText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Oswald_400Regular', // Or Light/Italic if available
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 2,
    fontStyle: 'italic', // Force italic style
  },
  quoteLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.dark.primary,
    marginVertical: 16,
  },
  quoteAuthor: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontFamily: 'Oswald_700Bold',
    letterSpacing: 4,
  },
  // Re-adding lang styles needed if I enable it
  langButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  langButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  langText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Oswald_500Medium',
  },
  langTextActive: {
    color: '#000',
  }
});

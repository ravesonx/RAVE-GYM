import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

export default function PaymentSuccessScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/gym_bg_v2.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                <View style={styles.content}>

                    {/* Success Icon */}
                    <Animated.View entering={ZoomIn.duration(800).springify()} style={styles.iconCircle}>
                        <Check color="#fff" size={64} strokeWidth={3} />
                    </Animated.View>

                    {/* Text Content */}
                    <Animated.View entering={FadeInUp.delay(300).duration(800)}>
                        <Text style={styles.title}>ÖDEME BAŞARILI!</Text>
                        <Text style={styles.subtitle}>
                            Ödemeniz başarıyla alınmıştır.{'\n'}
                            RAVE GYM ailesine hoşgeldiniz.
                        </Text>
                    </Animated.View>

                    {/* Button */}
                    <Animated.View entering={FadeInUp.delay(600).duration(800)} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text style={styles.buttonText}>ANA SAYFAYA DÖN</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
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
        backgroundColor: 'rgba(0,0,0,0.95)',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50', // Success Green
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        color: '#ccc',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
    },
    homeButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 100, // Pill shape
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    }
});

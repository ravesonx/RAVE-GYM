import { Colors } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, CreditCard, Lock, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MembershipPaymentScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams(); // Will use this later for plan details

    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = () => {
        if (!cardName || !cardNumber || !expiry || !cvv) {
            Alert.alert("Hata", "Lütfen tüm ödeme bilgilerini doldurunuz.");
            return;
        }

        // Mock Payment Success and Navigate
        router.push('/membership/success');
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
                        <Text style={styles.headerTitle}>ÖDEME</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.content}>

                            {/* Order Summary (Placeholder) */}
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>SİPARİŞ ÖZETİ</Text>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Üyelik Paketi</Text>
                                    <Text style={styles.summaryValue}>GOLD</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Süre</Text>
                                    <Text style={styles.summaryValue}>12 Ay (Peşin)</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.summaryRow}>
                                    <Text style={styles.totalLabel}>TOPLAM</Text>
                                    <Text style={styles.totalValue}>4.200 TL</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>KART BİLGİLERİ</Text>

                            {/* Card Holder */}
                            <Text style={styles.label}>KART SAHİBİ</Text>
                            <View style={styles.inputContainer}>
                                <User color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={cardName}
                                    onChangeText={setCardName}
                                    placeholder="AD SOYAD"
                                    placeholderTextColor="#666"
                                    autoCapitalize="characters"
                                />
                            </View>

                            {/* Card Number */}
                            <Text style={styles.label}>KART NUMARASI</Text>
                            <View style={styles.inputContainer}>
                                <CreditCard color="#666" size={20} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={19}
                                />
                            </View>

                            <View style={styles.row}>
                                {/* Expiry */}
                                <View style={styles.halfCol}>
                                    <Text style={styles.label}>SKT</Text>
                                    <View style={styles.inputContainer}>
                                        <CalendarDays color="#666" size={20} />
                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={expiry}
                                            onChangeText={setExpiry}
                                            placeholder="AA/YY"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>
                                </View>

                                {/* CVV */}
                                <View style={styles.halfCol}>
                                    <Text style={styles.label}>CVV</Text>
                                    <View style={styles.inputContainer}>
                                        <Lock color="#666" size={20} />
                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={cvv}
                                            onChangeText={setCvv}
                                            placeholder="000"
                                            placeholderTextColor="#666"
                                            keyboardType="numeric"
                                            maxLength={3}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Secure Payment Note */}
                            <View style={styles.secureNote}>
                                <Lock color="#4CAF50" size={16} />
                                <Text style={styles.secureText}>Ödemeniz 256-bit SSL ile korunmaktadır.</Text>
                            </View>

                            {/* Pay Button */}
                            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                                <Text style={styles.payButtonText}>ÖDEMEYİ TAMAMLA</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </KeyboardAvoidingView>

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
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 16,
        letterSpacing: 1,
        marginTop: 24,
    },
    summaryCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    summaryTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 16,
        letterSpacing: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    summaryValue: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 12,
    },
    totalLabel: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontFamily: 'Oswald_700Bold',
    },
    totalValue: {
        color: Colors.dark.primary,
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
    },
    label: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 8,
        marginTop: 4,
        letterSpacing: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 56,
    },
    inputWithIcon: {
        flex: 1,
        marginLeft: 12,
        color: '#fff',
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfCol: {
        flex: 1,
    },
    secureNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 20,
    },
    secureText: {
        color: '#4CAF50',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    payButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 40,
    },
    payButtonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    }
});

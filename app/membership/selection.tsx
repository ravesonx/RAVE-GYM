import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const CITIES = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
    "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Diyarbakır", "Samsun",
    "Denizli", "Şanlıurfa", "Sakarya", "Kocaeli", "Trabzon", "Tekirdağ", "Muğla"
];

const CLUBS = {
    "İstanbul": ["Etiler", "Nişantaşı", "Kadıköy", "Maslak", "Beşiktaş", "Şişli", "Bakırköy", "Beylikdüzü", "Ataşehir", "Ümraniye"],
    "Ankara": ["Çankaya", "Bilkent", "Ümitköy", "Kızılay", "Bahçelievler", "Batıkent", "Gölbaşı"],
    "İzmir": ["Alsancak", "Karşıyaka", "Bornova", "Buca", "Göztepe", "Mavişehir", "Urla"],
    "Bursa": ["Nilüfer", "Osmangazi", "Yıldırım", "Özlüce", "Mudanya"],
    "Antalya": ["Lara", "Konyaaltı", "Muratpaşa", "Kepez", "Alanya"],
    "Adana": ["Seyhan", "Çukurova", "Yüreğir"],
    "Konya": ["Selçuklu", "Meram", "Karatay"],
    "Gaziantep": ["Şehitkamil", "Şahinbey"],
    "Mersin": ["Yenişehir", "Mezitli", "Tarsus"],
    "Kayseri": ["Melikgazi", "Kocasinan", "Talas"],
    "Eskişehir": ["Odunpazarı", "Tepebaşı"],
    "Diyarbakır": ["Kayapınar", "Bağlar"],
    "Samsun": ["Atakum", "İlkadım"],
    "Denizli": ["Pamukkale", "Merkezefendi"],
    "Şanlıurfa": ["Karaköprü", "Haliliye"],
    "Sakarya": ["Serdivan", "Adapazarı"],
    "Kocaeli": ["İzmit", "Gebze", "Başiskele"],
    "Trabzon": ["Ortahisar", "Akçaabat"],
    "Tekirdağ": ["Süleymanpaşa", "Çorlu"],
    "Muğla": ["Bodrum", "Fethiye", "Marmaris", "Menteşe"]
};

export default function ClubSelectionScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    const [selectedCity, setSelectedCity] = useState('');
    const [selectedClub, setSelectedClub] = useState('');

    // Modal States
    const [cityModalVisible, setCityModalVisible] = useState(false);
    const [clubModalVisible, setClubModalVisible] = useState(false);

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
        setSelectedClub(''); // Reset club
        setCityModalVisible(false);
    };

    const handleClubSelect = (club: string) => {
        setSelectedClub(club);
        setClubModalVisible(false);
    };

    const handleContinue = () => {
        if (selectedCity && selectedClub) {
            router.push(`/membership/plans?city=${encodeURIComponent(selectedCity)}&club=${encodeURIComponent(selectedClub)}`);
        }
    };

    const SelectionModal = ({ visible, data, onClose, onSelect, title }: any) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{ color: '#fff' }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
                                <Text style={styles.modalItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
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
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.membership.selectClubTitle')}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.content}>

                        <Text style={styles.description}>
                            Antrenmanlarını gerçekleştireceğin ana lokasyonu seç.
                        </Text>

                        {/* City Selector */}
                        <TouchableOpacity style={styles.selector} onPress={() => setCityModalVisible(true)}>
                            <View style={styles.selectorContent}>
                                <Text style={styles.selectorLabel}>{t('profile.membership.selectCity')}</Text>
                                <Text style={[styles.selectorValue, !selectedCity && { color: '#666' }]}>
                                    {selectedCity || t('profile.membership.selectCity')}
                                </Text>
                            </View>
                            <ChevronDown color={Colors.dark.primary} size={24} />
                        </TouchableOpacity>

                        {/* Club Selector */}
                        <TouchableOpacity
                            style={[styles.selector, !selectedCity && { opacity: 0.5 }]}
                            onPress={() => selectedCity && setClubModalVisible(true)}
                            disabled={!selectedCity}
                        >
                            <View style={styles.selectorContent}>
                                <Text style={styles.selectorLabel}>{t('profile.membership.selectClub')}</Text>
                                <Text style={[styles.selectorValue, !selectedClub && { color: '#666' }]}>
                                    {selectedClub || t('profile.membership.selectClub')}
                                </Text>
                            </View>
                            <MapPin color={Colors.dark.primary} size={24} />
                        </TouchableOpacity>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[styles.continueButton, (!selectedCity || !selectedClub) && { backgroundColor: '#333' }]}
                            onPress={handleContinue}
                            disabled={!selectedCity || !selectedClub}
                        >
                            <Text style={[styles.continueButtonText, (!selectedCity || !selectedClub) && { color: '#666' }]}>
                                {t('profile.membership.continue')}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* Modals */}
                    <SelectionModal
                        visible={cityModalVisible}
                        data={CITIES}
                        onClose={() => setCityModalVisible(false)}
                        onSelect={handleCitySelect}
                        title={t('profile.membership.selectCity')}
                    />

                    <SelectionModal
                        visible={clubModalVisible}
                        //@ts-ignore
                        data={selectedCity ? CLUBS[selectedCity] : []}
                        onClose={() => setClubModalVisible(false)}
                        onSelect={handleClubSelect}
                        title={t('profile.membership.selectClub')}
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
        marginBottom: 40,
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
    },
    description: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginBottom: 32,
        lineHeight: 20,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    selectorContent: {
        flex: 1,
    },
    selectorLabel: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Oswald_500Medium',
        marginBottom: 4,
        letterSpacing: 1,
    },
    selectorValue: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_500Medium',
    },
    continueButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 24,
    },
    continueButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 1,
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
        maxHeight: '50%',
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
    },
    modalItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalItemText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    }
});

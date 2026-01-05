import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar, ChevronLeft, Plus, Ruler, Trash2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MeasurementsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [measurements, setMeasurements] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadMeasurements = async () => {
                try {
                    const data = await AsyncStorage.getItem('userMeasurements');
                    if (data) {
                        setMeasurements(JSON.parse(data));
                    }
                } catch (error) {
                    console.error('Failed to load measurements', error);
                }
            };
            loadMeasurements();
        }, [])
    );

    const handleDelete = async (id: string) => {
        try {
            const newMeasurements = measurements.filter(m => m.id !== id);
            setMeasurements(newMeasurements);
            await AsyncStorage.setItem('userMeasurements', JSON.stringify(newMeasurements));
        } catch (error) {
            console.error('Error deleting measurement:', error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                    <Calendar color="#888" size={16} style={{ marginRight: 6 }} />
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
            </View>
            <View style={styles.cardStats}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>{t('profile.measurements.form.weight')}</Text>
                    <Text style={styles.statValue}>{item.weight || '--'} kg</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>{t('profile.measurements.form.waist')}</Text>
                    <Text style={styles.statValue}>{item.waist || '--'} cm</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>{t('profile.measurements.form.hip')}</Text>
                    <Text style={styles.statValue}>{item.hip || '--'} cm</Text>
                </View>
            </View>
        </View>
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
                            <ChevronLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('profile.measurements.title')}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.content}>
                        {measurements.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyState}>
                                    <View style={styles.iconCircle}>
                                        <Ruler color={Colors.dark.primary} size={48} />
                                    </View>
                                    <Text style={styles.emptyText}>{t('profile.measurements.empty')}</Text>
                                    <Text style={styles.emptySubText}>{t('profile.measurements.emptyCTA')}</Text>
                                </View>
                            </View>
                        ) : (
                            <FlatList
                                data={measurements}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.newButton} onPress={() => setModalVisible(true)}>
                            <Plus color="#000" size={24} />
                            <Text style={styles.newButtonText}>{t('profile.measurements.new')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Selection Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.modalIndicator} />
                                <TouchableOpacity
                                    style={styles.optionButton}
                                    onPress={() => {
                                        setModalVisible(false);
                                        router.push('/measurements/manual');
                                    }}
                                >
                                    <Text style={styles.optionText}>{t('profile.measurements.manual')}</Text>
                                    <ChevronLeft color="#666" size={20} style={{ transform: [{ rotate: '180deg' }] }} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
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
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyState: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Oswald_600SemiBold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubText: {
        color: '#888',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 20,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(20,20,20,0.6)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    dateText: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
    cardStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        color: '#666',
        fontSize: 10,
        fontFamily: 'Oswald_400Regular',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    newButton: {
        backgroundColor: Colors.dark.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    newButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Oswald_600SemiBold',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Oswald_400Regular',
    },
    deleteButton: {
        padding: 4,
    }
});

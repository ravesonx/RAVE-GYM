import { Colors } from '@/constants/theme';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ArrowLeft, ScanLine } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

export default function QrScannerScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const isFocused = useIsFocused();

    // Reset scanned state when screen is focused
    React.useEffect(() => {
        if (isFocused) {
            setScanned(false);
        }
    }, [isFocused]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.message}>{t('camera.permissionMessage', 'Kamerayı kullanmak için izniniz gerekiyor.')}</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>{t('camera.grantPermission', 'İzin Ver')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        Vibration.vibrate();

        // Geliştirici sunucusu kodunu filtrele
        if (data.startsWith('exp://') || data.includes('192.168')) {
            Alert.alert(
                "Geliştirici Modu",
                "Kendi ekranınızdaki kurulum kodunu tarattınız. Normal bir QR kod taratarak giriş yapabilirsiniz.\n\n(Bu bir hata değildir!)",
                [{ text: 'Tamam', onPress: () => setScanned(false) }]
            );
            return;
        }

        // Başarılı giriş simülasyonu
        Alert.alert(
            "GİRİŞ BAŞARILI",
            "RAVEGYM'E Hoşgeldiniz! Turnike açıldı, iyi antrenmanlar.",
            [{ text: 'Tamam', onPress: () => setScanned(false) }]
        );
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={scanned || !isFocused ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                {/* Overlay UI */}
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
                        >
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{t('camera.scanTitle', 'Karakod Tara')}</Text>
                    </View>

                    <View style={styles.scanAreaContainer}>
                        <View style={styles.scanFrame}>
                            <ScanLine color={Colors.dark.primary} size={250} strokeWidth={1} style={{ opacity: 0.8 }} />
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.instruction}>{t('camera.instruction', 'Kamerayı koda doğrultun')}</Text>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    message: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: 24,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    button: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Oswald_600SemiBold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 24,
        padding: 8,
        zIndex: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    },
    scanAreaContainer: {
        height: 300,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    instruction: {
        color: '#ccc',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: Colors.dark.primary,
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});

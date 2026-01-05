import { Colors } from '@/constants/theme';
import { AIService } from '@/services/ai';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bot, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

export default function AIScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: t('ai.welcome', 'Merhaba! Ben Senin Yapay Zeka Koçunum. Antrenmanların, beslenmen veya sağlığın hakkında bana her şeyi sorabilirsin!'),
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (inputText.trim().length === 0) return;
        if (isTyping) return; // Prevent double send

        const userText = inputText;
        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);
        Keyboard.dismiss();

        try {
            // Prepare history for context
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                text: m.text
            })) as { role: 'user' | 'model'; text: string }[];

            const aiText = await AIService.sendMessage(userText, history);

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error: any) {
            Alert.alert('AI Error', error.message || 'Something went wrong.');
            // Optionally remove the user message if it failed, but usually we just let them retry.
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

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
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
                        >
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>
                        <View style={styles.headerIconContainer}>
                            <Bot color={Colors.dark.primary} size={24} />
                        </View>
                        <Text style={styles.headerTitle}>{t('ai.title', 'AI KOÇ')}</Text>
                    </View>

                    {/* Chat Area */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.chatContainer}
                        contentContainerStyle={styles.chatContent}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                                ]}
                            >
                                <Text style={[
                                    styles.messageText,
                                    msg.sender === 'user' ? styles.userText : styles.aiText
                                ]}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                        {isTyping && (
                            <View style={styles.typingIndicator}>
                                <Text style={styles.typingText}>Yazıyor...</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                    >
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('ai.placeholder', 'Bir şeyler sor...')}
                                placeholderTextColor="#666"
                                value={inputText}
                                onChangeText={setInputText}
                                returnKeyType="send"
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                                <Send color="#000" size={20} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

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
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'relative', // Ensure absolute children are relative to this
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        padding: 8,
    },
    headerIconContainer: {
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Oswald_700Bold',
        letterSpacing: 2,
    },

    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
        paddingBottom: 32,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.dark.primary,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    messageText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    userText: {
        color: '#000',
        fontFamily: 'Inter_500Medium',
    },
    aiText: {
        color: '#eee',
    },
    typingIndicator: {
        marginLeft: 8,
        marginBottom: 12,
    },
    typingText: {
        color: '#888',
        fontSize: 12,
        fontStyle: 'italic',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12, // Increased for better touch area
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginRight: 12,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

import { Config } from '@/constants/Config';

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface ChatHistoryItem {
    role: 'user' | 'model';
    text: string;
}

export const AIService = {
    sendMessage: async (message: string, history: ChatHistoryItem[] = []) => {
        // 1. Validation: Check if API Key appears valid
        const apiKey = Config.GEMINI_API_KEY;
        if (!apiKey || apiKey.length < 10 || apiKey === 'YOUR_GEMINI_API_KEY') {
            console.warn("AI Service: Missing or invalid API Key.");
            return "⚠️ AI Configuration Error: Invalid or missing API Key.\n\nPlease check your .env file and ensure EXPO_PUBLIC_GEMINI_API_KEY is correct.\n(Restart the server after changes)";
        }

        // 2. Prepare Context (History)
        let contents: GeminiMessage[] = history.map(item => ({
            role: item.role,
            parts: [{ text: item.text }]
        }));

        // Remove leading 'model' messages (Gemini requirement: start with 'user')
        while (contents.length > 0 && contents[0].role !== 'user') {
            contents.shift();
        }

        // Add current user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // 3. System Prompt Injection
        const systemPrompt = "You are a highly intelligent, helpful, and capable AI fitness coach named 'Rave Coach'. You are friendly, concise, and motivating. Answer questions about workouts, nutrition, and health.";

        // Inject system prompt into the first user message
        if (contents.length > 0 && contents[0].role === 'user') {
            contents[0].parts[0].text = `${systemPrompt}\n\n[User Query]: ${contents[0].parts[0].text}`;
        }

        console.log('Sending to Gemini...', contents.length, 'messages');

        try {
            // 4. Network Request with Timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(`${Config.GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', // Added explicit Accept
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800,
                    }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = `⚠️ AI Server Error (${response.status})`;
                try {
                    const errorJson = await response.json();
                    if (errorJson.error && errorJson.error.message) {
                        errorMessage += `: ${errorJson.error.message}`;
                    }
                } catch (e) {
                    errorMessage += `: ${await response.text()}`;
                }
                console.error('Gemini API Error details:', errorMessage);
                return errorMessage;
            }

            const data = await response.json();

            // 5. Parse Response
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "Hmm, I didn't get a clear response. Can you rephrase that?";
            }

        } catch (error: any) {
            console.error('AI Service Exception:', error);
            if (error.name === 'AbortError') {
                return "⚠️ Network Timeout: The AI took too long to respond. Please check your internet connection.";
            }
            return "⚠️ Connection Error: Could not reach the AI service. Please check your internet.";
        }
    }
};

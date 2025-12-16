import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AiMessage, UserContext, ChatMode } from "./AiConciergeService";

// Helper to get API Key safely
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

export const GeminiService = {
    isEnabled: () => !!getApiKey(),

    sendMessage: async (
        message: string,
        history: AiMessage[],
        context: UserContext,
        mode: ChatMode
    ): Promise<string> => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("API Key missing");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 1. Construct System Prompt based on Mode
        let systemInstruction = `You are LifeBridge Concierge, a helpful assistant for life milestones (moving, baby, marriage).
    Current User Context: ${context}.
    `;

        if (mode === 'empathy') {
            systemInstruction += `
      ROLE: Empathetic Partner.
      TONE: Warm, supportive, soft, use emojis (🌸, 🍵, ✨).
      GOAL: Validate the user's feelings first. Do not just look for solutions. Ask how they feel.
      CONSTRAINT: Keep responses under 3 sentences unless asked for details.
      `;
        } else {
            systemInstruction += `
      ROLE: Efficient Secretary.
      TONE: Professional, concise, clear, polite (Desu/Masu).
      GOAL: Provide accurate information and next steps efficiently. Use bullet points.
      CONSTRAINT: Keep responses short and actionable.
      `;
        }

        // 2. Format History for Gemini
        // Gemini expects: { role: 'user' | 'model', parts: [{ text: '' }] }
        // Only take last 10 messages to save context window and avoid confusion
        const chatHistory = history.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // 3. Start Chat (or generate content with history)
        // Using startChat gives better continuity
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `SYSTEM_INSTRUCTION: ${systemInstruction}` }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. I am ready to act as LifeBridge Concierge." }]
                },
                ...chatHistory
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: mode === 'empathy' ? 0.7 : 0.3, // Higher creativity for empathy
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        try {
            const result = await chat.sendMessage(message);
            const response = result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Error:", error);

            // Parse error to provide specific feedback
            const errorMessage = error?.message || error?.toString() || '';
            const errorStatus = error?.status || error?.statusCode;

            // Check for specific error types
            if (errorStatus === 429 || errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
                throw new Error('RATE_LIMIT: API利用制限に達しました。しばらく待ってから再度お試しください。');
            }

            if (errorStatus === 401 || errorStatus === 403 || errorMessage.includes('API key') || errorMessage.includes('authentication')) {
                throw new Error('AUTH_ERROR: APIキーが無効です。設定を確認してください。');
            }

            if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ENOTFOUND')) {
                throw new Error('NETWORK_ERROR: ネットワークエラーが発生しました。インターネット接続を確認してください。');
            }

            if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
                throw new Error('SAFETY_BLOCK: 安全性フィルターによりブロックされました。別の表現でお試しください。');
            }

            // Generic error
            throw new Error(`API_ERROR: ${errorMessage.substring(0, 100)}`);
        }
    }
};

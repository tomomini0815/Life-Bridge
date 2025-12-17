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

        // 1. Construct System Prompt based on Mode and Context
        const contextInfo = {
            general: '人生の転機全般',
            marriage: '結婚に関する手続き(婚姻届、氏名変更、各種登録変更など)',
            birth: '出産・育児に関する手続き(出生届、児童手当、育児休業など)',
            job: '転職に関する手続き(退職手続き、社会保険、失業保険など)',
            moving: '引越しに関する手続き(転出・転入届、住所変更、ライフライン手続きなど)',
            care: '介護に関する手続き(介護認定、介護サービス、介護休業など)',
            startup: '起業に関する手続き(開業届、法人設立、補助金・助成金申請など)'
        };

        let systemInstruction = `You are LifeBridge Concierge, a helpful assistant for life milestones and administrative procedures in Japan.

Current User Context: ${contextInfo[context] || context}

Available Life Events:
- 結婚 (Marriage): 婚姻届、氏名変更、各種登録変更
- 出産 (Birth): 出生届、児童手当、育児休業給付金
- 転職 (Job Change): 退職手続き、社会保険、失業保険
- 引越し (Moving): 転出・転入届、住所変更、ライフライン手続き
- 介護 (Care): 介護認定、介護サービス、介護休業
- 起業 (Startup): 開業届、法人設立、補助金・助成金

${context === 'startup' ? `
STARTUP CONTEXT:
The user is currently viewing the Business Startup page. Available information includes:
- Individual Business (個人事業主): 開業届、青色申告、事業用口座開設、会計ソフト導入、国民健康保険・年金手続き
- Corporation (法人): 会社形態選択、定款作成、資本金払込、法人設立登記、法人口座開設、税務署届出、社会保険加入
- Subsidies & Grants (補助金・助成金):
  * Individual: 小規模事業者持続化補助金(最大50万円)、IT導入補助金(最大450万円)、ものづくり補助金(最大1,250万円)
  * Corporation: 小規模事業者持続化補助金創業枠(最大200万円)、中小企業新事業進出補助金(最大7,000万円)、キャリアアップ助成金(最大80万円)、創業助成金東京都(最大300万円)、人材開発支援助成金(最大100万円)

When answering questions about subsidies/grants, provide specific details about:
- Eligibility requirements (対象者)
- Application conditions (申請条件)
- Maximum amounts (最大金額)
- Required documents (必要書類)
- Application deadlines (申請期限)
- Official websites for more information
` : ''}

IMPORTANT RULES:
- Always respond in Japanese (polite form: です・ます調)
- Provide accurate, actionable information
- If asked about specific procedures, mention required documents and deadlines
- If asked about subsidies/grants, provide detailed conditions and amounts
- Stay within the scope of life milestone procedures
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
      GOAL: Provide accurate, complete information and next steps efficiently. 
      FORMAT: 
        - For simple questions: 2-3 sentences with key information
        - For complex topics (subsidies, procedures): Use bullet points with clear structure
        - Always complete your thought - never end mid-sentence
      CONSTRAINT: Aim for completeness over brevity. Ensure all key information is included.
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
                maxOutputTokens: 2000, // Increased from 500 to allow longer responses
                temperature: mode === 'empathy' ? 0.7 : 0.3, // Higher creativity for empathy
                topP: 0.95,
                topK: 40,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        try {
            const result = await chat.sendMessage(message);
            const response = result.response;

            // Check if response was truncated
            const finishReason = response.candidates?.[0]?.finishReason;
            if (finishReason && finishReason !== 'STOP') {
                console.warn('Response may be incomplete. Finish reason:', finishReason);
                // If truncated due to length, append a note
                if (finishReason === 'MAX_TOKENS') {
                    const text = response.text();
                    return text + '\n\n(続きがある場合は「続きを教えて」とお尋ねください)';
                }
            }

            return response.text();
        } catch (error: any) {
            console.error("Gemini Error:", error);
            // ... (Error handling logic from previous implementation)
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
    },

    generateText: async (prompt: string, systemInstruction?: string): Promise<string> => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("API Key missing");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        try {
            const result = await model.generateContent([
                systemInstruction ? `SYSTEM: ${systemInstruction}\nUSER: ${prompt}` : prompt
            ]);
            return result.response.text();
        } catch (error) {
            console.error("Gemini Generation Error:", error);
            throw error;
        }
    }
};

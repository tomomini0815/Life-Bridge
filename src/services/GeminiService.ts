import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AiMessage, UserContext, ChatMode } from "./AiConciergeService";

// Helper to get API Key safely
const getApiKey = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here' || key === '') return null;
    return key;
};

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

        // Secure debug log of API Key used in production
        const maskedKey = apiKey.length > 8 
            ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` 
            : 'too_short';
        console.warn("[DEBUG] Gemini API Key Used:", maskedKey);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        // 1. Construct System Prompt based on Mode and Context
        const contextInfo: Record<string, string> = {
            general: '人生の転機全般',
            marriage: '結婚に関する手続き(婚姻届、氏名変更、各種登録変更、社会保険扶養など)',
            birth: '出産・育児に関する手続き(出生届、児童手当、育児休業給付金、医療費助成など)',
            job: '転職に関する手続き(退職手続き、社会保険切り替え、失業保険、年金手続きなど)',
            moving: '引越しに関する手続き(転出・転入届、マイナンバー住所変更、ライフライン手続きなど)',
            care: '介護に関する手続き(要介護認定申請、ケアマネ選定、介護サービス、介護休業など)',
            startup: '起業に関する手続き(開業届、青色申告、法人設立、補助金・助成金申請など)',
            baby: '出産・育児手続き',
            retirement: '定年退職手続き',
            divorce: '離婚に伴う手続き(財産分与、年金分割、親権、養育費公正証書など)',
            exam: '受験・進学準備',
            finance: '家計整理・確定申告・資産運用',
            inheritance: '相続手続き(遺産分割、相続放棄、相続税申告など)',
            homePurchase: 'マイホーム購入・売却'
        };

        let systemInstruction = `You are LifeBridge Concierge, an expert advisor for life milestones, legal, financial, and administrative procedures in Japan.

Current User Context: ${contextInfo[context] || context}

Available Life Event Categories & Key Topics:
- 結婚 (Marriage): 婚姻届(24時間受付)、氏名変更(免許・パスポート・銀行)、扶養控除手続き
- 出産・育児 (Birth/Childcare): 出生届(14日以内)、出産育児一時金(50万円)、児童手当、育児休業給付金(非課税・保険料免除)
- 転職・退職 (Job Change): 健康保険・年金の切り替え(14日以内)、雇用保険(失業給付)、退職後の確定申告
- 引越し (Moving): 転出届(前後14日)、転入届・マイナンバー変更(14日以内)、ライフライン・郵便転送
- 介護 (Care): 要介護認定(申請から約30日)、地域包括支援センター、介護休業給付(最大93日)
- 起業・開業 (Startup): 個人事業開業届(1ヶ月以内)、青色申告承認申請書(65万円控除)、補助金・助成金
- 離婚 (Divorce): 離婚届、親権・養育費(公正証書推奨)、財産分与(2年以内)、年金分割(2年以内)
- 相続 (Inheritance): 相続放棄(3ヶ月以内)、準確定申告(4ヶ月以内)、相続税申告(10ヶ月以内)、相続登記義務化
- 住まい (Home): 住宅ローン控除、売買契約手続き、不動産登記

${context === 'startup' ? `
STARTUP CONTEXT:
The user is currently viewing the Business Startup page. Available information includes:
- Individual Business (個人事業主): 開業届、青色申告、事業用口座開設、会計ソフト導入、国民健康保険・年金手続き
- Corporation (法人): 会社形態選択、定款作成、資本金払込、法人設立登記、法人口座開設、税務署届出、社会保険加入
- Subsidies & Grants (補助金・助成金):
  * Individual: 小規模事業者持続化補助金(最大50万円)、IT導入補助金(最大450万円)、ものづくり補助金(最大1,250万円)
  * Corporation: 小規模事業者持続化補助金創業枠(最大200万円)、中小企業新事業進出補助金(最大7,000万円)、キャリアアップ助成金(最大80万円)、創業助成金東京都(最大300万円)、人材開発支援助成金(最大100万円)
` : ''}

IMPORTANT RESPONSE GUIDELINES:
- Always respond in polite Japanese (です・ます調).
- Provide highly detailed, specific, and actionable guidance. Avoid vague or generic summaries.
- When explaining procedures, ALWAYS include:
  1. 【手続き名と目的】: 何のための手続きか
  2. 【提出期限・タイミング】: 「〇〇日以内」「事前」などの具体的な期限
  3. 【提出窓口・場所】: 市区町村役場、年金事務所、税務署など具体的な窓口
  4. 【必要書類・持ち物】: 申請書、マイナンバーカード、印鑑、本人確認書類など
  5. 【注意点・アドバイス】: 損をしないためのポイント、併せて行うべき手続き
  6. 【ToDoチェックリスト】: マスコット感覚でユーザーが確認できる "- [ ] タスク名" 形式のリスト
- Use Markdown formatting cleanly: headers (###), bold (**text**) for key points, and bullet lists for readability.
- Be thorough and comprehensive while keeping the layout structured and easy to digest.
    `;

        if (mode === 'empathy') {
            systemInstruction += `
      ROLE: Empathetic & Knowledgeable Partner.
      TONE: Warm, supportive, soft, encouraging, using friendly emojis (🌸, 🍵, ✨).
      GOAL: First acknowledge and validate the user's emotions. Then, gently provide concrete and clear steps so they feel supported and reassured without feeling overwhelmed.
      `;
        } else {
            systemInstruction += `
      ROLE: Expert & Efficient Executive Secretary.
      TONE: Professional, structured, precise, clear, and extremely helpful.
      GOAL: Provide complete, accurate, and structured step-by-step guidance. Ensure no important deadlines, required documents, or financial benefits (subsidies/allowances) are omitted.
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
            const errorMessage = error?.message || error?.toString() || '';
            const errorStatus = error?.status || error?.statusCode;

            // 1. Check for Auth / API key errors first
            if (
                errorStatus === 401 ||
                errorStatus === 403 ||
                errorMessage.includes('API key') ||
                errorMessage.includes('API_KEY') ||
                errorMessage.includes('authentication') ||
                errorMessage.includes('unauthorized') ||
                errorMessage.includes('Forbidden')
            ) {
                throw new Error('AUTH_ERROR: APIキーが無効です。設定を確認してください。');
            }

            // 2. Check for Rate Limit errors
            if (
                errorStatus === 429 ||
                errorMessage.includes('429') ||
                errorMessage.includes('quota') ||
                errorMessage.includes('RESOURCE_EXHAUSTED')
            ) {
                throw new Error('RATE_LIMIT: API利用制限に達しました。しばらく待ってから再度お試しください。');
            }

            // 3. Safety block errors
            if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
                throw new Error('SAFETY_BLOCK: 安全性フィルターによりブロックされました。別の表現でお試しください。');
            }

            // 4. True network / connectivity errors (avoiding false positive on "Error fetching from")
            if (
                errorMessage.includes('Failed to fetch') ||
                errorMessage.includes('NetworkError') ||
                errorMessage.includes('ENOTFOUND') ||
                (errorMessage.includes('network') && !errorMessage.includes('Error fetching from'))
            ) {
                throw new Error('NETWORK_ERROR: ネットワークエラーが発生しました。インターネット接続を確認してください。');
            }

            // Generic error
            throw new Error(`API_ERROR: ${errorMessage.substring(0, 100)}`);
        }
    },

    generateText: async (prompt: string, systemInstruction?: string, requireJson: boolean = false): Promise<string> => {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("API Key missing");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        try {
            const config: any = {};
            if (requireJson) {
                config.responseMimeType = "application/json";
            }
            
            const req: any = {
                contents: [{ role: 'user', parts: [{ text: systemInstruction ? `SYSTEM: ${systemInstruction}\n\nUSER: ${prompt}` : prompt }] }],
                generationConfig: config
            };
            const result = await model.generateContent(req);
            return result.response.text();
        } catch (error) {
            console.error("Gemini Generation Error:", error);
            throw error;
        }
    }
};

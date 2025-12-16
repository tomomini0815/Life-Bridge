
export interface ExtractedData {
    type: 'receipt' | 'form' | 'card' | 'unknown';
    text: string;
    data?: Record<string, any>;
    confidence: number;
}

export const OCRService = {
    scanDocument: async (file: File): Promise<ExtractedData> => {
        // Simulate network delay for "AI processing" feel (2-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // In a real app, this would call Google Cloud Vision API or similar
        // For this demo, we mock results based on filename or random
        const isReceipt = file.name.toLowerCase().includes('receipt') || file.name.toLowerCase().includes('領収書');

        if (isReceipt) {
            return {
                type: 'receipt',
                text: '領収書\n株式会社ライフブリッジ\n合計 ¥15,000\n2025年12月16日',
                data: {
                    amount: 15000,
                    date: '2025-12-16',
                    merchant: '株式会社ライフブリッジ',
                    category: 'benefit' // Simulated category inference
                },
                confidence: 0.98
            };
        }

        return {
            type: 'form',
            text: '出生届\n氏名: 田中 太郎\n生年月日: 2025年12月16日',
            data: {
                documentType: '出生届',
                name: '田中 太郎',
                date: '2025-12-16'
            },
            confidence: 0.95
        };
    }
};

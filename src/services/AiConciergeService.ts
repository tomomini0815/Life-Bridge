export interface AiMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: string[];
}

export type UserContext = 'moving' | 'baby' | 'marriage' | 'retirement' | 'general';
export type ChatMode = 'normal' | 'empathy';
export type Intent = 'greeting' | 'baby_tired' | 'distress' | 'gratitude' | 'moving_deadline' | 'moving_general' | 'baby_money' | 'baby_general' | 'general_help';

// --- Response Templates ---
const RESPONSE_TEMPLATES: Record<ChatMode, Record<Intent, string[]>> = {
    normal: {
        greeting: [
            'LifeBridgeコンシェルジュです。本日はどのようなご用件でしょうか？',
            'こんにちは。手続きやスケジュールの確認など、事務的なサポートはお任せください。',
            'お疲れ様です。効率的にタスクを処理しましょう。何から始めますか？'
        ],
        distress: [
            'お困りのようですね。状況を整理するために、具体的な問題点を教えていただけますか？',
            'タスクが多すぎて混乱されているかもしれません。優先順位の高いものからリストアップしましょうか？',
            '休息も効率の一部です。一度休憩してから、再度タスクに取り掛かることを提案します。'
        ],
        gratitude: [
            'お役に立てて光栄です。他にも不明点があればお申し付けください。',
            '解決して良かったです。引き続きサポートが必要な際はご連絡ください。',
            '承知しました。次のタスクに進みましょうか？'
        ],
        moving_deadline: [
            '引越しの期限管理ですね。「転出届」は予定日14日前から可能です。カレンダーに登録しますか？',
            '重要な期限は「解約予告」と「役所手続き」です。リスト化して管理することをお勧めします。',
            '期限遅れを防ぐため、リマインダーを設定しましょう。具体的な引越し日は決まっていますか？'
        ],
        moving_general: [
            '引越し手続きは多岐にわたります。まずは「電気・ガス・水道」のライフラインから片付けましょう。',
            '荷造りの進捗はいかがですか？粗大ゴミの収集予約は早めに行う必要があります。',
            '転居先でのネット回線の手配はお済みですか？早めの申し込みをお勧めします。'
        ],
        baby_money: [
            '給付金についてですね。「児童手当」や「出産手当金」の申請要件を確認しましょう。',
            'お金の手続きは抜け漏れがないようにしたいですね。申請期限のリストをお出ししますか？',
            '育休中の社会保険料免除など、利用できる制度は全て活用しましょう。詳細を確認しますか？'
        ],
        baby_tired: [
            '育児の負担が大きいようですね。一時保育やファミリーサポートの利用を検討してはいかがでしょうか。',
            '睡眠不足は判断力を低下させます。パートナーやご家族と分担を見直すことも一つの手段です。',
            '地域の産後ケア事業を検索できます。専門家のサポートを受けることをお勧めします。'
        ],
        baby_general: [
            'お子様の手続きですね。まずは「出生届」と「健康保険証」の発行を優先してください。',
            '予防接種のスケジュール管理は複雑です。アプリで管理するよう設定しましょうか？',
            '赤ちゃんの成長に合わせて必要な手続きが変わります。来月の予定を確認しますか？'
        ],
        general_help: [
            'どのような手続きについて知りたいですか？キーワードを入力していただければ、該当する情報を検索します。',
            '人生の転機には多くの手続きが発生します。カテゴリ（引越し、結婚、出産など）を教えていただけますか？',
            '検索機能もご利用いただけます。具体的な制度名などが分かれば入力してください。'
        ]
    },
    empathy: {
        greeting: [
            'こんにちは。今日はどのような気分ですか？無理せず、ゆっくりお話ししましょう。',
            'LifeBridgeコンシェルジュです。あなたのペースで大丈夫ですよ。何か心に引っかかっていることはありますか？',
            'お疲れ様です。手続きのことでも、ただの愚痴でも、何でも聞きますからね。'
        ],
        distress: [
            'それは本当にお辛いですね...。全部ひとりで抱え込まなくて大丈夫ですよ。',
            '毎日頑張っていらっしゃるんですね。今日は温かい飲み物でも飲んで、少しだけ自分を甘やかしてあげてください。',
            '焦らなくていいんです。今は立ち止まっても大丈夫。私がここにいますから、不安な気持ちを吐き出してみませんか？'
        ],
        gratitude: [
            '少しでも心が軽くなられたなら、私もうれしいです。いつでもここにいますからね。',
            '良かった...！あなたの笑顔が戻ることが、私にとって一番の喜びです。',
            'リラックスできたようで安心しました。また何かあったら、すぐに呼んでくださいね。'
        ],
        moving_deadline: [
            '引越しの日が近づくと、どうしても焦ってしまいますよね。大丈夫、一つずつ片付ければ間に合いますよ。',
            '期限のことを考えるとドキドキしますよね。私がしっかり管理しますから、あなたは荷造りの合間に深呼吸してください。',
            '忙しい中、準備を進めていて偉いです！手続きのことは私に任せて、新生活の楽しい想像をしましょう。'
        ],
        moving_general: [
            '引越しの準備、本当にお疲れ様です📦 慣れないことばかりで気疲れしていませんか？',
            '荷造りって、思い出の品が出てきたりして意外と進まないですよね。無理せず、今日はここまで！と決めるのも大切ですよ。',
            '新しい場所での生活、楽しみですね✨ 不安なこともあると思いますが、私がサポートしますから安心してください。'
        ],
        baby_money: [
            'お子様のためのお金のこと、心配になりますよね。制度は私たちで確認して、少しでも安心材料を増やしましょう。',
            '将来のことを考えると不安になるお気持ち、よく分かります。まずは利用できる手当を知ることから始めましょう。大丈夫ですよ。',
            '手続き書類って難しくて頭が痛くなりますよね...。私がわかりやすく説明しますから、一緒に見ていきましょう。'
        ],
        baby_tired: [
            '毎日本当にお疲れ様です。自分のことは後回しになりがちですよね。誰かに頼ることは、悪いことじゃありませんよ。',
            '眠れない日が続くと、心も体も悲鳴を上げてしまいます。数分でもいいので、目を閉じて横になってくださいね。',
            'あなたは十分すぎるくらい頑張っています。今日はもう頑張らなくていい日です。私の前では弱音を吐いても大丈夫ですよ。'
        ],
        baby_general: [
            '赤ちゃんと一緒の生活、慣れないことも多くて大変ですよね。お子様の寝顔を見て、深呼吸してくださいね👶',
            '不安なことがあれば、いつでも私に聞いてください。「こんなこと聞いていいのかな？」なんて思わなくて大丈夫ですよ。',
            'お子様の成長は嬉しい反面、悩みも尽きないですよね。正解なんてないんですから、あなたのペースで大丈夫です。'
        ],
        general_help: [
            '何かお困りですか？上手く言葉にできなくても大丈夫。私があなたの気持ちに寄り添います。',
            '人生の転機は、心に大きな負担がかかるものです。無理にポジティブにならなくていいんですよ。',
            'まずは深呼吸しましょうか。ゆっくりで大丈夫。今、一番気になっていることから教えてください。'
        ]
    }
};

const ACTION_SUGGESTIONS: Record<ChatMode, Record<Intent, string[]>> = {
    normal: {
        greeting: ['引越しの手続き', '出産・育児', 'タスク一覧を見る'],
        distress: ['タスクを整理する', '優先順位をつける', '休憩をスケジュール'],
        gratitude: ['次のタスクへ', 'ホームに戻る'],
        moving_deadline: ['カレンダーに追加', 'リストを作成', '役所の場所を確認'],
        moving_general: ['電気・ガス手続き', '粗大ゴミ予約', 'ネット回線比較'],
        baby_money: ['給付金を試算', '申請書をDL', '必要書類リスト'],
        baby_tired: ['一時保育を探す', 'ファミサポ検索', '家事代行を探す'],
        baby_general: ['出生届について', '予防接種リスト', '検診スケジュール'],
        general_help: ['手続き一覧', 'よくある質問', '検索する']
    },
    empathy: {
        greeting: ['少し疲れた', '話を聞いてほしい', '不安がある'],
        distress: ['うまく言葉にできない', '何もしたくない', '誰かに相談したい'],
        gratitude: ['ありがとう', '少し落ち着いた'],
        moving_deadline: ['焦ってしまう', '何とかなる？', '管理をお願い'],
        moving_general: ['荷造りが終わらない', '寂しい', '楽しみだけど不安'],
        baby_money: ['将来が心配', '難しくて分からない', '助けてほしい'],
        baby_tired: ['もう限界かも', '少しだけ休みたい', '話を聞いて'],
        baby_general: ['これでいいのかな', '自信がない', '子供は可愛いけど...'],
        general_help: ['漠然と不安', '話したい', '落ち着きたい']
    }
};

export const AiConciergeService = {
    // Helper: Detect Intent based on keywords
    detectIntent: (message: string, context: UserContext): Intent => {
        const msg = message; // Normalize if needed

        // 0. Greeting (Highest Priority)
        if (msg.includes('こんにちは') || msg.includes('初めまして') || msg.includes('はじめまして')) return 'greeting';

        // 1. Distress / Emotion
        if (msg.includes('疲れ') || msg.includes('つらい') || msg.includes('眠れない') || msg.includes('限界') || msg.includes('休みたい')) return 'baby_tired';
        if (msg.includes('不安') || msg.includes('心配') || msg.includes('焦り') || msg.includes('怖い')) return 'distress';
        if (msg.includes('ありがとう') || msg.includes('助かった') || msg.includes('落ち着いた')) return 'gratitude';

        // 2. Context Specific
        if (context === 'moving') {
            if (msg.includes('期限') || msg.includes('いつまで') || msg.includes('日')) return 'moving_deadline';
            return 'moving_general';
        }
        if (context === 'baby') {
            if (msg.includes('金') || msg.includes('手当') || msg.includes('費用')) return 'baby_money';
            if (msg.includes('疲れ') || msg.includes('寝ない')) return 'baby_tired';
            return 'baby_general';
        }

        return 'general_help';
    },

    // Helper: Get random item excluding recent uses
    getRandomItem: <T>(arr: T[], history: AiMessage[]): T => {
        // Filter out items that are already in history (exact match content)
        const recentAiResponses = new Set(
            history
                .filter(m => m.role === 'assistant')
                .slice(-5)
                .map(m => m.content)
        );

        const available = arr.filter(item => !recentAiResponses.has(String(item)));

        // If all available items are used, reset pool
        const pool = available.length > 0 ? available : arr;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    // Main Process
    processMessage: async (message: string, context: UserContext, mode: ChatMode = 'normal', history: AiMessage[] = []): Promise<AiMessage> => {
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

        // 1. Detect Intent
        let intent = AiConciergeService.detectIntent(message, context);
        if (intent === 'baby_tired' && context !== 'baby') intent = 'distress';

        // 2. Select Response with Memory
        const responses = RESPONSE_TEMPLATES[mode][intent] || RESPONSE_TEMPLATES[mode]['general_help'];
        let content = AiConciergeService.getRandomItem(responses, history);

        // 3. Smart Context: Check if user is repeating the same question immediately
        const lastUserMsg = history.filter(m => m.role === 'user').pop();
        if (lastUserMsg && lastUserMsg.content === message) {
            const prefix = mode === 'empathy'
                ? '気になりますよね。繰り返しになりますが、\n'
                : '先ほどもお伝えしましたが、\n';
            // Only add prefix if it's not already there logic could be added, but simple append is fine
            content = prefix + content;
        }

        // 4. Select Actions
        const actions = ACTION_SUGGESTIONS[mode][intent] || ACTION_SUGGESTIONS[mode]['general_help'];

        return {
            id: Date.now().toString(),
            role: 'assistant',
            content,
            timestamp: new Date(),
            actions,
        };
    },

    // Proactive suggestion based on context
    getProactiveSuggestion: (context: UserContext): AiMessage | null => {
        if (context === 'moving') {
            return {
                id: 'proactive-1',
                role: 'assistant',
                content: '💡 引越しまであと2週間ですね。\nそろそろ「粗大ゴミの予約」をしておかないと間に合わないかもしれません。確認しますか？',
                timestamp: new Date(),
                actions: ['粗大ゴミ予約を確認'],
            };
        }
        if (context === 'baby') {
            return {
                id: 'proactive-2',
                role: 'assistant',
                content: '👶 生後14日が経過しました。\n「出生届」の提出期限が今日までです！まだ提出されていないようでしたら、今すぐ確認しましょう。',
                timestamp: new Date(),
                actions: ['出生届を確認する'],
            };
        }
        return null;
    }
};

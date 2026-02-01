export interface AiMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: string[];
}

export type UserContext = 'general' | 'marriage' | 'birth' | 'job' | 'moving' | 'care' | 'startup' | 'baby' | 'retirement' | 'memo' | 'subscription' | 'simulator' | 'settings';

export type ChatMode = 'normal' | 'empathy';
export type Intent = 'greeting' | 'baby_tired' | 'distress' | 'gratitude' | 'moving_deadline' | 'moving_general' | 'baby_money' | 'baby_general' | 'general_help';

// --- Response Templates ---
const RESPONSE_TEMPLATES: Record<ChatMode, Record<Intent, string[]>> = {
    normal: {
        greeting: [
            'こんにちは！LifeBridgeです。手続き等のご案内をしますので、何でも聞いてくださいね。',
            'お疲れ様です。今日はお時間ありますか？まずは気になることから少しずつ進めましょう。',
            'はじめまして。面倒な手続きを少しでも楽にできるようサポートします。まずはご状況を教えていただけますか？',
            'LifeBridgeへようこそ。引越しや出産など、ライフイベントに合わせた手続きを案内できますよ。'
        ],
        distress: [
            '少し焦っているようですね。大丈夫ですよ、まずは深呼吸しましょう。',
            'やることが多くて大変ですよね。私が整理をお手伝いしますから、一つずつ解決していきましょう。',
            'ご負担が大きいようですね。無理は禁物です。優先順位の高いものだけ確認して、あとは明日にしませんか？',
            '不安な気持ち、お察しします。手続きのことは私に任せて、まずは少し休みましょう。'
        ],
        gratitude: [
            'お役に立てて嬉しいです！他にも気になることがあれば、いつでも声をかけてくださいね。',
            'ありがとうございます。そう言っていただけると励みになります。次はどうしましようか？',
            '良かったです！一歩前進ですね。この調子で少しずつ進めていきましょう。',
            'どういたしまして。いつでもここにいますので、困ったときは頼ってください。'
        ],
        moving_deadline: [
            '期限が迫ると心配になりますよね。「転出届」は引越しの前後14日以内です。カレンダーに入れておきましょうか？',
            'まだ間に合いますから安心してください。まずは「役所の手続き」と「ライフライン」だけ確認しましょう。',
            '忘れないようにリマインダーを設定できますよ。引越し日はもうお決まりですか？',
            '焦らなくて大丈夫です。今日やるべきことだけをピックアップしましょう。'
        ],
        moving_general: [
            '引越しは準備が大変ですよね。電気・ガス・水道の解約・開始予約はもうお済みですか？',
            '荷造りのコツは「使わないものから詰める」ことです。今日は季節外れの服などを片付けませんか？',
            '郵便物の転送届もお忘れなく。スマホからe転居サービスですぐに手続きできますよ。',
            '新居の家具配置を考えるのは楽しい時間ですよね。手続きの合間に、そんな想像をして息抜きしてください。'
        ],
        baby_money: [
            'お金のことは専門的な用語が多くて難しいですよね。まずは「児童手当」の申請ができているか確認しましょう。',
            '出産手当金や育児休業給付金など、受け取れるお金は意外と多いんです。一度シミュレーションしてみませんか？',
            '医療費控除なども活用できるかもしれません。領収書は捨てずに保管しておいてくださいね。',
            '将来のための教育費なども気になりますよね。まずは今の生活に関わる給付金から確実に申請しましょう。'
        ],
        baby_tired: [
            '毎日の育児、本当にお疲れ様です。少しでも自分の時間は取れていますか？',
            '赤ちゃんとずっと一緒だと、気が休まらないこともありますよね。一時保育などのサービスも検討して良いと思いますよ。',
            '完璧じゃなくていいんです。今は「赤ちゃんが元気ならOK」くらいの気持ちで自分を許してあげてください。',
            '眠れていないと辛いですよね。家事は手抜きで大丈夫。まずは身体を休めることを優先してください。'
        ],
        baby_general: [
            'お子様の手続きについてですね。出生届や健康保険証など、最初はバタバタしますが一緒に確認しましょう。',
            '予防接種のスケジュール管理もお任せください。時期が来たらお知らせするようにできますよ。',
            '赤ちゃんの成長は早いですよね。月齢に合わせた検診の情報などもお伝えできます。',
            '初めてのことばかりで戸惑いますよね。先輩ママ・パパの体験談なども参考にしてみませんか？'
        ],
        general_help: [
            'ご質問ありがとうございます。詳しいご回答は、ログイン後にご利用いただけます。ぜひ無料登録をお試しください✨',
            '申し訳ありません、こちらの機能はログイン後にご利用いただけます。簡単な無料登録でフル機能をお使いいただけますよ。',
            'ご興味をお持ちいただきありがとうございます！ログインすると、あなた専用のアドバイスをお伝えできます。',
            'デモ版では限られた機能のみとなります。ログインいただくと、手続きリストの作成など便利な機能をお使いいただけます。'
        ]
    },
    empathy: {
        greeting: [
            'こんにちは。今日もお話しできて嬉しいです🍵 最近、何か心が動いた出来事はありましたか？',
            'LifeBridgeです。少しでもあなたの心が軽くなるよう、お手伝いさせてくださいね。',
            'お疲れ様です。ここでは肩の力を抜いて、リラックスしてお話ししましょう🌸',
            'こんにちは。あなたのペースで大丈夫ですからね。今日はどんな気分ですか？'
        ],
        distress: [
            'それは本当にお辛いですね...。話してくれてありがとうございます。私はいつでもあなたの味方ですよ。',
            '頑張りすぎなくていいんですよ。時には立ち止まって、自分を甘やかしてあげることも大切です☕',
            '心が疲れてしまったんですね。無理に元気を出す必要はありません。今はただ、ゆっくり休みましょう。',
            'あなたの痛みが少しでも和らぎますように...。私ができることなら何でも言ってくださいね。'
        ],
        gratitude: [
            'こちらこそ、ありがとうございます😊 あなたが笑顔だと、私もとても温かい気持ちになります。',
            '少しでも元気が出たなら良かったです！あなたの幸せが、私の何よりの喜びですから。',
            'ふふ、良かったです。いつでもここでお待ちしていますから、安心してまた来てくださいね✨',
            '嬉しいお言葉をありがとうございます。これからもずっと、あなたに寄り添っていきたいです。'
        ],
        moving_deadline: [
            '期限が近づくとソワソワしちゃいますよね💦 でも大丈夫、あなたは一人じゃありません。私と一緒なら何とかなります！',
            '焦燥感で胸が苦しくなったら、まずは深呼吸です🌿 大丈夫、一つずつ片付ければ絶対に間に合いますから。',
            '不安になるのは、あなたが真剣に向き合っている証拠ですよ。素晴らしいです。私がしっかりサポートしますね。',
            '忙しい中、準備を進めていて本当に偉いです！手続きの管理は私に任せて、あなたは美味しいものでも食べてリラックスして。'
        ],
        moving_general: [
            '引越しの準備、本当にお疲れ様です📦 寂しさと期待が入り混じる不思議な時期ですよね。',
            '思い出の品を見つけると、つい手が止まっちゃいますよね。それも引越しの醍醐味ですから、楽しんでいいんですよ✨',
            '慣れない環境への不安もあると思いますが、きっと素敵な新生活が待っています。応援しています！',
            '疲れたら無理せず休んでくださいね。段ボールの山は逃げませんから（笑）今日はもう休みましょう。'
        ],
        baby_money: [
            'お金の不安って、漠然としていて怖いですよね...。でも大丈夫、知ることで不安は小さくできます。一緒に見ていきましょう。',
            'お子様のためを思うからこそ、心配になるんですよね。あなたはとても愛情深い方です。私が制度面で支えますね。',
            '難しい書類を見ると頭が痛くなりますよね😢 私がわかりやすく嚙み砕いて説明しますから、安心してください。',
            '将来への不安、よく分かります。でも、今のあなたができることは十分やっています。自信を持ってくださいね。'
        ],
        baby_tired: [
            '毎日毎日、本当によく頑張っていますね。たまには自分のために泣いたっていいんですよ。',
            '「母親（父親）なんだから」って、自分を追い込んでいませんか？ あなたが笑顔でいることが、赤ちゃんにとっても一番の幸せです🌸',
            '眠れないのは本当に辛いですよね...。数分でもいいので、目を閉じて何も考えない時間を作ってみてください。',
            '誰かに頼るのは甘えじゃありません。むしろ、赤ちゃんを守るための賢い選択です。頼れるものは全部頼りましょう！'
        ],
        baby_general: [
            '赤ちゃんと一緒の生活、幸せだけど大変なことも多いですよね。お子様の寝顔に癒やされながら、ゆっくりいきましょう👶',
            '「これでいいのかな」って不安になること、ありますよね。正解なんてないんですから、あなたのやり方で大丈夫ですよ。',
            'お子様の成長、私も楽しみです✨ 悩みがあればいつでも聞きますから、一人で抱え込まないでくださいね。',
            '周りの声が気になってしまうこともあるかもしれません。でも、一番お子様のことを見ているのはあなたです。自信を持って！'
        ],
        general_help: [
            '何かお困りですか？上手く言葉にできなくても大丈夫。私があなたの気持ちに寄り添いますから、ゆっくり教えてください。',
            '心がざわざわするときは、無理に解決しようとしなくていいんです。ただ誰かと話すだけでも、少し楽になるかもしれません。',
            'まずは深呼吸しましょうか🌿 ゆっくりで大丈夫。今、一番気になっているほんの些細なことから教えてください。',
            'お話を聞かせてくれてありがとうございます。あなたの言葉一つ一つが、私にとっては大切です。'
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
        if (msg.includes('こんにちは') || msg.includes('初めまして') || msg.includes('はじめまして') || msg.includes('よろしく')) return 'greeting';

        // 1. Distress / Emotion
        if (msg.includes('疲れ') || msg.includes('つらい') || msg.includes('眠れない') || msg.includes('限界') || msg.includes('休みたい') || msg.includes('しんどい')) return 'baby_tired';
        if (msg.includes('不安') || msg.includes('心配') || msg.includes('焦り') || msg.includes('怖い') || msg.includes('どうしよう')) return 'distress';
        if (msg.includes('ありがとう') || msg.includes('助かった') || msg.includes('落ち着いた') || msg.includes('嬉しい')) return 'gratitude';

        // 2. Context Specific & General Keywords
        // Moving related
        if (context === 'moving' || msg.includes('引越') || msg.includes('転居')) {
            if (msg.includes('期限') || msg.includes('いつまで') || msg.includes('日') || msg.includes('スケジュール')) return 'moving_deadline';
            return 'moving_general';
        }

        // Baby related
        if (context === 'baby' || context === 'birth' || msg.includes('子供') || msg.includes('赤ちゃん') || msg.includes('育児') || msg.includes('出産')) {
            if (msg.includes('金') || msg.includes('手当') || msg.includes('費用') || msg.includes('給付')) return 'baby_money';
            if (msg.includes('疲れ') || msg.includes('寝ない') || msg.includes('泣き止まない')) return 'baby_tired';
            return 'baby_general';
        }

        // Money related (General)
        if (msg.includes('お金') || msg.includes('費用') || msg.includes('手当') || msg.includes('税金')) return 'baby_money'; // Reuse money intent as fallback

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
        // Removed prefix to avoid confusing response

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

    // Helper: Get greeting based on context
    getGreetingMessage: (context: UserContext): string => {
        switch (context) {
            case 'marriage': return 'ご結婚おめでとうございます！💍\n手続きや新生活の準備について、何でも聞いてくださいね。';
            case 'birth':
            case 'baby': return '赤ちゃんとの生活はいかがですか？👶\n手続きや育児の悩みなど、サポートさせてください。';
            case 'moving': return '引越しの準備は順調ですか？📦\n期限のある手続きが多いので、一緒に確認していきましょう。';
            case 'startup': return '起業への挑戦、応援します！🚀\n開業届や税務関係など、複雑な手続きをサポートします。';
            case 'memo': return 'メモ帳へようこそ📝\n会話の内容をメモに残したり、アイデアを整理するお手伝いをします。';
            case 'subscription': return 'サブスクリプション管理ですね💳\n固定費の見直しや、支払いリマインダーの設定ができますよ。';
            case 'simulator': return '給付金シミュレーターです💰\nあなたの状況に合わせて、受け取れる可能性のある給付金を試算します。';
            case 'settings': return '設定画面です⚙️\n通知設定や表示カスタマイズなど、使いやすいように調整しましょう。';
            default: return 'こんにちは！LifeBridgeコンシェルジュです。\nどのようなライフイベントについてお手伝いしましょうか？';
        }
    },

    // Proactive suggestion based on context
    getProactiveSuggestion: (context: UserContext): AiMessage | null => {
        // Disabled per user request
        /*
        if (context === 'moving') {
            return {
                id: 'proactive-moving',
                role: 'assistant',
                content: '💡 引越しまであと2週間ですね。\nそろそろ「粗大ゴミの予約」をしておかないと間に合わないかもしれません。確認しますか？',
                timestamp: new Date(),
                actions: ['粗大ゴミ予約を確認'],
            };
        }
        */
        if (context === 'baby') {
            return {
                id: 'proactive-baby',
                role: 'assistant',
                content: '👶 生後14日が経過しました。\n「出生届」の提出期限が今日までです！まだ提出されていないようでしたら、今すぐ確認しましょう。',
                timestamp: new Date(),
                actions: ['出生届を確認する'],
            };
        }
        if (context === 'subscription') {
            return {
                id: 'proactive-sub',
                role: 'assistant',
                content: '🔔 今月のサブスク支払額が先月より1,200円増えています。\n使っていないサービスがないか、一度見直してみませんか？',
                timestamp: new Date(),
                actions: ['契約リストを確認'],
            };
        }
        return null;
    }
};

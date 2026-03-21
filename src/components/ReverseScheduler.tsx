import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, ArrowRight, CheckCircle2, Target, BookOpen, Brain, Zap, ListFilter, Briefcase, Building, MapPin, GraduationCap, Home, Lightbulb, UserCheck, Search, Plane, Rocket, Flag, ClipboardList, PenTool, TrendingUp, Handshake, Trophy, Route, Heart, Baby, Truck, Calculator, Building2, HelpCircle, HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { differenceInMonths, differenceInDays, format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Phase {
    id: string;
    name: string;
    icon: React.ElementType;
    monthsBefore: number;
    description: string;
    tasks: string[];
    color: string;
}

const defaultPhases: Phase[] = [
    {
        id: 'phase1',
        name: '目標の具体化と準備',
        icon: Route,
        monthsBefore: 6,
        description: '目標達成の基準を明確にし、必要な環境や道具を整えながら無理のない計画を立てます。',
        tasks: ['目標達成の基準（状態・数値など）を明確にする', '必要なもの（道具・環境・予算・時間）を準備する', '現実に即したスケジュールと小さな中間目標を立てる'],
        color: 'text-slate-500 bg-slate-50 border-slate-200'
    },
    {
        id: 'phase2',
        name: '実行と中間チェック',
        icon: TrendingUp,
        monthsBefore: 3,
        description: '計画に沿って習慣化・実行を継続し、進捗や無理がないかを定期的に確認・修正します。',
        tasks: ['立てた計画を日々の習慣に落とし込んで実行する', '現在地と目標とのギャップを客観的に確認する', '進捗の遅れや無理があれば、やり方や計画を柔軟に修正する'],
        color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    {
        id: 'phase3',
        name: '最終調整とラストスパート',
        icon: Trophy,
        monthsBefore: 1,
        description: '目標達成に向けて残された課題を消化し、モチベーションと体調を整えてゴールを目指します。',
        tasks: ['残されている課題を集中してクリアする', '体調やモチベーションを整え、万全の状態で本番に臨む', 'これまでの過程を振り返り、次のステップへの準備をする'],
        color: 'text-rose-500 bg-rose-50 border-rose-200'
    }
];

const categoryPhases: Record<string, Phase[]> = {
    marriage: [
        {
            id: 'marriage-1',
            name: '両家顔合わせ・式場選び',
            icon: Search,
            monthsBefore: 12,
            description: '結婚の意思を固め、両家への挨拶から結婚式の具体的なイメージ作りと式場選びを行います。',
            tasks: [
                '両家親への挨拶日程調整と当日の手土産・服装準備',
                '顔合わせ食事会・結納の形式決定と会場の手配',
                '結婚式の希望スタイル（時期・規模・エリア）のすり合わせ',
                'ブライダルフェアの予約と複数会場の見学・見積もり比較',
                '結婚指輪・婚約指輪のブランド選定とオーダー手続き'
            ],
            color: 'text-pink-500 bg-pink-50 border-pink-200'
        },
        {
            id: 'marriage-2',
            name: '結婚式準備・各種手続き',
            icon: ClipboardList,
            monthsBefore: 6,
            description: '式場の打ち合わせを本格化させ、新居探しや役所での入籍手続きの準備を進めます。',
            tasks: [
                '結婚式の招待客リスト作成と招待状の発送',
                'ウェディングドレス・タキシード等の衣装合わせと決定',
                '新生活に向けた新居の選定と賃貸契約・引越し準備',
                '婚姻届の証人欄記入依頼と戸籍謄本など必要書類の取得',
                '勤務先への結婚報告と慶弔休暇・各種手当の申請手続き'
            ],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        },
        {
            id: 'marriage-3',
            name: '入籍・挙式本番と名義変更',
            icon: Heart,
            monthsBefore: 1,
            description: '式の最終確認を行い、入籍に伴う公的機関や金融機関などでの名義変更手続きを完了させます。',
            tasks: [
                '結婚式本番の搬入物確認・最終見積もりの支払い',
                '役所での婚姻届提出（入籍）と新住民票・戸籍の取得申請',
                'マイナンバーカード・運転免許証の氏名・住所変更手続き',
                '銀行口座・クレジットカード・各種保険の名義変更手続き',
                '参列者への内祝い・お礼状の手配と新生活のスタート'
            ],
            color: 'text-red-500 bg-red-50 border-red-200'
        }
    ],
    birth: [
        {
            id: 'birth-1',
            name: '妊娠初期・産院選び',
            icon: Search,
            monthsBefore: 9,
            description: '妊娠の確定から産院の決定、役所での母子手帳交付など初期の重要手続きを行います。',
            tasks: [
                '産科での妊娠確定診断と分娩予定日の確認',
                '里帰り出産等の希望に応じた産院・分娩施設の予約',
                '市区町村役場への妊娠届の提出と母子健康手帳の受け取り',
                '妊婦一般健康診査受診票（補助券）の受け取りと利用申請',
                '勤務先への妊娠報告と産休・育休の取得期間のすり合わせ'
            ],
            color: 'text-orange-500 bg-orange-50 border-orange-200'
        },
        {
            id: 'birth-2',
            name: '出産準備・保育園リサーチ',
            icon: Home,
            monthsBefore: 4,
            description: '出産・育児グッズの準備を進め、産後の生活環境作りや保育園の情報収集を開始します。',
            tasks: [
                'ベビー用品（ベビーベッド、チャイルドシート等）の購入・レンタル手配',
                '入院準備セットのパッキングと陣痛タクシーの事前登録',
                '自宅のレイアウト変更や危険箇所対策などの安全環境作り',
                '復職に向けた保育園の情報収集（保活）と見学予約',
                '出産手当金・育児休業給付金の申請書類の事前手配'
            ],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'birth-3',
            name: '出産本番と公的手続き',
            icon: Baby,
            monthsBefore: 0,
            description: '無事に出産を迎え、出生後すぐに必要となる期限付きの公的手続きを漏れなく完了させます。',
            tasks: [
                '【生後14日以内】市区町村役場への出生届の提出',
                '【生後15日以内】児童手当の認定請求書の提出（役所）',
                '健康保険証への子供の扶養加入手続き（勤務先または役所）',
                '乳幼児医療費助成（医療証）の交付申請手続き',
                '出産育児一時金（直接支払制度以外の場合）の申請手続き'
            ],
            color: 'text-yellow-500 bg-yellow-50 border-yellow-200'
        }
    ],
    divorce: [
        {
            id: 'divorce-1',
            name: '条件整理・合意形成',
            icon: ClipboardList,
            monthsBefore: 6,
            description: '財産や子供に関する条件を夫婦で話し合い、合意内容を法的な形に残す準備をします。',
            tasks: [
                '財産分与の対象となる共有財産（預貯金・不動産・保険）のリストアップ',
                '親権・養育費・面会交流・慰謝料に関する条件の取り決め',
                '合意内容をまとめた「離婚協議書」の作成と内容確認',
                '協議書に法的効力を持たせるための公証役場での「公正証書」作成手配',
                '弁護士などの専門家への初回無料相談（協議が難航する場合）'
            ],
            color: 'text-rose-500 bg-rose-50 border-rose-200'
        },
        {
            id: 'divorce-2',
            name: '自立に向けた生活準備',
            icon: Home,
            monthsBefore: 3,
            description: '離婚後の自立した生活に向けて、住居の確保や仕事、子供の環境調整を行います。',
            tasks: [
                '離婚後の新居探し、賃貸契約、または実家への転居手続き',
                '自身の経済的自立に向けた就職活動や収入源の確保',
                '子供の転校・転園が必要な場合の手続きと教育機関への事前相談',
                '引越し業者の手配と自分名義の家具・家電の調達',
                '（旧姓に戻る場合）新しい印鑑（実印・銀行印）の作成手配'
            ],
            color: 'text-orange-500 bg-orange-50 border-orange-200'
        },
        {
            id: 'divorce-3',
            name: '離婚届提出と名義変更',
            icon: PenTool,
            monthsBefore: 0,
            description: '役所に離婚届を提出し、それに伴う氏名変更や各種受給手続きを速やかに完了させます。',
            tasks: [
                '市区町村役場への離婚届の提出（証人2名の署名捺印済みのもの）',
                'マイナンバー・免許証・銀行口座・クレカ等の氏名・住所変更手続き',
                '国民年金・国民健康保険への切り替え、または勤務先での扶養から外れる手続き',
                '児童扶養手当・ひとり親家庭等医療費助成など、ひとり親向け支援の申請',
                '子供の氏を自分の氏に変更する場合の「子の氏の変更許可申立」と入籍届の提出'
            ],
            color: 'text-red-500 bg-red-50 border-red-200'
        }
    ],
    exam: [
        {
            id: 'exam-1',
            name: '情報収集・学習計画策定',
            icon: Search,
            monthsBefore: 12,
            description: '志望校の試験傾向を徹底分析し、年間を通じた具体的で現実的な学習スケジュールを作ります。',
            tasks: [
                '志望校の最新入試要項の確認と、配点・出題傾向の徹底分析',
                '現在の学力と合格ラインのギャップを測るための過去問初回受験',
                '自分に合った参考書・問題集の選定、または塾・予備校の体験授業参加',
                '月ごとの到達目標を設定した「年間学習スケジュール」の作成',
                '学習に集中できる環境作り（自習室の確保、スマホの制限設定など）'
            ],
            color: 'text-indigo-500 bg-indigo-50 border-indigo-200'
        },
        {
            id: 'exam-2',
            name: '基礎固め・弱点克服',
            icon: BookOpen,
            monthsBefore: 6,
            description: '基礎知識を完璧にし、模試を活用しながら苦手分野を徹底的につぶしていきます。',
            tasks: [
                '全科目の基礎参考書・単語帳の周回完了と定着度チェック',
                '定期的な外部模試の受験による客観的な実力測定と志望校判定の確認',
                '模試の分析に基づいた、苦手分野の洗い出しと集中補強学習',
                '学習のマンネリ化を防ぐための、週単位でのスケジュール微調整',
                '受験にかかる費用（受験料・交通費・宿泊費）の概算と準備'
            ],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        },
        {
            id: 'exam-3',
            name: '過去問演習・直前準備',
            icon: Target,
            monthsBefore: 2,
            description: '本番と同じ時間配分で過去問を解き、出願手続きや当日のコンディション調整を行います。',
            tasks: [
                '志望校の過去問5年分以上の演習と、本番を想定した時間配分トレーニング',
                '願書の取り寄せ、受験料の振り込み、必要書類（調査書等）を揃えての出願手続き',
                '受験票に使用する証明写真の撮影と、本番当日の交通経路・宿泊先の手配',
                'インフルエンザ予防接種などの体調管理と、朝型生活リズムへの完全移行',
                '試験前日の持ち物（受験票・時計・筆記用具・上着等）のリストアップと準備'
            ],
            color: 'text-violet-500 bg-violet-50 border-violet-200'
        }
    ],
    job: [
        {
            id: 'job-1',
            name: '徹底的な自己分析・市場調査',
            icon: UserCheck,
            monthsBefore: 6,
            description: 'キャリアの棚卸しを行い、転職市場での自身の価値と求める条件を極めて明確にします。',
            tasks: [
                '過去のすべての業務と実績を洗い出す徹底した「キャリア棚卸し」の実施',
                '転職理由の本質的な言語化と、絶対に譲れない条件（MUST/WANT）の優先順位付け',
                '希望業界の市場動向調査と、該当職種で求められるスキルの要件確認',
                '大手・特化型など複数の転職エージェントへの登録と、担当者との初回面談',
                '履歴書・職務経歴書の骨子作成と、エージェントによる初回添削'
            ],
            color: 'text-sky-500 bg-sky-50 border-sky-200'
        },
        {
            id: 'job-2',
            name: '書類完成・一斉エントリー',
            icon: Briefcase,
            monthsBefore: 3,
            description: '応募先企業に刺さる書類を完成させ、戦略的に複数の企業へエントリーと面接を進めます。',
            tasks: [
                '応募企業ごとの求める人物像に合わせた、職務経歴書のカスタマイズと完成',
                'デザイナー・エンジニア等は、実績を証明するポートフォリオの作成',
                '選考通過率を考慮した、第一志望群・滑り止め群へのバランス良いエントリー',
                'SPIなどの適性検査・筆記試験の対策（対象企業がある場合）',
                '頻出の質問（自己PR・転職理由・逆質問）に対する回答のスクリプト作成'
            ],
            color: 'text-cyan-500 bg-cyan-50 border-cyan-200'
        },
        {
            id: 'job-3',
            name: '最終面接・内定交渉・退職',
            icon: Handshake,
            monthsBefore: 1,
            description: 'オファー面談での条件交渉を行い、現職の円満退職に向けた手続きを確実に行います。',
            tasks: [
                '模擬面接の実施と、最終面接特有の「カルチャーマッチ」を意識した対策',
                '複数内定時の比較検討と、エージェントを通じた年収・入社日・ポジションの条件交渉',
                '内定承諾書の提出と、転職先の人事担当者との入社手続きサポートの確認',
                '現職への退職意思の伝達（直属の上司へ最低1ヶ月前）と、退職願の提出',
                '業務の引き継ぎ資料作成、社内外への挨拶回り、有給消化のスケジュール策定'
            ],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        }
    ],
    startup: [
        {
            id: 'start-1',
            name: 'ビジネスモデル検証・資金計画',
            icon: Lightbulb,
            monthsBefore: 12,
            description: '事業のアイデアを具体的なビジネスモデルに落とし込み、必要な資金と調達方法を見極めます。',
            tasks: [
                'ターゲット顧客層の特定と、競合にはない自社の優位性（USP）の明確化',
                '初期費用、当面の運転資金、売上目標などを記載した精緻な「事業計画書」の作成',
                '日本政策金融公庫や自治体の制度融資など、創業向け資金調達の要件確認',
                '個人事業主（開業届）か法人（株式会社/合同会社）かの事業形態の決定',
                '利用可能な創業補助金・助成金（小規模事業者持続化補助金など）のリサーチ'
            ],
            color: 'text-purple-500 bg-purple-50 border-purple-200'
        },
        {
            id: 'start-2',
            name: '融資実行・プロダクト準備',
            icon: Rocket,
            monthsBefore: 6,
            description: '資金を確保し、サービスや商品の開発、販売インフラの構築など実務的な準備を進めます。',
            tasks: [
                '金融機関との面談実施、融資審査の通過、および着金手続きの完了',
                '店舗やオフィスが必要な場合の物件探し、内装工事の契約、設備の導入準備',
                '商品・サービスのMVP（最小限の完成品）開発と、テストマーケティングの実施',
                '事業用の屋号や会社名の決定、ドメイン取得、ロゴマークや名刺の作成',
                '公式ホームページやECサイト、SNSアカウントなどのWeb集客用インフラ構築'
            ],
            color: 'text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200'
        },
        {
            id: 'start-3',
            name: '設立登記・開業と集客開始',
            icon: Building,
            monthsBefore: 1,
            description: '法的な設立手続きを終え、バックオフィス業務を整えて本格的な営業・集客を開始します。',
            tasks: [
                '（法人の場合）定款の作成・認証、出資金の払込、法務局への設立登記申請',
                '税務署・都道府県税事務所への「法人設立届」または「個人事業の開業届」の提出',
                '事業専用口座（法人口座）の開設と、クラウド会計ソフトの導入・初期設定',
                '従業員を雇用する場合の労働基準監督署・ハローワーク・年金事務所への届出',
                'プレスリリースの配信、SNS運用開始、初期顧客獲得に向けた営業・広告活動の開始'
            ],
            color: 'text-violet-500 bg-violet-50 border-violet-200'
        }
    ],
    moving: [
        {
            id: 'move-1',
            name: '条件設定と物件探し',
            icon: Search,
            monthsBefore: 3,
            description: '予算と希望エリアを絞り込み、内見を通じて納得できる新居を決定します。',
            tasks: [
                '家賃（手取りの3割目安）、間取り、通勤時間、周辺環境などの絶対条件の整理',
                '不動産ポータルサイトでの情報収集と、信頼できる不動産仲介業者の選定',
                '気になる物件の現地内見（日当たり、騒音、共用部の管理状態などをチェック）',
                '物件決定後の入居申し込み、入居審査の通過、および初期費用（敷金・礼金等）の準備',
                '現住居の賃貸契約書を確認し、管理会社へ指定期間前（通常1〜2ヶ月前）に退去予告通知'
            ],
            color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
        },
        {
            id: 'move-2',
            name: '契約手続き・見積もり・断捨離',
            icon: ClipboardList,
            monthsBefore: 1.5,
            description: '新居の契約を完了させ、引っ越し業者の手配と荷造りの前段階である不用品処分を行います。',
            tasks: [
                '重要事項説明の確認、賃貸借契約書の署名捺印、初期費用・火災保険料の支払い',
                '複数の引越し業者への相見積もり依頼（一括見積もりサイト活用）と業者の決定',
                '部屋ごとの荷物の仕分けと、不用品のメルカリ出品・粗大ゴミ収集手配・不用品回収の依頼',
                '新居に合わせた大型家具・家電の採寸、購入検討、引越し後到着の配達手配',
                '現在の住まいの駐車場の解約手続き、または新居での駐車場契約手続き'
            ],
            color: 'text-teal-500 bg-teal-50 border-teal-200'
        },
        {
            id: 'move-3',
            name: '荷造り完了とライフライン移転',
            icon: Truck,
            monthsBefore: 0.5,
            description: '荷造りを終わらせ、電気やガスなどの生活インフラと役所の手続きを確実に済ませます。',
            tasks: [
                '普段使わない季節物などからの荷造り開始と、段ボールへの内容物・運ぶ先の部屋番号の明記',
                '電気・ガス（ガスは立ち会い要）・水道・インターネットの解約および新居での開通手続き',
                '市区町村役場での「転出届」の提出（マイナポータルでオンライン手続きも可能）',
                '郵便局での「転居届（郵便物の転送サービス）」手配と、クレジットカード等の住所変更',
                '引越し当日の旧居の立ち会い・鍵返却と、新居での荷解き・転入届（14日以内）の提出'
            ],
            color: 'text-green-500 bg-green-50 border-green-200'
        }
    ],
    homePurchase: [
        {
            id: 'home-1',
            name: '資金計画・物件見学',
            icon: Calculator,
            monthsBefore: 12,
            description: '住宅ローンの借入可能額を把握し、モデルルームやオープンハウスの見学を開始します。',
            tasks: [
                '現在の家計からの返済可能額の算出と、自己資金（頭金・諸費用）の準備計画',
                '金融機関やFPに相談し、住宅ローンの事前審査（目安）の確認',
                '希望条件（新築/中古、戸建て/マンション、エリア）の整理と不動産会社への相談',
                '週末を利用したモデルハウス、マンションギャラリー、中古物件の内見',
                '周辺環境（スーパー、学校、治安、ハザードマップ）の徹底的な事前調査'
            ],
            color: 'text-cyan-500 bg-cyan-50 border-cyan-200'
        },
        {
            id: 'home-2',
            name: '物件決定・ローン事前審査',
            icon: Home,
            monthsBefore: 6,
            description: '購入する物件を決定して売買契約を結び、住宅ローンの本審査に向けた準備を進めます。',
            tasks: [
                '希望物件への買付証明書（購入申込書）の提出と、価格・引き渡し条件の交渉',
                '金融機関への住宅ローン事前審査の正式申し込みと承認の獲得',
                '宅地建物取引士からの重要事項説明の受領と内容の熟読・確認',
                '不動産売買契約の締結と、物件価格の5〜10%程度の「手付金」の支払い',
                '中古物件の場合、必要に応じたリフォーム業者の選定とプラン・見積もり作成'
            ],
            color: 'text-sky-500 bg-sky-50 border-sky-200'
        },
        {
            id: 'home-3',
            name: 'ローン本審査・決済・引き渡し',
            icon: CheckCircle2,
            monthsBefore: 1,
            description: 'ローンの本審査を通過させて決済手続きを行い、いよいよマイホームの引き渡しを受けます。',
            tasks: [
                '住宅ローン本審査の申し込みと、金銭消費貸借契約（ローン契約）の締結',
                '火災保険・地震保険のプラン選定と契約手続きの完了',
                '内覧会（新築の場合）での仕上がりチェックと、修繕箇所の指摘・確認',
                '銀行での残代金決済、諸費用支払い、および司法書士による所有権移転登記',
                '新居の鍵の引き渡し受領、引越し手配、および住宅ローン控除のための確定申告準備'
            ],
            color: 'text-blue-500 bg-blue-50 border-blue-200'
        }
    ],
    finance: [
        {
            id: 'finance-1',
            name: '現状把握・目標金額設定',
            icon: Calculator,
            monthsBefore: 12,
            description: '家計の現状を正確に把握し、ライフプランに向けた具体的な資産形成の目標を立てます。',
            tasks: [
                '家計簿アプリ等を活用した、現在の月々の正確な収入・固定費・変動費の把握',
                'すべての銀行口座、クレジットカードの残高、保険、負債の棚卸しと総資産の算出',
                '直近の結婚や住宅購入、将来の老後資金など「いつ・いくら必要か」の目標設定',
                '目標から逆算した、月々の理想的な貯蓄額・投資額（先取り貯蓄）の設定',
                '削れる固定費（格安SIMへの変更、不要なサブスク解約、保険の見直し）のリストアップと実行'
            ],
            color: 'text-amber-500 bg-amber-50 border-amber-200'
        },
        {
            id: 'finance-2',
            name: 'NISA・iDeCo等の口座開設',
            icon: Building2,
            monthsBefore: 6,
            description: '税制優遇制度を活用するため、証券口座の開設と投資信託などの商品選定を行います。',
            tasks: [
                '手数料の安いネット証券（SBI証券、楽天証券など）での総合口座開設申し込み',
                '新NISA口座の開設申請（税務署の審査に数週間かかるため早めに）',
                '企業型DCがない場合、iDeCo（個人型確定拠出年金）の資料請求と加入手続き',
                '自身のリスク許容度に応じた、インデックスファンド等の投資対象銘柄の選定',
                '余剰資金の計算と、生活防衛資金（生活費の半年〜1年分）を銀行預金として確保'
            ],
            color: 'text-orange-500 bg-orange-50 border-orange-200'
        },
        {
            id: 'finance-3',
            name: '積立開始とポートフォリオ管理',
            icon: TrendingUp,
            monthsBefore: 1,
            description: '自動積立の設定を完了させ、長期的な資産運用の自動化と定期確認の準備を整えます。',
            tasks: [
                '証券口座でのクレジットカード積立・銀行引き落としによるNISA自動積立設定',
                'ふるさと納税の年間上限額のシミュレーションと、計画的な寄付の実行',
                'アセットアロケーション（現金・株式・債券の比率）のルール決定',
                '月1回・年1回など、資産状況を定期的にチェックするリバランスのスケジュール設定',
                'マネーフォワードなどの資産管理アプリへの全口座連携と運用開始'
            ],
            color: 'text-yellow-500 bg-yellow-50 border-yellow-200'
        }
    ],
    care: [
        {
            id: 'care-1',
            name: '状況把握・地域包括支援センター相談',
            icon: HelpCircle,
            monthsBefore: 6,
            description: '親族の介護の必要性を感じたら、まずは専門機関への相談と現状の正確な把握を行います。',
            tasks: [
                '対象者（親など）の心身の状態、生活の困りごと、持病のリストアップと正確な把握',
                '対象者の住むエリアを管轄する「地域包括支援センター」の検索と初回相談の予約',
                'かかりつけ医への受診同行と、主治医意見書を作成してもらえるかの事前確認',
                '兄弟・親族間での介護に対する役割分担や、経済的負担に関する初期の話し合い',
                '介護保険の仕組みや利用可能なサービスについての基礎的な情報収集'
            ],
            color: 'text-violet-500 bg-violet-50 border-violet-200'
        },
        {
            id: 'care-2',
            name: '要介護認定申請とケアプラン作成',
            icon: ClipboardList,
            monthsBefore: 3,
            description: '役所での正式な手続きを進め、ケアマネジャーと共に具体的な介護計画を立てます。',
            tasks: [
                '市区町村の介護保険窓口への「要介護認定」の申請手続き（郵送または代行利用可',
                '認定調査員による認定調査への立ち会いと、日頃の困りごとの正確な伝達（メモ準備）',
                '要介護度が判定された後、依頼する居宅介護支援事業所（ケアマネジャー）の選定・契約',
                'ケアマネジャーへの要望出しと、訪問介護やデイサービスを組み込んだケアプランの作成',
                '自身の勤務先における「介護休業」「介護休暇」「時短勤務」の社内制度の確認'
            ],
            color: 'text-fuchsia-500 bg-fuchsia-50 border-fuchsia-200'
        },
        {
            id: 'care-3',
            name: '介護サービス利用開始と環境整備',
            icon: HandHeart,
            monthsBefore: 1,
            description: 'デイサービス等との契約を結び、自宅のバリアフリー改修など安全な環境を整えます。',
            tasks: [
                'ケアプランに基づく、各介護サービス事業者（デイサービス、ヘルパー等）との契約と担当者会議',
                '手すりの設置や段差解消など、住宅改修（介護保険適用）の業者見積もりと施工',
                '介護ベッドや車椅子などの福祉用具のレンタル手続きと納品立ち会い',
                '緊急時の連絡網の作成と、かかりつけ医・ケアマネジャーの連絡先の家族内共有',
                '介護サービスを実際に利用開始し、問題点があればケアマネジャーへ即時フィードバック'
            ],
            color: 'text-purple-500 bg-purple-50 border-purple-200'
        }
    ],
    inheritance: [
        {
            id: 'inherit-1',
            name: '相続発生・遺言書確認と財産調査',
            icon: Search,
            monthsBefore: 10,
            description: '相続が発生した直後から、遺言書の有無の確認とすべての相続財産の全容を調査します。',
            tasks: [
                '【7日以内】役所への死亡届の提出および火葬許可証の取得',
                '故人の遺言書の有無の確認（公正証書遺言の検索や、自筆証書遺言の検認手続き手配）',
                '戸籍謄本の収集に基づく、法定相続人の確定と「法定相続情報一覧図」の作成',
                '預貯金、不動産、有価証券、さらには借金（負債）などプラス・マイナス全ての財産調査',
                '【原則3ヶ月以内】負債が多い場合の相続放棄や限定承認の家庭裁判所への申述判断'
            ],
            color: 'text-stone-500 bg-stone-50 border-stone-200'
        },
        {
            id: 'inherit-2',
            name: '遺産分割協議と準確定申告',
            icon: Handshake,
            monthsBefore: 6,
            description: '相続人全員で財産の分け方を話し合い、法的効力のある協議書を作成します。',
            tasks: [
                '【4ヶ月以内】故人に代わって行う所得税の申告（準確定申告）と納税手続き',
                '相続人全員での遺産分割についての話し合い（遺産分割協議）の実施',
                '不動産の評価額算定や、預金残高証明書の取得による財産目録の詳細な確定',
                '話し合いでまとまった内容に基づく「遺産分割協議書」の作成と、全員の署名・実印押印',
                '全員の印鑑証明書の収集と、トラブル回避のための司法書士・弁護士への確認'
            ],
            color: 'text-slate-500 bg-slate-50 border-slate-200'
        },
        {
            id: 'inherit-3',
            name: '名義変更と相続税申告',
            icon: Building2,
            monthsBefore: 1,
            description: '協議内容に従って各財産の名義を変更し、期限内に相続税の申告と納付を完了させます。',
            tasks: [
                '銀行等の金融機関窓口での、口座解約と相続人への預貯金の払い戻し手続き',
                '法務局における、不動産（土地・建物）の所有権移転登記（相続登記）の申請',
                '証券会社での株式・投資信託等の名義変更、または売却手続き',
                '相続税の基礎控除額（3000万円＋600万円×法定相続人の数）の計算と課税有無の確認',
                '【10ヶ月以内】必要な場合の税務署への相続税申告書の提出および現金での納税完了'
            ],
            color: 'text-neutral-500 bg-neutral-50 border-neutral-200'
        }
    ]
};


export function ReverseScheduler() {
    const [targetDate, setTargetDate] = useState<string>('');
    const [goalName, setGoalName] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const categories = [
        { id: 'marriage', label: '結婚' },
        { id: 'birth', label: '出産' },
        { id: 'divorce', label: '離婚' },
        { id: 'exam', label: '受験' },
        { id: 'job', label: '転職' },
        { id: 'startup', label: '起業' },
        { id: 'moving', label: '引越し' },
        { id: 'homePurchase', label: 'マイホーム買売' },
        { id: 'finance', label: '財務' },
        { id: 'care', label: '介護' },
        { id: 'inheritance', label: '相続' }
    ];

    const scheduleInfo = useMemo(() => {
        if (!targetDate) return null;
        
        const target = parseISO(targetDate);
        const today = new Date();
        const monthsRemaining = differenceInMonths(target, today);
        const daysRemaining = differenceInDays(target, today);

        if (daysRemaining < 0) return { error: '未来の日付を選択してください。' };

        const currentPhases = category ? (categoryPhases[category] || defaultPhases) : defaultPhases;

        // 進行度の判定: 現在の残り月数と比較して、どのフェーズにいるか（最も近い未来のフェーズ）を特定
        let currentPhaseIndex = 0;
        
        // フェーズは monthsBefore が大きい順（遠い順）に並んでいる想定
        for (let i = currentPhases.length - 1; i >= 0; i--) {
             if (monthsRemaining <= currentPhases[i].monthsBefore) {
                 currentPhaseIndex = i;
             } else {
                 break;
             }
        }

        return {
            target,
            monthsRemaining,
            daysRemaining,
            currentPhaseIndex,
            phases: currentPhases
        };
    }, [targetDate, category]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                        目標の逆算プラン
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        受験、資格取得、引越しなど、期限のある目標に向けて「いつ・何をすべきか」をフェーズ別に可視化します。
                    </p>
                </div>
            </div>

            <Card className="border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-amber-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-500" />
                        いつまでに、何を達成したいですか？
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="flex items-center gap-1.5 h-5"><ListFilter className="w-4 h-4 text-amber-500"/>カテゴリ</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-slate-50 border-amber-200 focus:ring-amber-500">
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goalName" className="flex items-center gap-1.5 h-5"><Target className="w-4 h-4 text-amber-500"/>目標・試験名</Label>
                            <Input 
                                id="goalName" 
                                placeholder="例：〇〇大学受験、基本情報技術者" 
                                value={goalName}
                                onChange={(e) => setGoalName(e.target.value)}
                                className="bg-slate-50 focus-visible:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetDate" className="flex items-center gap-1.5 h-5"><Calendar className="w-4 h-4 text-amber-500"/>目標日（本番の日）</Label>
                            <Input 
                                id="targetDate" 
                                type="date" 
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="bg-slate-50 focus-visible:ring-amber-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {scheduleInfo?.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm rounded-xl">
                    {scheduleInfo.error}
                </div>
            )}

            {scheduleInfo && !scheduleInfo.error && (
                <div className="space-y-8 animate-fade-in-up">
                    {/* Countdown Banner */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 rounded-2xl p-8 text-amber-950 text-center shadow-md relative overflow-hidden border border-amber-200/60">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/60 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-white/70 border border-amber-200/50 text-amber-700 rounded-full mb-3 text-sm font-semibold shadow-sm backdrop-blur-sm">
                                {category ? categories.find(c => c.id === category)?.label : 'カテゴリ未選択'}
                            </div>
                            <h3 className="text-amber-800 font-medium mb-2">{goalName || '目標日'}まで</h3>
                            <div className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-black tracking-tight text-amber-900 font-['Montserrat',sans-serif]">
                                {scheduleInfo.monthsRemaining > 0 && (
                                    <>
                                        <span>{scheduleInfo.monthsRemaining}<span className="text-2xl md:text-3xl font-medium ml-1">ヶ月</span></span>
                                        <span className="text-amber-300 font-light">/</span>
                                    </>
                                )}
                                <span>{scheduleInfo.daysRemaining}<span className="text-2xl md:text-3xl font-medium ml-1">日</span></span>
                            </div>
                            <p className="mt-4 text-amber-700 flex items-center justify-center gap-2 font-medium">
                                <Clock className="w-4 h-4" />
                                {format(scheduleInfo.target, 'yyyy年MM月dd日', { locale: ja })}
                            </p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-8 md:pl-0">
                        {/* Vertical line connector */}
                        <div className="absolute left-[39px] md:left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-amber-200 to-rose-200 -translate-x-1/2 md:block rounded-full" />

                        <div className="space-y-12">
                            {scheduleInfo.phases.map((phase, index) => {
                                const isCurrent = scheduleInfo.currentPhaseIndex === index;
                                const isPast = scheduleInfo.currentPhaseIndex > index;
                                const Icon = phase.icon;

                                return (
                                    <div key={phase.id} className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
                                        {/* Timeline Node */}
                                        <div className={cn(
                                            "absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 outline outline-4 outline-white z-10 transition-colors",
                                            isCurrent ? "bg-white border-amber-500" : 
                                            isPast ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200 shadow-sm"
                                        )}>
                                            {isPast ? <CheckCircle2 className="w-5 h-5 text-slate-400" /> : <Icon className={cn("w-5 h-5", isCurrent ? "text-amber-600 -ml-0.5" : "text-slate-400")} />}
                                            
                                            {/* Pulse effect for current phase */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full border-2 border-amber-500 animate-ping opacity-20" />
                                            )}
                                        </div>

                                        {/* Content - Alternating left/right */}
                                        <div className={cn(
                                            "w-full md:w-[calc(50%-48px)]",
                                            index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                                        )}>
                                            <div className={cn(
                                                "p-6 rounded-2xl border transition-all duration-300",
                                                isCurrent ? "bg-white shadow-xl border-amber-200 ring-1 ring-amber-50" : 
                                                isPast ? "bg-slate-50/50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm opacity-80"
                                            )}>
                                                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3", phase.color)}>
                                                    {phase.monthsBefore}ヶ月前〜
                                                </div>
                                                <h4 className={cn("text-lg font-bold mb-2", isCurrent ? "text-slate-800" : "text-slate-600")}>
                                                    {phase.name}
                                                </h4>
                                                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                                    {phase.description}
                                                </p>
                                                
                                                <ul className={cn("space-y-2 text-sm text-left", index % 2 === 0 ? "md:items-end flex flex-col" : "")}>
                                                    {phase.tasks.map((task, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-slate-600">
                                                            <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                            <span>{task}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

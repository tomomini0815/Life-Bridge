import {
  Heart,
  Home,
  Baby,
  GraduationCap,
  Users,
  Stethoscope,
  Briefcase,
  Gift,
  HandCoins,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export interface SupportInfo {
  title: string;
  amount?: string;
  description: string;
}

export interface RoadmapEvent {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  color: string;
  illustrationType: 'marriage' | 'housing' | 'baby' | 'childcare' | 'education' | 'start';
  imageUrl?: string;
  description?: string;
  supports: SupportInfo[];
  badges?: string[];
  isLeft: boolean;
}

export const roadmapData: RoadmapEvent[] = [
  {
    id: 'start',
    title: 'START!!',
    subtitle: 'まずは実家で暮らしつつ、新しい暮らしの体制を整えるぞ〜',
    icon: MapPin,
    imageUrl: '/roadmap/start.png',
    color: 'bg-orange-400',
    illustrationType: 'start',
    supports: [],
    isLeft: true,
  },
  {
    id: 'marriage',
    title: '人脈を広げつつ\n気楽に婚活',
    subtitle: '本気の婚活に参戦！',
    icon: Heart,
    imageUrl: '/roadmap/marriage.png',
    color: 'bg-teal-500',
    illustrationType: 'marriage',
    description: '新しい友人や気になる相手もできた。',
    badges: ['出会い・交流イベント等', '補助金などのバックアップ体制も'],
    supports: [
      {
        title: '半年成婚サポート事業を利用する',
        amount: '20万円を市が負担',
        description: '市が業務委託をした、結婚相談所の専任コンシェルジュと共に6ヶ月以内の成婚を目指すサポート。',
      },
    ],
    isLeft: false,
  },
  {
    id: 'marriage-support',
    title: '新生活バックアップ\n制度も充実',
    icon: Users,
    color: 'bg-orange-500',
    illustrationType: 'marriage',
    supports: [
      {
        title: '結婚新生活支援事業補助金',
        amount: '最大30万円',
        description: '若年の新婚世帯（夫婦共に39歳以下）なら、結婚に伴う新生活スタートアップ費用（住居費用、リフォーム費用、引越費用など）の助成を受けられる。',
      },
    ],
    isLeft: true,
  },
  {
    id: 'housing',
    title: '豊富な物件と支援を利用して、\n夢のマイホーム探し',
    icon: Home,
    imageUrl: '/roadmap/housing.png',
    color: 'bg-teal-600',
    illustrationType: 'housing',
    badges: ['空き家・空き地バンク', '住宅購入等世帯定住促進事業奨励金'],
    supports: [
      {
        title: '空き家バンクの支援',
        amount: '最大345万円',
        description: '空き家バンクの豊富な物件数も魅力。条件を満たした場合、最大345万円の支援。',
      },
      {
        title: 'マイホーム購入支援',
        amount: '最大200万円',
        description: '通常の住宅購入や賃貸でも最大200万円の支援を受けられることも。若者や子育て世帯など対象。',
      },
      {
        title: '県外からの移住なら追加支援',
        amount: '80万円追加',
        description: '移住支援金等で最大80万円の追加サポート。',
      },
    ],
    isLeft: false,
  },
  {
    id: 'baby',
    title: 'やった！赤ちゃん誕生',
    subtitle: '不妊治療の支援が大きく変わる！',
    icon: Baby,
    imageUrl: '/roadmap/baby.png',
    color: 'bg-orange-400',
    illustrationType: 'baby',
    description: '高額な治療も保険適用で負担減',
    supports: [
      {
        title: 'ようこそ赤ちゃん誕生祝い品支給',
        amount: '2万円分クーポン + 地元産米30kg',
        description: 'おむつやミルクに使えるクーポンや、登録店で使える助成券、お米などをもらって体力つけて子育て。',
      },
      {
        title: '第3子出産祝い金',
        amount: '30万円',
        description: '第3子なら出産時に30万円のお祝い金。',
      },
    ],
    isLeft: true,
  },
  {
    id: 'childcare',
    title: 'パパも子育てに\n参加しやすい環境をサポート',
    icon: Briefcase,
    imageUrl: '/roadmap/childcare.png',
    color: 'bg-orange-500',
    illustrationType: 'childcare',
    supports: [
      {
        title: 'はぐパパ応援育休取得促進奨励金',
        amount: '20万円奨励金',
        description: '男性の育休取得者が育休を取得した本人には、1ヶ月以上なら20万円を支給。',
      },
      {
        title: '在宅保育支援金',
        amount: '月1万円',
        description: '3歳未満の在宅保育なら月額1万円を支給。また0〜2歳児は保育料無料化など充実。',
      },
    ],
    isLeft: false,
  },
  {
    id: 'medical-education',
    title: 'すべての子どもが\n医療を受けられるように',
    icon: Stethoscope,
    color: 'bg-teal-500',
    illustrationType: 'education',
    supports: [
      {
        title: '18歳まで子ども医療費助成',
        amount: '負担なし',
        description: '「子ども医療費受給資格証」があれば、保険診療分や入院時の食事代の負担がなしに。',
      },
      {
        title: '小中学校 給食費無償化',
        amount: '約6万円/年が無料',
        description: '2022年度から小中学校の給食費を全額補助。',
      },
    ],
    isLeft: true,
  },
  {
    id: 'education',
    title: '子どもの門出を\n応援する事業を新設',
    icon: GraduationCap,
    imageUrl: '/roadmap/education.png',
    color: 'bg-orange-400',
    illustrationType: 'education',
    description: 'スマートフォンから子育て情報もゲット。母子手帳アプリ「はぐらいふ」',
    supports: [
      {
        title: '巣立ち応援 18歳祝い金支給事業',
        amount: '5万円支給',
        description: '18歳になったときには5万円のお祝い金で巣立ちを応援！',
      },
      {
        title: 'みらい育成修学資金',
        amount: '最大520万円',
        description: '高校生や大学生などに対して貸付可能で、条件を満たせば返済免除も。',
      },
    ],
    isLeft: false,
  },
  {
    id: 'goal',
    title: 'GOAL!!',
    subtitle: '子ども一人あたり900万円以上のサポート！',
    icon: CheckCircle2,
    imageUrl: '/roadmap/goal.png',
    color: 'bg-orange-500',
    illustrationType: 'education',
    description: 'いろいろな選択肢を応援してくれるっていいね！',
    supports: [],
    isLeft: true,
  },
];

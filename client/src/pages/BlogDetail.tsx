import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { Link } from 'wouter';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '양자 에너지가 면역력을 강화하는 과학적 메커니즘',
    excerpt: '최신 연구에 따르면 양자 에너지는 세포 수준에서 면역 체계를 활성화시킵니다.',
    content: `양자 물리학과 생물학의 결합을 통해 우리는 인체의 면역 시스템이 양자 에너지에 어떻게 반응하는지 이해할 수 있습니다. 세포의 미토콘드리아는 양자 터널링 효과를 통해 에너지 생산을 최적화하며, 이는 면역 세포의 활동성을 극대화합니다. 

2024년 국제 학술지에 발표된 연구에 따르면, 양자요법을 받은 그룹은 대조군 대비 NK세포 활성도가 45% 증가했습니다.

양자 에너지의 작용 메커니즘:

1. 세포 에너지 증가: 미토콘드리아의 ATP 생성 촉진
2. 신경계 활성화: 부교감신경 우위 상태 유지
3. 면역세포 분화: T세포, B세포, NK세포의 활성화
4. 염증 반응 조절: 사이토카인 균형 유지

특히 만성 질환으로 인한 면역 저하 상태에서 양자요법의 효과가 두드러집니다. 정기적인 양자요법 시술을 통해 면역력을 지속적으로 강화할 수 있습니다.`,
    author: '박준호 협회장',
    date: '2024-03-15',
    category: '연구',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_1_opening-C2BBqsUQXWUy4We9jL95Fx.webp',
    readTime: 8,
  },
  {
    id: 2,
    title: '회원 성공 사례: 60대 만성 통증 완화 사례',
    excerpt: '20년간의 만성 요통이 3개월의 양자요법으로 완화된 사례입니다.',
    content: `김영희 회원(62세)은 20년간 심한 요통으로 고생해왔습니다. 여러 병원과 한의원을 다녔지만 근본적인 해결이 되지 않았습니다. 양자요법 관리사의 체계적인 치료를 받은 지 3개월 만에 통증이 70% 감소했고, 현재는 일상생활에 큰 지장이 없습니다. "양자요법이 제 인생을 바꿨습니다"라고 말하는 김 회원의 이야기입니다.

치료 과정:

1개월차: 주 2회 시술, 통증 30% 감소
2개월차: 주 1회 시술, 통증 50% 감소, 수면 개선
3개월차: 월 2회 유지 시술, 통증 70% 감소, 일상 활동 복귀

김 회원은 현재 협회의 자원봉사자로 활동하고 있으며, 같은 증상으로 고통받는 사람들에게 양자요법을 추천하고 있습니다. 이는 양자요법의 효과를 증명하는 좋은 사례입니다.`,
    author: '이미영 부협회장',
    date: '2024-03-10',
    category: '성공사례',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_2_foundation-HVnTazWRWkLC2xt8ek98XP.webp',
    readTime: 6,
  },
  {
    id: 3,
    title: '2024년 상반기 협회 활동 보고',
    excerpt: '신규 회원 500명 모집, 국제 학술 발표 3건 등 다양한 성과를 이루었습니다.',
    content: `2024년 상반기 협회는 괄목할 만한 성장을 이루었습니다. 신규 회원 500명을 모집하여 총 회원수가 3,500명을 넘었으며, 국제 학술 발표 3건, 국내 학술 발표 12건을 통해 양자요법의 과학적 근거를 계속 입증하고 있습니다. 또한 5개 지역에 새로운 교육 센터를 개설하여 접근성을 높였습니다.

주요 성과:

학술 활동:
- 국제 학술 발표: 3건 (미국, 일본, 싱가포르)
- 국내 학술 발표: 12건
- 학술지 게재: 5편

회원 확대:
- 신규 회원: 500명
- 총 회원수: 3,500명
- 인증 관리사: 450명

교육 센터 확대:
- 서울, 부산, 대구, 인천, 광주 5개 지역 개설
- 월간 교육 프로그램: 30회 이상

이러한 성과는 모든 협회 임직원과 회원들의 노고 덕분입니다. 하반기에는 더욱 더 양자요법의 과학화와 대중화를 위해 노력하겠습니다.`,
    author: '김성철 교육이사',
    date: '2024-03-05',
    category: '협회소식',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_3_benefits-ZSAKA7TF36HAYNGuycY3na.webp',
    readTime: 5,
  },
  {
    id: 4,
    title: '혈액순환 개선을 위한 양자요법 실전 가이드',
    excerpt: '혈액순환 문제로 고민하는 분들을 위한 양자요법 적용 방법을 소개합니다.',
    content: `혈액순환이 원활하지 않으면 신체의 모든 세포에 산소와 영양분이 제대로 전달되지 않습니다. 양자요법은 혈관의 내피세포에 양자 에너지를 전달하여 혈관 확장을 촉진하고, 혈액 점도를 개선합니다. 특히 말초 혈액순환 개선에 효과적이며, 손발이 차가운 증상, 저림 증상 등이 개선됩니다.

혈액순환 개선 메커니즘:

1. 혈관 확장: 내피세포의 NO(산화질소) 분비 증가
2. 혈액 점도 감소: 적혈구 변형성 개선
3. 혈류 속도 증가: 미세순환 활성화
4. 혈관 신생: 새로운 모세혈관 형성

양자요법 적용 부위:
- 경추 부위: 뇌 혈류 개선
- 흉추 부위: 심폐 기능 개선
- 요추 부위: 하지 혈류 개선
- 말초 부위: 손발 저림 개선

정기적인 양자요법으로 혈액순환을 개선하면 피로 회복, 피부 개선, 면역력 강화 등 다양한 건강 효과를 얻을 수 있습니다.`,
    author: '최혜진 연구이사',
    date: '2024-02-28',
    category: '교육',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_4_vision-4PsYQAC52drY9mWjz5whud.webp',
    readTime: 7,
  },
  {
    id: 5,
    title: '스트레스 해소와 명상: 양자요법의 심신 통합 치료',
    excerpt: '현대인의 스트레스를 양자요법으로 근본적으로 해결하는 방법입니다.',
    content: `스트레스는 현대 질병의 주요 원인입니다. 양자요법은 뇌의 신경전달물질 균형을 회복시켜 스트레스 반응을 감소시킵니다. 특히 코르티솔 수치를 낮추고 세로토닌 분비를 증가시켜 자연스러운 이완 상태를 유도합니다. 명상과 함께 양자요법을 받으면 더욱 효과적입니다.

스트레스 완화 메커니즘:

신경계 조절:
- 교감신경 억제
- 부교감신경 활성화
- HPA축(시상하부-뇌하수체-부신축) 정상화

신경전달물질 균형:
- 코르티솔 감소 (스트레스 호르몬)
- 세로토닌 증가 (행복 호르몬)
- 도파민 증가 (동기 호르몬)
- GABA 증가 (진정 신경전달물질)

양자요법 + 명상의 시너지:
- 뇌파 정상화 (알파파 증가)
- 명상 깊이 증가
- 스트레스 회복력 강화
- 수면의 질 개선

정기적인 양자요법과 명상을 통해 스트레스로부터 자유로워질 수 있습니다.`,
    author: '박준호 협회장',
    date: '2024-02-20',
    category: '연구',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_5_closing-fLwnBS4kGVWgd23SCmQ95X.webp',
    readTime: 9,
  },
  {
    id: 6,
    title: '피부 건강 개선: 양자 에너지의 미용 효과',
    excerpt: '노화된 피부를 되살리는 양자요법의 미용 응용 사례입니다.',
    content: `피부는 신체 건강의 거울입니다. 양자 에너지는 피부 세포의 콜라겐 생성을 촉진하고, 피부 탄력성을 회복시킵니다. 주름 개선, 피부톤 균일화, 여드름 완화 등 다양한 미용 효과가 보고되고 있습니다. 50대 이상의 회원들이 특히 만족하는 치료 항목입니다.

피부 개선 메커니즘:

콜라겐 생성 촉진:
- 섬유아세포 활성화
- 콜라겐 합성 증가
- 피부 탄력성 회복

피부 재생 촉진:
- 표피 세포 재생 가속화
- 피부 턴오버 정상화
- 피부 톤 균일화

항산화 작용:
- 활성산소 제거
- 세포 손상 방지
- 노화 진행 지연

미용 효과:
- 주름 개선: 특히 눈가, 이마 주름
- 피부톤 개선: 칙칙한 피부 밝아짐
- 여드름 완화: 염증 감소
- 피부 탄력: 처진 피부 개선

양자요법은 피부 건강을 위한 자연스럽고 안전한 솔루션입니다.`,
    author: '이미영 부협회장',
    date: '2024-02-15',
    category: '성공사례',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_1_opening-C2BBqsUQXWUy4We9jL95Fx.webp',
    readTime: 6,
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case '연구':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case '성공사례':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case '협회소식':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case '교육':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    default:
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  }
};

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === parseInt(id || '0'));

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">게시물을 찾을 수 없습니다</h1>
          <Link href="/newsletter-blog">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              뉴스레터로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/newsletter-blog">
          <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            뉴스레터로 돌아가기
          </Button>
        </Link>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-4">{post.title}</h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              읽는 시간 {post.readTime}분
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed space-y-4">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 pt-8 border-t border-slate-700">
          <h2 className="text-2xl font-bold text-yellow-400 mb-8">관련 기사</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map(relatedPost => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <div className="bg-slate-800 border border-yellow-400/20 rounded-lg overflow-hidden hover:border-yellow-400/40 transition-all cursor-pointer">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-yellow-400 font-semibold line-clamp-2">{relatedPost.title}</h3>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

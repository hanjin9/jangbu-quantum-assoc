import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
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
    content: '양자 물리학과 생물학의 결합을 통해 우리는 인체의 면역 시스템이 양자 에너지에 어떻게 반응하는지 이해할 수 있습니다. 세포의 미토콘드리아는 양자 터널링 효과를 통해 에너지 생산을 최적화하며, 이는 면역 세포의 활동성을 극대화합니다. 2024년 국제 학술지에 발표된 연구에 따르면, 양자요법을 받은 그룹은 대조군 대비 NK세포 활성도가 45% 증가했습니다.',
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
    content: '김영희 회원(62세)은 20년간 심한 요통으로 고생해왔습니다. 여러 병원과 한의원을 다녔지만 근본적인 해결이 되지 않았습니다. 양자요법 관리사의 체계적인 치료를 받은 지 3개월 만에 통증이 70% 감소했고, 현재는 일상생활에 큰 지장이 없습니다. \"양자요법이 제 인생을 바꿨습니다\"라고 말하는 김 회원의 이야기입니다.',
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
    content: '2024년 상반기 협회는 괄목할 만한 성장을 이루었습니다. 신규 회원 500명을 모집하여 총 회원수가 3,500명을 넘었으며, 국제 학술 발표 3건, 국내 학술 발표 12건을 통해 양자요법의 과학적 근거를 계속 입증하고 있습니다. 또한 5개 지역에 새로운 교육 센터를 개설하여 접근성을 높였습니다.',
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
    content: '혈액순환이 원활하지 않으면 신체의 모든 세포에 산소와 영양분이 제대로 전달되지 않습니다. 양자요법은 혈관의 내피세포에 양자 에너지를 전달하여 혈관 확장을 촉진하고, 혈액 점도를 개선합니다. 특히 말초 혈액순환 개선에 효과적이며, 손발이 차가운 증상, 저림 증상 등이 개선됩니다.',
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
    content: '스트레스는 현대 질병의 주요 원인입니다. 양자요법은 뇌의 신경전달물질 균형을 회복시켜 스트레스 반응을 감소시킵니다. 특히 코르티솔 수치를 낮추고 세로토닌 분비를 증가시켜 자연스러운 이완 상태를 유도합니다. 명상과 함께 양자요법을 받으면 더욱 효과적입니다.',
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
    content: '피부는 신체 건강의 거울입니다. 양자 에너지는 피부 세포의 콜라겐 생성을 촉진하고, 피부 탄력성을 회복시킵니다. 주름 개선, 피부톤 균일화, 여드름 완화 등 다양한 미용 효과가 보고되고 있습니다. 50대 이상의 회원들이 특히 만족하는 치료 항목입니다.',
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

export default function NewsletterBlog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            뉴스레터 & 블로그
          </h1>
          <p className="text-lg text-gray-300">
            양자요법 최신 연구, 회원 활동, 성공 사례를 정기적으로 업데이트합니다
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="bg-slate-800 border-yellow-400/20 overflow-hidden hover:border-yellow-400/40 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video md:aspect-auto overflow-hidden bg-slate-700">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className={getCategoryColor(blogPosts[0].category)}>
                      {blogPosts[0].category}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-3">{blogPosts[0].title}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{blogPosts[0].excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <span>{blogPosts[0].readTime}분</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="bg-slate-800 border-yellow-400/20 overflow-hidden hover:border-yellow-400/40 transition-all flex flex-col">
              <div className="aspect-video overflow-hidden bg-slate-700">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-yellow-400 line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="text-gray-400 line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <p className="text-sm text-gray-400 line-clamp-3">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <Link href={`/blog/${post.id}`}>
                  <Button variant="ghost" className="w-full text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10">
                    자세히 읽기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

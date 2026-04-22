import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useLocation } from "wouter";

const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (path: string) => setLocation(path);
};

export default function About() {
  const navigate = useNavigate() as (path: string) => void;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            장•부 양자요법 관리사 협회
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            양자 에너지로 건강한 미래를 만드는 전문가 집단
          </p>
        </div>
      </section>

      {/* 협회 소개 영상 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-yellow-400 text-center">협회 소개 영상</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-yellow-400/20 mb-12">
            <video
              width="100%"
              height="100%"
              controls
              className="w-full h-full"
              poster="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_1_opening-C2BBqsUQXWUy4We9jL95Fx.webp"
            >
              <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663351563633/EoMpLezanDhEiQXx.mp4" type="video/mp4" />
              브라우저가 HTML5 비디오를 지원하지 않습니다.
            </video>
          </div>
        </div>
      </section>

      {/* 협회 소개 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-yellow-400">협회 소개</h2>
          <div className="space-y-8 text-gray-200">
            <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">설립 배경</h3>
              <p className="text-lg leading-relaxed">
                장•부 양자요법 관리사 협회는 현대 의학과 양자 물리학을 결합한 혁신적인 건강 관리 방법을 보급하기 위해 설립되었습니다. 
                양자요법은 인체의 세포 단위에서 에너지 균형을 회복시켜 자연 치유력을 극대화하는 과학적 접근법입니다. 
                IBM의 16큐비트 양자 프로세서를 활용한 신약 개발 사례에서 보듯이, 양자 기술은 의료 혁신의 핵심입니다. 
                우리 협회는 이러한 양자 에너지 치료법의 전문성을 확보하고, 체계적인 교육과 자격 관리를 통해 국민 건강 증진에 기여합니다.
              </p>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">양자요법의 과학적 근거</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-yellow-300">세포 에너지 활성화:</strong> 양자 에너지는 인체의 세포 기능과 면역력을 강화하며, 
                  세포 하나하나가 활성화되어 건강해집니다.
                </p>
                <p>
                  <strong className="text-yellow-300">혈액순환 촉진:</strong> 원적외선과 인체 세포 간의 공명 현상을 통해 혈액순환을 개선하고 
                  체온을 올려 면역력을 증강합니다.
                </p>
                <p>
                  <strong className="text-yellow-300">자율신경 조절:</strong> 432Hz 자연 주파수와 영점장(Zero Point Field) 공명을 통해 
                  심층 이완과 자율신경 회복을 돕습니다.
                </p>
                <p>
                  <strong className="text-yellow-300">만성질환 개선:</strong> 암의 예방과 완화, 만성 통증과 만성 염증 해소, 
                  냉기 제거 등 다양한 건강 문제 해결에 효과적입니다.
                </p>
              </div>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">협회의 비전</h3>
              <p className="text-lg leading-relaxed">
                우리의 비전은 <span className="text-yellow-300 font-semibold">"양자 에너지로 모든 사람이 건강하고 행복한 삶을 누리는 세상"</span>입니다. 
                양자요법을 통해 개인의 신체적, 정신적, 영적 건강을 통합적으로 관리하고, 
                이를 바탕으로 사회 전체의 건강 수준을 향상시키는 것을 목표로 합니다.
              </p>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">협회 정관 및 운영 방침</h3>
              <p className="text-gray-300 mb-6">
                협회의 투명한 운영과 체계적인 관리를 위해 다음의 공식 문서를 제공합니다.
              </p>
              <div className="space-y-3">
                <a
                  href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/_____________________________e6253234.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition border border-yellow-400/30 hover:border-yellow-400"
                >
                  <span className="text-yellow-400 text-2xl">📋</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">협회 정관 (안)</p>
                    <p className="text-sm text-gray-400">협회의 설립 목적, 조직 구조, 회원 자격 및 의무 등을 규정</p>
                  </div>
                  <Download className="w-5 h-5 text-yellow-400" />
                </a>
              </div>
            </div>

            <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">협회의 미션</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">전문가 양성:</strong> 3급부터 1급까지 체계적인 교육과정을 통해 양자요법 전문가를 양성하고 국제 수준의 자격 관리</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">기술 개발:</strong> 양자요법의 과학적 근거를 강화하고 5G 테라헤르츠 양자 에너지 기술 등 새로운 치료법 연구 및 개발</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">국민 건강 증진:</strong> 양자요법을 통해 만성질환 예방, 면역력 강화, 삶의 질 향상에 기여</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">국제 협력:</strong> 세계 각국의 양자요법 전문가와 협력하여 글로벌 표준 수립 및 정보 교류</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-400">전문가와 함께 시작하세요</h2>
          <p className="text-xl text-gray-300 mb-8">
            양자요법의 전문가가 되기 위한 첫 걸음을 내딛으세요
          </p>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
            onClick={() => navigate('/academy')}
          >
            교육 과정 보기
          </Button>
        </div>
      </section>
    </div>
  );
}

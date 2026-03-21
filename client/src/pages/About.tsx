import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (path: string) => setLocation(path);
};

export default function About() {
  const { t } = useTranslation();
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
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">협회의 미션</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">전문가 양성:</strong> 6개월 이상의 체계적인 교육과정을 통해 양자요법 전문가를 양성하고 국제 수준의 자격 관리</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">기술 개발:</strong> 양자요법의 과학적 근거를 강화하고 5G 테라헤르츠 양자 에너지 기술 등 새로운 치료법 연구 및 개발</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">사회 기여:</strong> 지역사회 건강 증진 프로그램 운영 및 취약계층 지원</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-4 font-bold">•</span>
                  <span><strong className="text-yellow-300">국제 협력:</strong> 국내외 의료 전문가와의 협력을 통해 양자요법의 국제화 추진</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-yellow-400 text-center">핵심 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-400/10 to-transparent p-8 rounded-lg border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">신뢰성</h3>
              <p className="text-gray-300">양자 물리학과 현대 의학에 기반한 과학적 근거로 신뢰할 수 있는 건강 관리 서비스 제공</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400/10 to-transparent p-8 rounded-lg border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">전문성</h3>
              <p className="text-gray-300">국제 수준의 체계적인 교육과정과 자격 관리를 통한 전문가 집단의 형성</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400/10 to-transparent p-8 rounded-lg border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">혁신</h3>
              <p className="text-gray-300">5G 테라헤르츠 기술, 양자 색채 요법 등 지속적인 연구와 개발을 통한 혁신</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400/10 to-transparent p-8 rounded-lg border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">인도주의</h3>
              <p className="text-gray-300">모든 사람의 건강한 삶을 위해 헌신하는 인도주의적 정신</p>
            </div>
          </div>
        </div>
      </section>

      {/* 양자요법의 효과 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-yellow-400">양자요법의 주요 효과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 면역력 강화</h3>
              <p className="text-gray-300">체온 상승을 통한 면역 기능 증강 및 감기 빈도 70% 감소</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 통증 완화</h3>
              <p className="text-gray-300">만성 요통, 어깨 통증 등 85% 이상 통증 감소</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 피로 회복</h3>
              <p className="text-gray-300">만성 피로 극복 및 에너지 수준 90% 회복</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 스트레스 해소</h3>
              <p className="text-gray-300">스트레스 80% 감소 및 정서 안정화</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 혈액순환 개선</h3>
              <p className="text-gray-300">혈류량 증가 및 신진대사 활성화</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg border border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">✓ 피부 건강</h3>
              <p className="text-gray-300">피부 톤 개선, 트러블 감소, 탄력 증가</p>
            </div>
          </div>
        </div>
      </section>

      {/* 조직 구조 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-yellow-400">조직 구조</h2>
          <div className="bg-slate-700 p-8 rounded-lg border border-yellow-400/20">
            <div className="space-y-6 text-gray-200">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">회장실</h3>
                <p className="text-gray-300">협회의 전략 수립 및 대외 활동 총괄</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">교육 위원회</h3>
                <p className="text-gray-300">6개월 이상의 양자요법 교육과정 개발 및 운영, 국제 수준의 자격 관리</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">연구 개발 위원회</h3>
                <p className="text-gray-300">양자 색채 요법, 5G 테라헤르츠 기술 등 신규 치료법 개발</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">윤리 및 규정 위원회</h3>
                <p className="text-gray-300">회원 윤리 기준 관리 및 분쟁 조정</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">사회 공헌 위원회</h3>
                <p className="text-gray-300">지역사회 건강 증진 프로그램 운영 및 취약계층 지원</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-yellow-400">협회에 가입하세요</h2>
          <p className="text-lg text-gray-300 mb-12">
            양자요법 전문가로서의 경력을 시작하고, 전문 커뮤니티에 참여하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/academy")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg rounded-lg"
            >
              교육 프로그램 보기
            </Button>
            <Button
              onClick={() => navigate("/checkout")}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-3 text-lg rounded-lg border border-yellow-400"
            >
              멤버십 가입하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

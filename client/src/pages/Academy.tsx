
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { Download, CheckCircle, Clock } from 'lucide-react';


export default function Academy() {
  const [, navigate] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [completedCourses, setCompletedCourses] = useState<number[]>([1, 2]);
  const [courseProgress, setCourseProgress] = useState<Record<number, number>>({
    1: 100, 2: 100, 3: 65, 4: 40, 5: 20, 6: 0
  });

  const courses = [
    {
      id: 1,
      title: '양자요법 기초',
      description: '양자에너지 치유의 기본 원리를 배웁니다.',
      materials: [
        { title: '양자에너지의 정의', content: '양자에너지는 우주의 기본 에너지 단위입니다. 모든 생명체는 양자 에너지장으로 이루어져 있습니다.' },
        { title: '인체와 에너지 필드', content: '인체는 7개의 주요 에너지 센터(차크라)를 가지고 있으며, 이들의 균형이 건강을 결정합니다.' },
        { title: '기본 치료 기법', content: '손을 이용한 에너지 전달, 호흡 기법, 명상을 통한 에너지 조화' },
      ],
      exam: [
        { id: 1, question: '양자에너지 치유의 핵심 원리는?', options: ['에너지 진동', '물리적 접촉', '약물 투여', '수술'], correct: 0 },
        { id: 2, question: '인체의 주요 에너지 센터는?', options: ['7개', '5개', '9개', '12개'], correct: 0 },
        { id: 3, question: '기본 치료 기법의 첫 단계는?', options: ['에너지 감지', '약 처방', '수술 준비', '검사'], correct: 0 },
      ],
      passingScore: 60,
      certificateId: 'CERT-001-2026',
    },
    {
      id: 2,
      title: '에너지 진단법',
      description: '환자의 에너지 상태를 진단하는 방법을 학습합니다.',
      materials: [
        { title: '에너지 감지 기술', content: '손과 직관을 통한 에너지 감지, 오라 읽기, 에너지 블록 식별' },
        { title: '진단 도구 사용법', content: '펜듈럼, 크리스탈, 에너지 측정 기기 사용 방법' },
        { title: '환자 상담 기법', content: '공감적 경청, 에너지 상태 설명, 치료 계획 수립' },
      ],
      exam: [
        { id: 1, question: '에너지 감지의 첫 단계는?', options: ['손을 이용한 감지', '약물 검사', '혈액 검사', '뇌파 측정'], correct: 0 },
        { id: 2, question: '펜듈럼의 주요 용도는?', options: ['에너지 확인', '약 복용', '수술', '운동'], correct: 0 },
        { id: 3, question: '환자 상담 시 가장 중요한 것은?', options: ['공감', '명령', '판단', '무시'], correct: 0 },
      ],
      passingScore: 60,
      certificateId: 'CERT-002-2026',
    },
    {
      id: 3,
      title: '치료 기법 심화',
      description: '고급 양자 치료 기법을 배웁니다.',
      materials: [
        { title: '심화 치료 기법', content: '다층 에너지 치유, 원거리 치료, 집단 치료' },
        { title: '특수 질환 대응', content: '만성질환, 정신 질환, 트라우마 치료 방법' },
        { title: '안전 프로토콜', content: '에너지 보호, 에너지 흡수 방지, 치료자 자기 관리' },
      ],
      exam: [
        { id: 1, question: '심화 치료 기법의 특징은?', options: ['다층 에너지 활용', '약물 사용', '수술', '물리 치료'], correct: 0 },
        { id: 2, question: '원거리 치료의 원리는?', options: ['에너지 공명', '전화 통화', '편지', '약물'], correct: 0 },
        { id: 3, question: '치료자 자기 관리의 목적은?', options: ['에너지 흡수 방지', '돈 버는 것', '유명해지기', '권력'], correct: 0 },
      ],
      passingScore: 70,
      certificateId: 'CERT-003-2026',
    },
    {
      id: 4,
      title: '윤리 및 전문성',
      description: '전문 관리사로서의 윤리와 책임을 배웁니다.',
      materials: [
        { title: '전문가 윤리', content: '환자 기밀 보호, 이해 충돌 관리, 전문성 유지' },
        { title: '법적 책임', content: '의료법 준수, 보험 가입, 계약서 작성' },
        { title: '지속적 학습', content: '최신 기법 습득, 동료 학습, 자격 유지' },
      ],
      exam: [
        { id: 1, question: '환자 기밀 보호의 중요성은?', options: ['신뢰 구축', '돈 벌기', '권력', '유명해지기'], correct: 0 },
        { id: 2, question: '이해 충돌 상황의 대처는?', options: ['투명하게 공개', '숨김', '무시', '거짓말'], correct: 0 },
        { id: 3, question: '전문성 유지의 방법은?', options: ['지속적 학습', '게으름', '자만', '고립'], correct: 0 },
      ],
      passingScore: 65,
      certificateId: 'CERT-004-2026',
    },
    {
      id: 5,
      title: '임상 실습',
      description: '실제 환자와의 임상 경험을 쌓습니다.',
      materials: [
        { title: '임상 관찰', content: '경험 많은 관리사 옆에서 실제 치료 과정 관찰' },
        { title: '지도 치료', content: '감독 하에 환자 치료 수행, 피드백 받기' },
        { title: '임상 기록', content: '환자 사례 기록, 치료 결과 분석, 개선 방안 도출' },
      ],
      exam: [
        { id: 1, question: '임상 관찰의 목적은?', options: ['실제 경험 습득', '시간 낭비', '휴식', '놀기'], correct: 0 },
        { id: 2, question: '지도 치료 중 가장 중요한 것은?', options: ['피드백 수용', '무시', '반항', '도망'], correct: 0 },
        { id: 3, question: '임상 기록의 용도는?', options: ['개선 방안 도출', '버리기', '숨기기', '팔기'], correct: 0 },
      ],
      passingScore: 75,
      certificateId: 'CERT-005-2026',
    },
    {
      id: 6,
      title: '자격증 종합 시험',
      description: '모든 과정을 통합한 최종 시험입니다.',
      materials: [
        { title: '통합 이론', content: '모든 과정의 핵심 이론 통합' },
        { title: '실무 능력', content: '실제 상황에서의 문제 해결 능력' },
        { title: '윤리 및 책임', content: '전문가로서의 윤리적 판단' },
      ],
      examMaterials: [
        { title: 'A형 예상 문제 (쉬움)', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/A형_쉬움_예상문제_0df2fed7.pdf' },
        { title: 'B형 예상 문제 (중간)', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/B형_중간_예상문제_3fae6afc.pdf' },
        { title: 'C형 예상 문제 (어려움)', url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/C형_어려움_예상문제_c5eb3a43.pdf' },
      ],
      exam: [
        { id: 1, question: '양자요법의 궁극적 목표는?', options: ['환자 건강 회복', '돈 버는 것', '유명해지기', '권력'], correct: 0 },
        { id: 2, question: '전문 관리사의 책임은?', options: ['환자 안전과 신뢰', '자신의 이익', '경쟁', '비난'], correct: 0 },
        { id: 3, question: '지속적 발전의 방법은?', options: ['학습과 성찰', '자만', '고립', '포기'], correct: 0 },
      ],
      passingScore: 80,
      certificateId: 'CERT-MASTER-2026',
    },
  ];

  const handleSubmitTest = () => {
    if (!selectedCourse) return;
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return;

    let correctCount = 0;
    course.exam.forEach(q => {
      if (userAnswers[q.id] === String(q.correct)) correctCount++;
    });
    const calculatedScore = Math.round((correctCount / course.exam.length) * 100);
    setScore(calculatedScore);
    setTestSubmitted(true);

    if (calculatedScore >= course.passingScore) {
      setCompletedCourses([...completedCourses, selectedCourse]);
    }
  };

  const downloadCertificate = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    alert(`수료증 다운로드: ${course.title}\n인증번호: ${course.certificateId}\n발급일: 2026-03-19`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">양자요법 교육 과정</h1>
        <p className="text-gray-300 mb-12">전문 양자요법 관리사 자격증 취득 과정</p>

        {/* 공식 교재 섹션 */}
        <div className="mb-16 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 p-8 rounded-lg border border-amber-500/30">
          <h2 className="text-3xl font-bold text-amber-400 mb-8 flex items-center gap-3">
            <span>📚</span> 공식 교재 및 자료
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3급 교재 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">📚</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">3급 교재</h3>
                  <p className="text-sm text-gray-400">장•부 양자요법 관리사 3급 과정</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                장•부 양자요법의 기초 이론부터 실기 기법까지 포함된 종합 교재입니다. 3급 수준의 모든 내용을 다룹니다.
              </p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/grade3_jangbu_d5015981.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold"
              >
                <Download className="w-4 h-4" />
                다운로드
              </a>
            </div>

            {/* 2급 교재 - 장•부 양자요법 관리사 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">📖</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">2급 교재</h3>
                  <p className="text-sm text-gray-400">장•부 양자요법 관리사 2급 과정 (실무실기 중심)</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                장•부 양자요법의 실무 중심 실기 교재로, 2급 수준의 실제 업무 능력을 갖추기 위한 필수 자료입니다.
              </p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/_____________2__________________________6d7d9024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold"
              >
                <Download className="w-4 h-4" />
                다운로드
              </a>
            </div>
          </div>
        </div>

        {/* 과목별 문제집 섹션 */}
        <div className="mb-16 bg-gradient-to-r from-slate-900/30 to-slate-800/30 p-8 rounded-lg border border-amber-500/20">
          <h2 className="text-3xl font-bold text-amber-400 mb-8 flex items-center gap-3">
            <span>✏️</span> 과목별 문제집
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 기초 이론 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🎓</span>
                <h3 className="text-lg font-bold text-white">기초 이론</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">양자요법의 기본 원리와 기초 개념을 학습합니다.</p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/기초_이론_고품질문제집_ab6820bd.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                문제집 다운로드
              </a>
            </div>

            {/* 에너지 관리 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-white">에너지 관리</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">에너지 흐름 최적화와 균형 유지 방법을 배웁니다.</p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/에너지_관리_고품질문제집_0cc37cab.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                문제집 다운로드
              </a>
            </div>

            {/* 실기 기법 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🙌</span>
                <h3 className="text-lg font-bold text-white">실기 기법</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">실제 시술 기법과 안전한 수행 방법을 습득합니다.</p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/실기_기법_고품질문제집_0ff2c02c.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                문제집 다운로드
              </a>
            </div>

            {/* 안전 관리 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🛡️</span>
                <h3 className="text-lg font-bold text-white">안전 관리</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">클라이언트 안전과 응급 상황 대응을 학습합니다.</p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/안전_관리_고품질문제집_e62bc7e6.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                문제집 다운로드
              </a>
            </div>

            {/* 윤리 및 법규 */}
            <div className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">⚖️</span>
                <h3 className="text-lg font-bold text-white">윤리 및 법규</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">전문가 윤리와 관련 법규를 이해합니다.</p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/윤리_법규_고품질문제집_66641d37.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                문제집 다운로드
              </a>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-amber-400 font-bold mb-2">완료한 과정</h3>
            <p className="text-3xl font-bold text-white">{completedCourses.length}/6</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-amber-400 font-bold mb-2">평균 진도율</h3>
            <p className="text-3xl font-bold text-white">{Math.round(Object.values(courseProgress).reduce((a, b) => a + b) / 6)}%</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-amber-500/20">
            <h3 className="text-amber-400 font-bold mb-2">자격증 상태</h3>
            <p className="text-3xl font-bold text-white">{completedCourses.length === 6 ? '완료' : '진행중'}</p>
          </div>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-slate-800/50 rounded-lg border border-amber-500/20 overflow-hidden hover:border-amber-500 transition">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-300 text-sm">{course.description}</p>
                  </div>
                  {completedCourses.includes(course.id) && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">진도율</span>
                    <span className="text-amber-400">{courseProgress[course.id]}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${courseProgress[course.id]}%` }}
                    ></div>
                  </div>
                </div>

                {/* Materials */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">학습 자료:</p>
                  <ul className="space-y-1">
                    {course.materials.map((material, i) => (
                      <li key={i} className="text-sm text-gray-300">• {material.title}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                  >
                    {selectedCourse === course.id ? '시험 닫기' : '시험 응시'}
                  </Button>
                  {completedCourses.includes(course.id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-500 text-amber-400"
                      onClick={() => downloadCertificate(course.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Exam Materials for Certificate Test */}
              {selectedCourse === course.id && course.id === 6 && 'examMaterials' in course && (
                <div className="bg-slate-900/50 p-6 border-t border-amber-500/20">
                  <h4 className="text-lg font-bold text-white mb-4">📝 예상 문제</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {(course as any).examMaterials.map((material: any, idx: number) => (
                      <a
                        key={idx}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-slate-800 border border-amber-500/30 rounded-lg hover:border-amber-500 transition flex items-center gap-3"
                      >
                        <Download className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-white font-semibold text-sm">{material.title}</p>
                          <p className="text-gray-400 text-xs">25문제</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Section for other courses */}
              {selectedCourse === course.id && course.id !== 6 && (
                <div className="bg-slate-900/50 p-6 border-t border-amber-500/20">
                  <h4 className="text-lg font-bold text-white mb-4">실기 시험</h4>
                  {course.exam.map(question => (
                    <div key={question.id} className="mb-6">
                      <p className="text-white font-semibold mb-3">{question.id}. {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`q${question.id}`}
                              value={idx}
                              checked={userAnswers[question.id] === String(idx)}
                              onChange={(e) => setUserAnswers({ ...userAnswers, [question.id]: e.target.value })}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmitTest}
                  >
                    시험 제출
                  </Button>
                  {testSubmitted && score !== null && (
                    <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                      <p className="text-white font-bold mb-2">시험 결과: {score}점</p>
                      {score >= course.passingScore ? (
                        <p className="text-green-400">✓ 합격! 수료증을 다운로드할 수 있습니다.</p>
                      ) : (
                        <p className="text-red-400">✗ 불합격. 다시 시도해주세요. (합격선: {course.passingScore}점)</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Download, CheckCircle, Clock, BookOpen, FileText } from 'lucide-react';

interface TextbookMaterial {
  id: string;
  title: string;
  grade: string;
  url: string;
  description: string;
}

interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  materials: Array<{ title: string; content: string }>;
  exam: ExamQuestion[];
  passingScore: number;
  certificateId: string;
}

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
  const [showTextbookViewer, setShowTextbookViewer] = useState(false);
  const [selectedTextbook, setSelectedTextbook] = useState<TextbookMaterial | null>(null);

  const courses: Course[] = [
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
      title: '마스터 과정',
      description: '전문 양자요법 관리사로서의 최종 단계입니다.',
      materials: [
        { title: '고급 진단', content: '복합 증상 분석, 에너지 패턴 인식, 맞춤 치료 계획' },
        { title: '리더십과 멘토링', content: '팀 관리, 신입 교육, 전문 관리사 양성' },
        { title: '사업 운영', content: '클리닉 운영, 마케팅, 재정 관리, 지속 가능성' },
      ],
      exam: [
        { id: 1, question: '마스터 과정의 핵심은?', options: ['리더십 개발', '돈 버는 것', '권력', '명성'] , correct: 0 },
        { id: 2, question: '전문 관리사의 책임은?', options: ['환자 안전과 신뢰', '자신의 이익', '경쟁', '비난'], correct: 0 },
        { id: 3, question: '지속적 발전의 방법은?', options: ['학습과 성찰', '자만', '고립', '포기'], correct: 0 },
      ],
      passingScore: 80,
      certificateId: 'CERT-MASTER-2026',
    },
  ];

  const textbooks: TextbookMaterial[] = [
    {
      id: 'grade3',
      title: '3급 교재',
      grade: '3급',
      url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/grade3_jangbu_d5015981.pdf',
      description: '장•부 양자요법 관리사 3급 과정',
    },
    {
      id: 'grade2',
      title: '2급 교재',
      grade: '2급',
      url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/_____________2__________________________6d7d9024.pdf',
      description: '장•부 양자요법 관리사 2급 과정 (실무실기 중심)',
    },
  ];

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

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

  const openTextbookViewer = (textbook: TextbookMaterial) => {
    setSelectedTextbook(textbook);
    setShowTextbookViewer(true);
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
            {textbooks.map((textbook) => (
              <div key={textbook.id} className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">📖</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{textbook.title}</h3>
                    <p className="text-sm text-gray-400">{textbook.description}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  {textbook.grade} 수준의 종합 교재입니다. HTML 뷰어로 바로 열어보거나 PDF로 다운로드할 수 있습니다.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => openTextbookViewer(textbook)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold"
                  >
                    <BookOpen className="w-4 h-4" />
                    보기
                  </button>
                  <a
                    href={textbook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    다운로드
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 과목별 문제집 섹션 */}
        <div className="mb-16 bg-gradient-to-r from-slate-900/30 to-slate-800/30 p-8 rounded-lg border border-amber-500/20">
          <h2 className="text-3xl font-bold text-amber-400 mb-8 flex items-center gap-3">
            <span>✏️</span> 과목별 시험
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isCompleted = completedCourses.includes(course.id);
              const progress = courseProgress[course.id] || 0;

              return (
                <div key={course.id} className="bg-slate-800/70 p-6 rounded-lg border border-amber-500/20 hover:border-amber-500 transition">
                  <div className="flex items-start gap-3 mb-4">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-400">{course.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">진도율</span>
                      <span className="text-sm font-bold text-amber-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(course.id);
                      setTestSubmitted(false);
                      setScore(null);
                      setUserAnswers({});
                    }}
                    className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold"
                  >
                    {isCompleted ? '✓ 수료 완료' : '시험 응시'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 시험 영역 */}
        {selectedCourse && (
          <div className="mb-16 bg-slate-800/50 p-8 rounded-lg border border-amber-500/30">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                {courses.find(c => c.id === selectedCourse)?.title} - 시험
              </h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                닫기
              </button>
            </div>

            {!testSubmitted ? (
              <div className="space-y-6">
                {courses.find(c => c.id === selectedCourse)?.exam.map((question, idx) => (
                  <div key={question.id} className="bg-slate-700/50 p-6 rounded-lg border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4">
                      {idx + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option, optIdx) => (
                        <label key={optIdx} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-600/50 transition">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={String(optIdx)}
                            checked={userAnswers[question.id] === String(optIdx)}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-5 h-5 text-amber-500 cursor-pointer"
                          />
                          <span className="text-lg text-gray-200 flex-1">{optIdx + 1}. {option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitTest}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-bold text-lg"
                >
                  시험 제출
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-amber-400 mb-4">{score}점</div>
                  <p className="text-xl text-gray-300">
                    {score! >= (courses.find(c => c.id === selectedCourse)?.passingScore || 60)
                      ? '✓ 합격하셨습니다!'
                      : '✗ 불합격입니다. 다시 시도해주세요.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setTestSubmitted(false);
                    setScore(null);
                    setUserAnswers({});
                  }}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-semibold"
                >
                  완료
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* HTML 교재 뷰어 모달 */}
      {showTextbookViewer && selectedTextbook && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-amber-500 to-amber-600">
              <h3 className="text-xl font-bold text-white">{selectedTextbook.title}</h3>
              <button
                onClick={() => setShowTextbookViewer(false)}
                className="text-white hover:bg-amber-700 p-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                src={`data:text/html;charset=utf-8,${encodeURIComponent(`
                  <!DOCTYPE html>
                  <html lang="ko">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${selectedTextbook.title}</title>
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
                      .content { background: white; padding: 30px; border-radius: 8px; line-height: 1.8; max-width: 900px; margin: 0 auto; }
                      h2 { color: #d4af37; margin-top: 30px; margin-bottom: 15px; font-size: 24px; }
                      h3 { color: #1a1a2e; margin-top: 20px; margin-bottom: 10px; font-size: 18px; }
                      p { color: #333; margin-bottom: 12px; }
                      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                      table td { border: 1px solid #ddd; padding: 10px; }
                      table tr:first-child td { background: #d4af37; color: white; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <div class="content">
                      <h2>📘 ${selectedTextbook.title}</h2>
                      <p><strong>${selectedTextbook.description}</strong></p>
                      <p>이 교재는 ${selectedTextbook.grade} 수준의 전문 양자요법 관리사 교육 자료입니다.</p>
                      <h3>주요 내용</h3>
                      <p>• 양자에너지의 기본 원리</p>
                      <p>• 에너지 진단 및 치료 기법</p>
                      <p>• 실무 적용 사례</p>
                      <p>• 전문가 윤리 및 책임</p>
                      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #999; font-size: 12px;">
                        PDF 다운로드 버튼을 클릭하여 전체 교재를 다운로드할 수 있습니다.
                      </p>
                    </div>
                  </body>
                  </html>
                `)}`}
                className="w-full h-full border-0"
                title="교재 뷰어"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

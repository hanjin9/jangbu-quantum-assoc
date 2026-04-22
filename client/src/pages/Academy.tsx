import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Download, CheckCircle, Clock, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

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
  exam: ExamQuestion[];
  passingScore: number;
  certificateId: string;
}

export default function Academy() {
  const [, navigate] = useLocation();
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30분 = 1800초
  const [testStarted, setTestStarted] = useState(false);
  const [completedCourses, setCompletedCourses] = useState<number[]>([1, 2]);

  const courses: Course[] = [
    {
      id: 1,
      title: '양자요법 기초',
      description: '양자에너지 치유의 기본 원리를 배웁니다.',
      exam: [
        { id: 1, question: '양자에너지 치유의 핵심 원리는?', options: ['에너지 진동', '물리적 접촉', '약물 투여', '수술'], correct: 0 },
        { id: 2, question: '인체의 주요 에너지 센터는?', options: ['7개', '5개', '9개', '12개'], correct: 0 },
        { id: 3, question: '기본 치료 기법의 첫 단계는?', options: ['에너지 감지', '약 처방', '수술 준비', '검사'], correct: 0 },
        { id: 4, question: '양자 에너지장의 특징은?', options: ['모든 생명체에 존재', '인간만 존재', '동물만 존재', '식물만 존재'], correct: 0 },
        { id: 5, question: '차크라의 역할은?', options: ['에너지 흐름 조절', '혈액 순환', '신경 전달', '호르몬 분비'], correct: 0 },
        { id: 6, question: '손을 이용한 에너지 전달의 목적은?', options: ['에너지 조화', '온도 상승', '근육 이완', '혈압 저하'], correct: 0 },
        { id: 7, question: '호흡 기법의 주요 효과는?', options: ['에너지 흐름 정상화', '산소 증가', '이산화탄소 감소', '폐 용량 증가'], correct: 0 },
        { id: 8, question: '명상의 역할은?', options: ['에너지 조화', '근육 강화', '칼로리 소모', '심박수 증가'], correct: 0 },
        { id: 9, question: '양자요법의 기본 원칙은?', options: ['예방과 관리 중심', '치료 중심', '약물 중심', '수술 중심'], correct: 0 },
      ],
      passingScore: 60,
      certificateId: 'CERT-001-2026',
    },
    {
      id: 2,
      title: '에너지 진단법',
      description: '환자의 에너지 상태를 진단하는 방법을 학습합니다.',
      exam: [
        { id: 1, question: '에너지 감지의 첫 단계는?', options: ['손을 이용한 감지', '약물 검사', '혈액 검사', '뇌파 측정'], correct: 0 },
        { id: 2, question: '펜듈럼의 주요 용도는?', options: ['에너지 확인', '약 복용', '수술', '운동'], correct: 0 },
        { id: 3, question: '환자 상담 시 가장 중요한 것은?', options: ['공감', '명령', '판단', '무시'], correct: 0 },
        { id: 4, question: '오라 읽기의 목적은?', options: ['에너지 상태 파악', '외모 판단', '성격 판단', '미래 예측'], correct: 0 },
        { id: 5, question: '에너지 블록의 원인은?', options: ['감정적 스트레스', '날씨', '시간', '계절'], correct: 0 },
        { id: 6, question: '크리스탈의 역할은?', options: ['에너지 증폭', '온도 조절', '습도 조절', '조명'], correct: 0 },
        { id: 7, question: '에너지 측정 기기의 정확도는?', options: ['높음', '낮음', '중간', '불확실'], correct: 0 },
        { id: 8, question: '환자 상담 기록의 중요성은?', options: ['치료 계획 수립', '시간 낭비', '개인정보 노출', '비용 증가'], correct: 0 },
        { id: 9, question: '진단 도구 선택의 기준은?', options: ['환자 상태에 맞게', '가격', '인기도', '외형'], correct: 0 },
      ],
      passingScore: 60,
      certificateId: 'CERT-002-2026',
    },
    {
      id: 3,
      title: '치료 기법 심화',
      description: '고급 양자 치료 기법을 배웁니다.',
      exam: [
        { id: 1, question: '심화 치료 기법의 특징은?', options: ['다층 에너지 활용', '약물 사용', '수술', '물리 치료'], correct: 0 },
        { id: 2, question: '원거리 치료의 원리는?', options: ['에너지 공명', '전화 통화', '편지', '약물'], correct: 0 },
        { id: 3, question: '치료자 자기 관리의 목적은?', options: ['에너지 흡수 방지', '돈 버는 것', '유명해지기', '권력'], correct: 0 },
        { id: 4, question: '집단 치료의 장점은?', options: ['에너지 증폭', '비용 절감', '시간 단축', '개인화'], correct: 0 },
        { id: 5, question: '만성질환 치료의 접근법은?', options: ['장기 치료 계획', '단기 치료', '약물 투여', '수술'], correct: 0 },
        { id: 6, question: '정신 질환 치료의 특징은?', options: ['에너지 정화', '약물 투여', '입원 치료', '격리'], correct: 0 },
        { id: 7, question: '트라우마 치료의 첫 단계는?', options: ['신뢰 구축', '즉시 치료', '약물 투여', '강압'], correct: 0 },
        { id: 8, question: '에너지 보호의 방법은?', options: ['명상과 의도', '약물', '물리적 차단', '도망'], correct: 0 },
        { id: 9, question: '심화 기법 습득의 시간은?', options: ['지속적 학습', '단기 교육', '자동 습득', '경험 불필요'], correct: 0 },
      ],
      passingScore: 70,
      certificateId: 'CERT-003-2026',
    },
    {
      id: 4,
      title: '윤리 및 전문성',
      description: '전문 관리사로서의 윤리와 책임을 배웁니다.',
      exam: [
        { id: 1, question: '환자 기밀 보호의 중요성은?', options: ['신뢰 구축', '돈 벌기', '권력', '유명해지기'], correct: 0 },
        { id: 2, question: '이해 충돌 상황의 대처는?', options: ['투명하게 공개', '숨김', '무시', '거짓말'], correct: 0 },
        { id: 3, question: '전문성 유지의 방법은?', options: ['지속적 학습', '게으름', '자만', '고립'], correct: 0 },
        { id: 4, question: '환자 동의서의 역할은?', options: ['법적 보호', '형식적 절차', '시간 낭비', '불필요'], correct: 0 },
        { id: 5, question: '치료자의 책임 범위는?', options: ['환자 안전 최우선', '이익 추구', '명성 추구', '권력 추구'], correct: 0 },
        { id: 6, question: '전문 자격 유지의 조건은?', options: ['지속적 교육', '일회성 교육', '경험만으로 충분', '자격증만으로 충분'], correct: 0 },
        { id: 7, question: '환자와의 경계 설정은?', options: ['필수', '선택', '불필요', '해롭다'], correct: 0 },
        { id: 8, question: '비밀 유지의 예외는?', options: ['법적 요구', '개인의 호기심', '동료의 요청', '가족의 요청'], correct: 0 },
        { id: 9, question: '전문가 윤리의 기초는?', options: ['정직과 투명성', '이익 추구', '권력 추구', '명성 추구'], correct: 0 },
      ],
      passingScore: 65,
      certificateId: 'CERT-004-2026',
    },
    {
      id: 5,
      title: '임상 실습',
      description: '실제 환자와의 임상 경험을 쌓습니다.',
      exam: [
        { id: 1, question: '임상 관찰의 목적은?', options: ['실제 경험 습득', '시간 낭비', '휴식', '놀기'], correct: 0 },
        { id: 2, question: '지도 치료 중 가장 중요한 것은?', options: ['피드백 수용', '무시', '반항', '도망'], correct: 0 },
        { id: 3, question: '임상 기록의 용도는?', options: ['개선 방안 도출', '버리기', '숨기기', '팔기'], correct: 0 },
        { id: 4, question: '환자 사례 분석의 목적은?', options: ['학습과 성장', '시간 낭비', '비용 증가', '스트레스'], correct: 0 },
        { id: 5, question: '임상 경험의 기간은?', options: ['충분한 시간 필요', '짧을수록 좋음', '불필요', '선택사항'], correct: 0 },
        { id: 6, question: '지도자의 역할은?', options: ['멘토링과 피드백', '감시와 통제', '비판', '무관심'], correct: 0 },
        { id: 7, question: '임상 실습의 성과 평가는?', options: ['환자 만족도', '치료 비용', '시간', '인기도'], correct: 0 },
        { id: 8, question: '실습 중 실수 처리는?', options: ['학습 기회로 활용', '숨김', '비난', '포기'], correct: 0 },
        { id: 9, question: '임상 경험 후 다음 단계는?', options: ['독립 실무', '더 많은 실습', '포기', '다른 분야'], correct: 0 },
      ],
      passingScore: 75,
      certificateId: 'CERT-005-2026',
    },
    {
      id: 6,
      title: '마스터 과정',
      description: '전문 양자요법 관리사로서의 최종 단계입니다.',
      exam: [
        { id: 1, question: '마스터 과정의 핵심은?', options: ['리더십 개발', '돈 버는 것', '권력', '명성'], correct: 0 },
        { id: 2, question: '전문 관리사의 책임은?', options: ['환자 안전과 신뢰', '자신의 이익', '경쟁', '비난'], correct: 0 },
        { id: 3, question: '지속적 발전의 방법은?', options: ['학습과 성찰', '자만', '고립', '포기'], correct: 0 },
        { id: 4, question: '팀 관리의 목표는?', options: ['최고의 서비스 제공', '비용 절감', '인원 감축', '통제'], correct: 0 },
        { id: 5, question: '신입 교육의 중점은?', options: ['윤리와 전문성', '빠른 수익', '최소 비용', '최대 효율'], correct: 0 },
        { id: 6, question: '클리닉 운영의 핵심은?', options: ['환자 중심', '이익 중심', '명성 중심', '권력 중심'], correct: 0 },
        { id: 7, question: '마케팅 전략의 기초는?', options: ['신뢰와 투명성', '과장광고', '거짓 약속', '경쟁 비난'], correct: 0 },
        { id: 8, question: '재정 관리의 목표는?', options: ['지속 가능성', '단기 이익', '최대 수익', '최소 비용'], correct: 0 },
        { id: 9, question: '마스터의 최종 목표는?', options: ['사회 기여', '개인 부유', '권력 추구', '명성 추구'], correct: 0 },
      ],
      passingScore: 80,
      certificateId: 'CERT-MASTER-2026',
    },
  ];

  // 30분 타이머
  useEffect(() => {
    if (!testStarted || testSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTestSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleStartTest = (courseId: number) => {
    setExpandedCourse(courseId);
    setTestStarted(true);
    setTestSubmitted(false);
    setScore(null);
    setUserAnswers({});
    setTimeLeft(1800); // 30분 리셋
  };

  const handleSubmitTest = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    let correctCount = 0;
    course.exam.forEach(q => {
      if (userAnswers[q.id] === String(q.correct)) correctCount++;
    });
    const calculatedScore = Math.round((correctCount / course.exam.length) * 100);
    setScore(calculatedScore);
    setTestSubmitted(true);

    if (calculatedScore >= course.passingScore) {
      setCompletedCourses([...completedCourses, courseId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">양자요법 교육 과정</h1>
        <p className="text-gray-300 mb-12">전문 양자요법 관리사 자격증 취득 과정</p>

        {/* 과목별 시험 섹션 */}
        <div className="space-y-6">
          {courses.map((course) => {
            const isCompleted = completedCourses.includes(course.id);
            const isExpanded = expandedCourse === course.id;

            return (
              <div key={course.id} className="bg-slate-800/70 rounded-lg border border-amber-500/20 overflow-hidden">
                {/* 과정 헤더 */}
                <div className="p-6 hover:bg-slate-700/50 transition cursor-pointer" onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
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
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                </div>

                {/* 시험 영역 - 펼쳐짐 */}
                {isExpanded && (
                  <div className="border-t border-amber-500/20 p-6 bg-slate-700/30">
                    {!testStarted || expandedCourse !== course.id ? (
                      <button
                        onClick={() => handleStartTest(course.id)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-bold text-lg mb-4"
                      >
                        ✏️ 시험 응시 (30분)
                      </button>
                    ) : (
                      <>
                        {/* 타이머 */}
                        <div className="mb-6 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
                          <div className="text-center">
                            <p className="text-gray-300 text-sm mb-2">남은 시간</p>
                            <p className="text-3xl font-bold text-red-400">{formatTime(timeLeft)}</p>
                          </div>
                        </div>

                        {!testSubmitted ? (
                          <div className="space-y-6">
                            {course.exam.map((question, idx) => (
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
                              onClick={() => handleSubmitTest(course.id)}
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
                                {score! >= course.passingScore
                                  ? '✓ 합격하셨습니다!'
                                  : '✗ 불합격입니다. 다시 시도해주세요.'}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setExpandedCourse(null);
                                setTestStarted(false);
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
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

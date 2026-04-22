import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Download, CheckCircle, Clock, BookOpen, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
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
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const [testStarted, setTestStarted] = useState(false);
  const [completedCourses, setCompletedCourses] = useState<number[]>([1, 2]);
  const [wrongAnswers, setWrongAnswers] = useState<Record<number, boolean>>({});

  const courses: Course[] = [
    {
      id: 1,
      title: '양자요법 기초',
      description: '양자에너지 치유의 기본 원리를 배웁니다.',
      exam: [
        { id: 1, question: '양자에너지 치유의 핵심 원리는?', options: ['에너지 진동', '물리적 접촉', '약물 투여', '수술'], correct: 0, explanation: '양자에너지 치유는 모든 생명체의 에너지 진동을 조화시키는 것을 기본 원리로 합니다.' },
        { id: 2, question: '인체의 주요 에너지 센터는?', options: ['7개', '5개', '9개', '12개'], correct: 0, explanation: '인체의 주요 에너지 센터는 7개의 차크라로 알려져 있습니다.' },
        { id: 3, question: '기본 치료 기법의 첫 단계는?', options: ['에너지 감지', '약 처방', '수술 준비', '검사'], correct: 0, explanation: '모든 치료의 첫 단계는 환자의 에너지 상태를 정확히 감지하는 것입니다.' },
        { id: 4, question: '양자 에너지장의 특징은?', options: ['모든 생명체에 존재', '인간만 존재', '동물만 존재', '식물만 존재'], correct: 0, explanation: '양자 에너지장은 모든 생명체 주변에 존재하는 보이지 않는 에너지 필드입니다.' },
        { id: 5, question: '차크라의 역할은?', options: ['에너지 흐름 조절', '혈액 순환', '신경 전달', '호르몬 분비'], correct: 0, explanation: '차크라는 신체를 통한 에너지의 흐름을 조절하는 중요한 에너지 중심점입니다.' },
        { id: 6, question: '손을 이용한 에너지 전달의 목적은?', options: ['에너지 조화', '온도 상승', '근육 이완', '혈압 저하'], correct: 0, explanation: '손은 에너지 전달의 주요 도구로, 치료자의 에너지를 환자에게 전달합니다.' },
        { id: 7, question: '호흡 기법의 주요 효과는?', options: ['에너지 흐름 정상화', '산소 증가', '이산화탄소 감소', '폐 용량 증가'], correct: 0, explanation: '올바른 호흡 기법은 신체의 에너지 흐름을 정상화하고 조화시킵니다.' },
        { id: 8, question: '명상의 역할은?', options: ['에너지 조화', '근육 강화', '칼로리 소모', '심박수 증가'], correct: 0, explanation: '명상은 마음을 진정시키고 에너지를 조화시키는 중요한 수련 방법입니다.' },
        { id: 9, question: '양자요법의 기본 원칙은?', options: ['예방과 관리 중심', '치료 중심', '약물 중심', '수술 중심'], correct: 0, explanation: '양자요법은 질병 예방과 건강 관리에 중점을 두는 예방 의학입니다.' },
      ],
      passingScore: 60,
      certificateId: 'CERT-001-2026',
    },
    {
      id: 2,
      title: '에너지 진단법',
      description: '환자의 에너지 상태를 진단하는 방법을 학습합니다.',
      exam: [
        { id: 1, question: '에너지 감지의 첫 단계는?', options: ['손을 이용한 감지', '약물 검사', '혈액 검사', '뇌파 측정'], correct: 0, explanation: '손의 민감도를 높여 환자의 에너지장을 감지하는 것이 첫 단계입니다.' },
        { id: 2, question: '펜듈럼의 주요 용도는?', options: ['에너지 확인', '약 복용', '수술', '운동'], correct: 0, explanation: '펜듈럼은 에너지의 흐름 방향과 강도를 확인하는 진단 도구입니다.' },
        { id: 3, question: '환자 상담 시 가장 중요한 것은?', options: ['공감', '명령', '판단', '무시'], correct: 0, explanation: '환자와의 신뢰 관계 구축을 위해 공감과 경청이 가장 중요합니다.' },
        { id: 4, question: '오라 읽기의 목적은?', options: ['에너지 상태 파악', '외모 판단', '성격 판단', '미래 예측'], correct: 0, explanation: '오라는 신체 주변의 에너지 필드로, 건강 상태를 파악할 수 있습니다.' },
        { id: 5, question: '에너지 블록의 원인은?', options: ['감정적 스트레스', '날씨', '시간', '계절'], correct: 0, explanation: '감정적 스트레스와 트라우마는 에너지 흐름을 막는 주요 원인입니다.' },
        { id: 6, question: '크리스탈의 역할은?', options: ['에너지 증폭', '온도 조절', '습도 조절', '조명'], correct: 0, explanation: '크리스탈은 에너지를 증폭하고 정화하는 특성을 가진 천연 도구입니다.' },
        { id: 7, question: '에너지 측정 기기의 정확도는?', options: ['높음', '낮음', '중간', '불확실'], correct: 0, explanation: '현대 에너지 측정 기기는 높은 정확도로 에너지를 감지할 수 있습니다.' },
        { id: 8, question: '환자 상담 기록의 중요성은?', options: ['치료 계획 수립', '버리기', '숨기기', '팔기'], correct: 0, explanation: '상담 기록은 치료 계획 수립과 진행 상황 추적에 필수적입니다.' },
        { id: 9, question: '진단 도구 선택의 기준은?', options: ['환자 상태에 맞게', '가격', '인기도', '외형'], correct: 0, explanation: '각 환자의 고유한 상태에 맞는 진단 도구를 선택하는 것이 중요합니다.' },
      ],
      passingScore: 60,
      certificateId: 'CERT-002-2026',
    },
    {
      id: 3,
      title: '치료 기법 심화',
      description: '고급 양자 치료 기법을 배웁니다.',
      exam: [
        { id: 1, question: '심화 치료 기법의 특징은?', options: ['다층 에너지 활용', '약물 사용', '수술', '물리 치료'], correct: 0, explanation: '심화 기법은 여러 에너지 층을 동시에 다루는 고급 치료 방법입니다.' },
        { id: 2, question: '원거리 치료의 원리는?', options: ['에너지 공명', '전화 통화', '편지', '약물'], correct: 0, explanation: '에너지는 거리의 제약이 없으므로 원거리 치료가 가능합니다.' },
        { id: 3, question: '치료자 자기 관리의 목적은?', options: ['에너지 흡수 방지', '돈 버는 것', '유명해지기', '권력'], correct: 0, explanation: '치료자는 환자의 부정적 에너지 흡수를 방지하기 위해 자기 관리가 필수입니다.' },
        { id: 4, question: '집단 치료의 장점은?', options: ['에너지 증폭', '비용 절감', '시간 단축', '개인화'], correct: 0, explanation: '여러 사람이 함께 치료받을 때 에너지가 증폭되는 시너지 효과가 발생합니다.' },
        { id: 5, question: '만성질환 치료의 접근법은?', options: ['장기 치료 계획', '단기 치료', '약물 투여', '수술'], correct: 0, explanation: '만성질환은 장기간의 지속적인 치료와 관리가 필요합니다.' },
        { id: 6, question: '정신 질환 치료의 특징은?', options: ['에너지 정화', '약물 투여', '입원 치료', '격리'], correct: 0, explanation: '정신 질환은 에너지 정화와 마음의 안정을 통해 치료됩니다.' },
        { id: 7, question: '트라우마 치료의 첫 단계는?', options: ['신뢰 구축', '즉시 치료', '약물 투여', '강압'], correct: 0, explanation: '트라우마 치료는 환자와의 신뢰 관계 구축에서 시작됩니다.' },
        { id: 8, question: '에너지 보호의 방법은?', options: ['명상과 의도', '약물', '물리적 차단', '도망'], correct: 0, explanation: '명상과 긍정적 의도를 통해 자신의 에너지를 보호할 수 있습니다.' },
        { id: 9, question: '심화 기법 습득의 시간은?', options: ['지속적 학습', '단기 교육', '자동 습득', '경험 불필요'], correct: 0, explanation: '심화 기법은 지속적인 학습과 실습을 통해 습득됩니다.' },
      ],
      passingScore: 70,
      certificateId: 'CERT-003-2026',
    },
    {
      id: 4,
      title: '윤리 및 전문성',
      description: '전문 관리사로서의 윤리와 책임을 배웁니다.',
      exam: [
        { id: 1, question: '환자 기밀 보호의 중요성은?', options: ['신뢰 구축', '돈 벌기', '권력', '유명해지기'], correct: 0, explanation: '환자 기밀 보호는 전문가의 기본 윤리이자 신뢰 구축의 기초입니다.' },
        { id: 2, question: '이해 충돌 상황의 대처는?', options: ['투명하게 공개', '숨김', '무시', '거짓말'], correct: 0, explanation: '이해 충돌이 발생하면 투명하게 공개하고 적절히 처리해야 합니다.' },
        { id: 3, question: '전문성 유지의 방법은?', options: ['지속적 학습', '게으름', '자만', '고립'], correct: 0, explanation: '전문성은 지속적인 학습과 자기 개발을 통해 유지됩니다.' },
        { id: 4, question: '환자 동의서의 역할은?', options: ['법적 보호', '형식적 절차', '시간 낭비', '불필요'], correct: 0, explanation: '환자 동의서는 법적 보호와 투명성을 보장하는 중요한 문서입니다.' },
        { id: 5, question: '치료자의 책임 범위는?', options: ['환자 안전 최우선', '이익 추구', '명성 추구', '권력 추구'], correct: 0, explanation: '치료자의 최우선 책임은 항상 환자의 안전과 건강입니다.' },
        { id: 6, question: '전문 자격 유지의 조건은?', options: ['지속적 교육', '일회성 교육', '경험만으로 충분', '자격증만으로 충분'], correct: 0, explanation: '전문 자격은 지속적인 교육과 재인증을 통해 유지됩니다.' },
        { id: 7, question: '환자와의 경계 설정은?', options: ['필수', '선택', '불필요', '해롭다'], correct: 0, explanation: '전문적 관계 유지를 위해 환자와의 명확한 경계 설정이 필수입니다.' },
        { id: 8, question: '비밀 유지의 예외는?', options: ['법적 요구', '개인의 호기심', '동료의 요청', '가족의 요청'], correct: 0, explanation: '법적 요구가 있을 때만 비밀 유지의 예외가 인정됩니다.' },
        { id: 9, question: '전문가 윤리의 기초는?', options: ['정직과 투명성', '이익 추구', '권력 추구', '명성 추구'], correct: 0, explanation: '모든 전문가 윤리의 기초는 정직과 투명성입니다.' },
      ],
      passingScore: 65,
      certificateId: 'CERT-004-2026',
    },
    {
      id: 5,
      title: '임상 실습',
      description: '실제 환자와의 임상 경험을 쌓습니다.',
      exam: [
        { id: 1, question: '임상 관찰의 목적은?', options: ['실제 경험 습득', '시간 낭비', '휴식', '놀기'], correct: 0, explanation: '임상 관찰을 통해 실제 치료 상황에서의 경험을 습득합니다.' },
        { id: 2, question: '지도 치료 중 가장 중요한 것은?', options: ['피드백 수용', '무시', '반항', '도망'], correct: 0, explanation: '지도자의 피드백을 겸허하게 수용하는 것이 성장의 핵심입니다.' },
        { id: 3, question: '임상 기록의 용도는?', options: ['개선 방안 도출', '버리기', '숨기기', '팔기'], correct: 0, explanation: '임상 기록은 자신의 치료를 분석하고 개선하기 위한 중요한 자료입니다.' },
        { id: 4, question: '환자 사례 분석의 목적은?', options: ['학습과 성장', '시간 낭비', '비용 증가', '스트레스'], correct: 0, explanation: '사례 분석을 통해 다양한 상황에 대한 이해와 대처 능력을 키웁니다.' },
        { id: 5, question: '임상 경험의 기간은?', options: ['충분한 시간 필요', '짧을수록 좋음', '불필요', '선택사항'], correct: 0, explanation: '충분한 임상 경험은 전문가로 성장하기 위해 필수적입니다.' },
        { id: 6, question: '지도자의 역할은?', options: ['멘토링과 피드백', '감시와 통제', '비판', '무관심'], correct: 0, explanation: '지도자는 멘토로서 학생의 성장을 돕고 피드백을 제공합니다.' },
        { id: 7, question: '임상 실습의 성과 평가는?', options: ['환자 만족도', '치료 비용', '시간', '인기도'], correct: 0, explanation: '임상 실습의 성공은 환자의 만족도와 치료 결과로 평가됩니다.' },
        { id: 8, question: '실습 중 실수 처리는?', options: ['학습 기회로 활용', '숨김', '비난', '포기'], correct: 0, explanation: '실수는 숨기지 말고 학습의 기회로 삼아야 합니다.' },
        { id: 9, question: '임상 경험 후 다음 단계는?', options: ['독립 실무', '더 많은 실습', '포기', '다른 분야'], correct: 0, explanation: '충분한 임상 경험 후 독립적인 실무를 시작할 수 있습니다.' },
      ],
      passingScore: 75,
      certificateId: 'CERT-005-2026',
    },
    {
      id: 6,
      title: '마스터 과정',
      description: '전문 양자요법 관리사로서의 최종 단계입니다.',
      exam: [
        { id: 1, question: '마스터 과정의 핵심은?', options: ['리더십 개발', '돈 버는 것', '권력', '명성'], correct: 0, explanation: '마스터 과정은 리더십과 사회 기여에 중점을 두는 최고 단계입니다.' },
        { id: 2, question: '전문 관리사의 책임은?', options: ['환자 안전과 신뢰', '자신의 이익', '경쟁', '비난'], correct: 0, explanation: '전문 관리사는 항상 환자의 안전과 신뢰를 최우선으로 생각해야 합니다.' },
        { id: 3, question: '지속적 발전의 방법은?', options: ['학습과 성찰', '자만', '고립', '포기'], correct: 0, explanation: '지속적인 학습과 자기 성찰을 통해 전문성을 높입니다.' },
        { id: 4, question: '팀 관리의 목표는?', options: ['최고의 서비스 제공', '비용 절감', '인원 감축', '통제'], correct: 0, explanation: '팀 관리의 목표는 최고 수준의 서비스를 환자에게 제공하는 것입니다.' },
        { id: 5, question: '신입 교육의 중점은?', options: ['윤리와 전문성', '빠른 수익', '최소 비용', '최대 효율'], correct: 0, explanation: '신입 교육은 윤리와 전문성을 기초로 하여 진행되어야 합니다.' },
        { id: 6, question: '클리닉 운영의 핵심은?', options: ['환자 중심', '이익 중심', '명성 중심', '권력 중심'], correct: 0, explanation: '성공적인 클리닉 운영의 핵심은 항상 환자 중심의 철학입니다.' },
        { id: 7, question: '마케팅 전략의 기초는?', options: ['신뢰와 투명성', '과장광고', '거짓 약속', '경쟁 비난'], correct: 0, explanation: '윤리적 마케팅은 신뢰와 투명성을 바탕으로 합니다.' },
        { id: 8, question: '재정 관리의 목표는?', options: ['지속 가능성', '단기 이익', '최대 수익', '최소 비용'], correct: 0, explanation: '장기적 재정 관리의 목표는 지속 가능성입니다.' },
        { id: 9, question: '마스터의 최종 목표는?', options: ['사회 기여', '개인 부유', '권력 추구', '명성 추구'], correct: 0, explanation: '마스터 과정을 마친 전문가의 최종 목표는 사회에 대한 기여입니다.' },
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
    setWrongAnswers({});
    setTimeLeft(1800);
  };

  const handleSubmitTest = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    let correctCount = 0;
    const newWrongAnswers: Record<number, boolean> = {};
    
    course.exam.forEach(q => {
      const isCorrect = userAnswers[q.id] === String(q.correct);
      if (isCorrect) {
        correctCount++;
      } else {
        newWrongAnswers[q.id] = true;
      }
    });
    
    setWrongAnswers(newWrongAnswers);
    const calculatedScore = Math.round((correctCount / course.exam.length) * 100);
    setScore(calculatedScore);
    setTestSubmitted(true);

    if (calculatedScore >= course.passingScore) {
      setCompletedCourses([...completedCourses, courseId]);
    }
  };

  const getProgressPercentage = (courseId: number) => {
    return completedCourses.includes(courseId) ? 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">양자요법 교육 과정</h1>
        <p className="text-gray-300 mb-12">전문 양자요법 관리사 자격증 취득 과정</p>

        {/* 전체 진도율 */}
        <div className="mb-8 bg-slate-800/70 rounded-lg p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">전체 진도</h2>
            <span className="text-amber-400 font-bold">{completedCourses.length}/6 과정 완료</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-500"
              style={{ width: `${(completedCourses.length / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* 과목별 시험 섹션 */}
        <div className="space-y-6">
          {courses.map((course) => {
            const isCompleted = completedCourses.includes(course.id);
            const isExpanded = expandedCourse === course.id;
            const progressPercent = getProgressPercentage(course.id);

            return (
              <div key={course.id} className="bg-slate-800/70 rounded-lg border border-amber-500/20 overflow-hidden">
                {/* 과정 헤더 */}
                <div className="p-6 hover:bg-slate-700/50 transition cursor-pointer" onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
                  <div className="flex items-center justify-between mb-3">
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
                  
                  {/* 진도 막대 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-amber-400 w-12 text-right">{progressPercent}%</span>
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
                          <div className="space-y-6">
                            {/* 성적 표시 */}
                            <div className="text-center py-8 bg-slate-700/50 rounded-lg border border-amber-500/20">
                              <div className="mb-6">
                                <div className="text-6xl font-bold text-amber-400 mb-4">{score}점</div>
                                <p className="text-xl text-gray-300">
                                  {score! >= course.passingScore
                                    ? '✓ 합격하셨습니다!'
                                    : '✗ 불합격입니다. 다시 시도해주세요.'}
                                </p>
                              </div>
                            </div>

                            {/* 틀린 문제 해설 */}
                            {Object.keys(wrongAnswers).length > 0 && (
                              <div className="bg-red-500/10 rounded-lg border border-red-500/30 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                  <AlertCircle className="w-5 h-5 text-red-400" />
                                  <h3 className="text-lg font-bold text-red-300">틀린 문제 해설</h3>
                                </div>
                                <div className="space-y-4">
                                  {course.exam.map((question) => {
                                    if (!wrongAnswers[question.id]) return null;
                                    const userAnswer = parseInt(userAnswers[question.id] || '-1');
                                    const correctAnswer = question.correct;
                                    
                                    return (
                                      <div key={question.id} className="bg-slate-700/50 p-4 rounded-lg border border-red-500/20">
                                        <p className="text-white font-semibold mb-3">{question.question}</p>
                                        <div className="space-y-2 mb-3">
                                          <p className="text-red-300">
                                            <span className="font-semibold">당신의 답:</span> {userAnswer >= 0 ? `${userAnswer + 1}. ${question.options[userAnswer]}` : '선택 안 함'}
                                          </p>
                                          <p className="text-green-300">
                                            <span className="font-semibold">정답:</span> {correctAnswer + 1}. {question.options[correctAnswer]}
                                          </p>
                                        </div>
                                        <div className="bg-slate-800/50 p-3 rounded border-l-4 border-amber-400">
                                          <p className="text-gray-200 text-sm"><span className="font-semibold text-amber-300">해설:</span> {question.explanation}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setExpandedCourse(null);
                                setTestStarted(false);
                                setTestSubmitted(false);
                                setScore(null);
                                setUserAnswers({});
                                setWrongAnswers({});
                              }}
                              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-bold text-lg"
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

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState } from 'react';

export default function Academy() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const courses = [
    {
      id: 1,
      title: '양자요법 기초',
      description: '양자에너지 치유의 기본 원리를 배웁니다.',
      materials: [
        '양자에너지의 정의',
        '인체와 에너지 필드',
        '기본 치료 기법',
      ],
      exam: [
        {
          id: 1,
          question: '양자에너지 치유의 핵심 원리는?',
          options: ['에너지 진동', '물리적 접촉', '약물 투여', '수술'],
          correct: 0,
        },
        {
          id: 2,
          question: '인체의 주요 에너지 센터는?',
          options: ['7개', '5개', '9개', '12개'],
          correct: 0,
        },
        {
          id: 3,
          question: '기본 치료 기법의 첫 단계는?',
          options: ['에너지 감지', '약 처방', '수술 준비', '검사'],
          correct: 0,
        },
      ],
      passingScore: 60,
    },
    {
      id: 2,
      title: '에너지 진단법',
      description: '환자의 에너지 상태를 진단하는 방법을 학습합니다.',
      materials: [
        '에너지 필드 측정',
        '진단 도구 사용법',
        '케이스 분석',
      ],
      exam: [
        {
          id: 1,
          question: '에너지 필드 측정의 기본 원리는?',
          options: ['진동 감지', '온도 측정', '색상 분석', '음파 감지'],
          correct: 0,
        },
        {
          id: 2,
          question: '진단 도구 중 가장 기본적인 것은?',
          options: ['손 스캔', '기계 스캔', '음성 분석', '혈액 검사'],
          correct: 0,
        },
        {
          id: 3,
          question: '에너지 불균형의 주요 증상은?',
          options: ['피로', '두통', '통증', '모두 해당'],
          correct: 3,
        },
      ],
      passingScore: 60,
    },
    {
      id: 3,
      title: '치료 기법 심화',
      description: '고급 양자 치료 기법을 습득합니다.',
      materials: [
        '고급 에너지 조정',
        '복합 치료법',
        '응급 상황 대응',
      ],
      exam: [
        {
          id: 1,
          question: '고급 에너지 조정의 핵심은?',
          options: ['정확한 주파수', '강한 힘', '긴 시간', '반복'],
          correct: 0,
        },
        {
          id: 2,
          question: '복합 치료법은 몇 가지 기법을 결합하는가?',
          options: ['2가지', '3가지', '4가지', '5가지'],
          correct: 1,
        },
        {
          id: 3,
          question: '응급 상황에서 가장 중요한 것은?',
          options: ['신속한 대응', '정확한 진단', '환자 안정', '전문가 호출'],
          correct: 0,
        },
      ],
      passingScore: 60,
    },
    {
      id: 4,
      title: '윤리 및 전문성',
      description: '양자요법 관리사의 윤리 기준과 전문성을 배웁니다.',
      materials: [
        '윤리 강령',
        '환자 보호',
        '전문가 책임',
      ],
      exam: [
        {
          id: 1,
          question: '양자요법 관리사의 기본 윤리는?',
          options: ['환자 중심', '이익 추구', '명성 관리', '기술 자랑'],
          correct: 0,
        },
        {
          id: 2,
          question: '환자 정보 보호의 가장 중요한 원칙은?',
          options: ['비밀 유지', '투명성', '공개', '공유'],
          correct: 0,
        },
        {
          id: 3,
          question: '전문가의 책임은?',
          options: ['지속 학습', '자격 유지', '윤리 준수', '모두 해당'],
          correct: 3,
        },
      ],
      passingScore: 60,
    },
    {
      id: 5,
      title: '임상 실습',
      description: '실제 환자 사례를 통한 임상 실습을 진행합니다.',
      materials: [
        '사례 분석',
        '치료 계획 수립',
        '결과 평가',
      ],
      exam: [
        {
          id: 1,
          question: '임상 사례 분석의 첫 단계는?',
          options: ['환자 정보 수집', '즉시 치료', '약물 처방', '수술 계획'],
          correct: 0,
        },
        {
          id: 2,
          question: '치료 계획 수립 시 고려할 사항은?',
          options: ['환자 상태', '치료 목표', '예상 기간', '모두 해당'],
          correct: 3,
        },
        {
          id: 3,
          question: '결과 평가의 주요 지표는?',
          options: ['증상 개선', '에너지 변화', '환자 만족도', '모두 해당'],
          correct: 3,
        },
      ],
      passingScore: 60,
    },
    {
      id: 6,
      title: '자격증 종합 시험',
      description: '모든 과정을 종합하는 최종 자격증 시험입니다.',
      materials: [
        '전체 이론 복습',
        '실습 기법 정리',
        '윤리 및 전문성',
      ],
      exam: [
        {
          id: 1,
          question: '양자요법의 핵심 철학은?',
          options: ['에너지 균형', '약물 치료', '수술', '물리 치료'],
          correct: 0,
        },
        {
          id: 2,
          question: '관리사의 주요 역할은?',
          options: ['진단 및 치료', '환자 교육', '예방 관리', '모두 해당'],
          correct: 3,
        },
        {
          id: 3,
          question: '전문성 유지의 방법은?',
          options: ['지속 교육', '경험 축적', '윤리 준수', '모두 해당'],
          correct: 3,
        },
      ],
      passingScore: 70,
    },
  ];

  const handleStartExam = (courseId: number) => {
    setSelectedCourse(courseId);
    setUserAnswers({});
    setTestSubmitted(false);
    setScore(null);
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex.toString(),
    });
  };

  const handleSubmitExam = () => {
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return;

    let correctCount = 0;
    course.exam.forEach(q => {
      if (userAnswers[q.id] !== undefined && parseInt(userAnswers[q.id]) === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = (correctCount / course.exam.length) * 100;
    setScore(calculatedScore);
    setTestSubmitted(true);
  };

  const isPassed = score !== null && score >= (courses.find(c => c.id === selectedCourse)?.passingScore || 60);

  if (selectedCourse && !testSubmitted) {
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return null;

    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#1a4d7a] mb-8">{course.title} - {t('exam.title')}</h1>

          <div className="bg-card rounded-lg p-8 border border-border">
            {course.exam.map((question, idx) => (
              <div key={question.id} className="mb-8 pb-8 border-b border-border last:border-b-0">
                <h3 className="text-lg font-bold text-[#1a4d7a] mb-4">
                  {idx + 1}. {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center p-3 border border-border rounded-lg hover:bg-accent cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optIdx}
                        checked={userAnswers[question.id] === optIdx.toString()}
                        onChange={() => handleAnswerSelect(question.id, optIdx)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSubmitExam}
                className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
              >
                {t('exam.submit')}
              </Button>
              <Button
                onClick={() => setSelectedCourse(null)}
                variant="outline"
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse && testSubmitted) {
    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return null;

    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#1a4d7a] mb-8">{t('exam.results')}</h1>

          <div className="bg-card rounded-lg p-8 border border-border max-w-2xl">
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-4 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(score || 0)}%
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {isPassed ? '합격' : '불합격'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {isPassed 
                  ? `축하합니다! ${course.title} 과정을 성공적으로 완료했습니다.`
                  : `${course.passingScore}점 이상이 필요합니다. 다시 시도해주세요.`
                }
              </p>
            </div>

            {isPassed && (
              <div className="bg-[#d4af37]/10 border-2 border-[#d4af37] rounded-lg p-6 mb-8 text-center">
                <p className="text-lg font-bold text-[#1a4d7a] mb-4">🎓 수료증 발급</p>
                <Button
                  className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
                  onClick={() => {
                    // 수료증 다운로드 로직
                    alert(`${course.title} 수료증이 발급되었습니다!`);
                  }}
                >
                  수료증 다운로드
                </Button>
              </div>
            )}

            <div className="flex gap-4">
              {!isPassed && (
                <Button
                  onClick={() => handleStartExam(selectedCourse)}
                  className="bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold flex-1"
                >
                  다시 시험 보기
                </Button>
              )}
              <Button
                onClick={() => setSelectedCourse(null)}
                variant="outline"
                className="flex-1"
              >
                과정 목록으로
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#1a4d7a] mb-4">아카데미 / 교육</h1>
        <p className="text-lg text-muted-foreground mb-12">
          전문가 양성을 위한 체계적인 교육 프로그램 (총 6개 과정)
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-[#d4af37] transition">
              <div className="p-6">
                <div className="text-3xl font-bold text-[#d4af37] mb-2">{course.id}</div>
                <h2 className="text-xl font-bold text-[#1a4d7a] mb-2">{course.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{course.description}</p>

                <div className="mb-6">
                  <h3 className="font-bold text-[#1a4d7a] mb-3 text-sm">📚 교재</h3>
                  <ul className="space-y-1">
                    {course.materials.map((material, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 text-xs text-muted-foreground">
                  <p>시험: {course.exam.length}문제 | 합격선: {course.passingScore}점</p>
                </div>

                <Button
                  onClick={() => handleStartExam(course.id)}
                  className="w-full bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold text-sm"
                >
                  시험 응시
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

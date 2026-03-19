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
          전문가 양성을 위한 체계적인 교육 프로그램
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {courses.map(course => (
            <div key={course.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-[#d4af37] transition">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1a4d7a] mb-2">{course.title}</h2>
                <p className="text-muted-foreground mb-6">{course.description}</p>

                <div className="mb-6">
                  <h3 className="font-bold text-[#1a4d7a] mb-3">📚 교재</h3>
                  <ul className="space-y-2">
                    {course.materials.map((material, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-[#d4af37] rounded-full"></span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    시험: {course.exam.length}문제 | 합격선: {course.passingScore}점
                  </p>
                </div>

                <Button
                  onClick={() => handleStartExam(course.id)}
                  className="w-full bg-[#d4af37] text-[#1a4d7a] hover:bg-[#c99d2e] font-bold"
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

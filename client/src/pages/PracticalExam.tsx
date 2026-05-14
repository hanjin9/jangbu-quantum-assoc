import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle, AlertCircle, Trophy, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PracticalExam() {
  const [, navigate] = useLocation();
  const [examState, setExamState] = useState<'list' | 'taking' | 'result'>('list');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  // 시험 목록
  const exams = [
    {
      id: 1,
      title: '기초 양자요법 이론',
      level: 'beginner',
      duration: 60,
      questions: 9,
      passingScore: 70,
      description: '양자요법의 기본 이론과 원리를 이해하는 시험'
    },
    {
      id: 2,
      title: '중급 양자에너지 치료',
      level: 'intermediate',
      duration: 90,
      questions: 9,
      passingScore: 75,
      description: '양자에너지를 활용한 실제 치료 방법'
    },
    {
      id: 3,
      title: '고급 양자요법 전문가',
      level: 'advanced',
      duration: 120,
      questions: 9,
      passingScore: 80,
      description: '양자요법 전문가 자격증 시험'
    }
  ];

  // 샘플 시험 문제 (과목별 9개)
  const examQuestions = [
    {
      id: 1,
      question: '양자에너지의 기본 원리는 무엇인가?',
      type: 'multiple_choice',
      options: [
        '파동성과 입자성',
        '중력의 작용',
        '화학 반응',
        '열의 전달'
      ],
      correctAnswer: '파동성과 입자성'
    },
    {
      id: 2,
      question: '양자요법 치료 시 가장 중요한 요소는?',
      type: 'multiple_choice',
      options: [
        '환자 신뢰도',
        '주파수 조정',
        '치료사 경험',
        '치료 시간'
      ],
      correctAnswer: '주파수 조정'
    },
    {
      id: 3,
      question: '다음 중 양자요법의 장점을 모두 고르시오',
      type: 'multiple_choice',
      options: [
        '부작용 적음, 자연친화',
        '빠른 효과',
        '모든 질병 효과',
        '저렴한 비용'
      ],
      correctAnswer: '부작용 적음, 자연친화'
    },
    {
      id: 4,
      question: '양자요법에서 에너지 주파수의 역할은?',
      type: 'multiple_choice',
      options: [
        '세포 진동 조정',
        '체온 상승',
        '신경 마비',
        '혈액 순환 개선'
      ],
      correctAnswer: '세포 진동 조정'
    },
    {
      id: 5,
      question: '양자요법 치료 시 피해야 할 행동은?',
      type: 'multiple_choice',
      options: [
        '신뢰 구축',
        '부정적 생각',
        '정확한 기록',
        '지속적 모니터링'
      ],
      correctAnswer: '부정적 생각'
    },
    {
      id: 6,
      question: '양자요법의 과학적 근거는 무엇인가?',
      type: 'multiple_choice',
      options: [
        '양자역학, 생물물리학',
        '고전 물리학',
        '종교적 신념',
        '경험적 추측'
      ],
      correctAnswer: '양자역학, 생물물리학'
    },
    {
      id: 7,
      question: '양자요법 관리사의 윤리 기준으로 가장 중요한 것은?',
      type: 'multiple_choice',
      options: [
        '개인정보 보호',
        '치료비 최대화',
        '자신 이익 우선',
        '결과 과장 광고'
      ],
      correctAnswer: '개인정보 보호'
    },
    {
      id: 8,
      question: '양자요법에서 환자 상담 시 포함되어야 할 내용은?',
      type: 'multiple_choice',
      options: [
        '종합 상담',
        '증상만 확인',
        '의료 진단',
        '약물 처방'
      ],
      correctAnswer: '종합 상담'
    },
    {
      id: 9,
      question: '양자요법 치료 후 관리에서 중요한 것은?',
      type: 'multiple_choice',
      options: [
        '반응 관찰, 재평가',
        '한 번 치료로 완료',
        '환자 추적 없음',
        '비용 청구만 중요'
      ],
      correctAnswer: '반응 관찰, 재평가'
    }
  ];

  const levelLabels = {
    beginner: '기초',
    intermediate: '중급',
    advanced: '고급'
  };

  const handleStartExam = (examId: number) => {
    setExamState('taking');
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    // 점수 계산
    let calculatedScore = 0;
    examQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        calculatedScore += 100 / examQuestions.length;
      }
    });
    setScore(Math.round(calculatedScore));
    setExamState('result');
  };

  const handleBackToList = () => {
    setExamState('list');
  };

  if (examState === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">실기시험</h1>
            <p className="text-gray-300 text-lg">
              양자요법 자격증 취득을 위한 실기시험에 응시하세요
            </p>
          </div>

          {/* 문제집 버튼 */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/exam-practice-book')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              과목별 문제집 보기
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card
                key={exam.id}
                className="p-6 bg-slate-800 border-slate-700 hover:border-amber-500/50 transition"
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                    {levelLabels[exam.level as keyof typeof levelLabels]}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {exam.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {exam.description}
                </p>

                <div className="space-y-3 mb-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>시간: {exam.duration}분</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>문제: {exam.questions}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>합격선: {exam.passingScore}점</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  시험 시작
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (examState === 'taking') {
    const question = examQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 진행 상황 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">
                문제 {currentQuestion + 1} / {examQuestions.length}
              </span>
              <span className="text-amber-400 font-semibold">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 문제 */}
          <Card className="p-8 bg-slate-800 border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {question.question}
            </h2>

            {question.type === 'multiple_choice' && (
              <RadioGroup value={answers[currentQuestion] || ''} onValueChange={handleAnswerChange}>
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerChange(option)}
                      className={`w-full flex items-center space-x-4 p-3 rounded-lg transition cursor-pointer border-2 ${
                        answers[currentQuestion] === option
                          ? 'bg-amber-500/20 border-amber-400'
                          : 'bg-slate-700/50 border-transparent hover:bg-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${idx}`} className="flex-shrink-0 w-6 h-6" />
                      <Label htmlFor={`option-${idx}`} className="text-white cursor-pointer flex-1 text-2xl font-semibold m-0">
                        {idx + 1}. {option}
                      </Label>
                    </button>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === 'short_answer' && (
              <Textarea
                placeholder="답변을 입력하세요..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                rows={6}
              />
            )}
          </Card>

          {/* 네비게이션 */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-amber-500/30 text-amber-400"
            >
              이전
            </Button>

            <div className="flex gap-4">
              {currentQuestion === examQuestions.length - 1 ? (
                <Button
                  onClick={handleSubmitExam}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  제출
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8"
                >
                  다음
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (examState === 'result') {
    const passed = score >= 75;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 flex items-center">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <Card className="p-12 bg-slate-800 border-slate-700 text-center">
            <div className="mb-6">
              {passed ? (
                <Trophy className="w-24 h-24 text-amber-400 mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
              )}
            </div>

            <h2 className={`text-4xl font-bold mb-4 ${passed ? 'text-amber-400' : 'text-red-400'}`}>
              {passed ? '축하합니다!' : '재응시 필요'}
            </h2>

            <p className="text-gray-300 mb-8 text-lg">
              {passed
                ? '실기시험에 합격하셨습니다. 자격증 발급 절차가 진행됩니다.'
                : '죄송합니다. 합격선에 도달하지 못했습니다. 다시 응시해주세요.'}
            </p>

            <div className="bg-slate-700/50 p-8 rounded-lg mb-8">
              <div className="text-5xl font-bold text-amber-400 mb-2">
                {score}점
              </div>
              <p className="text-gray-400">합격선: 75점</p>
            </div>

            <div className="space-y-3 mb-8 text-gray-300">
              <p>정답: {Object.keys(answers).length}개 중 {Object.values(answers).filter((a, idx) => a === examQuestions[idx]?.correctAnswer).length}개</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleBackToList}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8"
              >
                시험 목록으로
              </Button>
              {!passed && (
                <Button
                  onClick={() => setExamState('list')}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 px-8"
                >
                  재응시
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ExamData {
  title: string;
  level: string;
  description: string;
  questions: Question[];
}

export default function ExamPracticeBook() {
  const [, navigate] = useLocation();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 3;

  // 과목별 문제집 데이터
  const examBooks: Record<string, ExamData> = {
    beginner: {
      title: '기초 양자요법 이론',
      level: 'beginner',
      description: '양자요법의 기본 이론과 원리를 이해하는 문제집',
      questions: [
        {
          id: 1,
          question: '양자에너지의 기본 원리는 무엇인가?',
          options: [
            '물질의 파동성과 입자성',
            '중력의 작용',
            '화학 반응',
            '열의 전달'
          ],
          correctAnswer: '물질의 파동성과 입자성',
          explanation: '양자에너지는 물질의 파동성과 입자성의 이중성을 기반으로 합니다.'
        },
        {
          id: 2,
          question: '양자요법 치료 시 가장 중요한 요소는?',
          options: [
            '환자의 신뢰도',
            '에너지의 주파수 조정',
            '치료사의 경험',
            '치료 시간'
          ],
          correctAnswer: '에너지의 주파수 조정',
          explanation: '정확한 주파수 조정이 세포의 진동 상태를 조정하는 핵심입니다.'
        },
        {
          id: 3,
          question: '다음 중 양자요법의 장점을 모두 고르시오',
          options: [
            '부작용이 적고 자연친화적',
            '빠른 효과',
            '모든 질병에 효과',
            '비용이 저렴'
          ],
          correctAnswer: '부작용이 적고 자연친화적',
          explanation: '양자요법은 자연 에너지를 활용하여 부작용이 적은 치료법입니다.'
        },
        {
          id: 4,
          question: '양자요법에서 에너지 주파수의 역할은?',
          options: [
            '세포의 진동 상태를 조정하여 자가 치유력 활성화',
            '단순히 체온을 높이는 것',
            '신경을 마비시키는 것',
            '혈액 순환만 개선'
          ],
          correctAnswer: '세포의 진동 상태를 조정하여 자가 치유력 활성화',
          explanation: '주파수는 세포 수준에서 자가 치유 메커니즘을 활성화합니다.'
        },
        {
          id: 5,
          question: '양자요법 치료 시 피해야 할 행동은?',
          options: [
            '환자와의 신뢰 구축',
            '치료 중 부정적 생각이나 의심',
            '정확한 기록 유지',
            '지속적인 모니터링'
          ],
          correctAnswer: '치료 중 부정적 생각이나 의심',
          explanation: '부정적 에너지는 치료 효과를 방해할 수 있습니다.'
        },
        {
          id: 6,
          question: '양자요법의 과학적 근거는 무엇인가?',
          options: [
            '양자역학과 생물물리학',
            '고전 물리학만 적용',
            '종교적 신념',
            '경험적 추측'
          ],
          correctAnswer: '양자역학과 생물물리학',
          explanation: '양자요법은 현대 물리학의 양자역학 원리에 기반합니다.'
        },
        {
          id: 7,
          question: '양자요법 관리사의 윤리 기준으로 가장 중요한 것은?',
          options: [
            '환자의 개인정보 보호와 신뢰 유지',
            '치료비 최대화',
            '자신의 이익 우선',
            '치료 결과 과장 광고'
          ],
          correctAnswer: '환자의 개인정보 보호와 신뢰 유지',
          explanation: '환자의 신뢰와 개인정보 보호는 전문가의 기본 윤리입니다.'
        },
        {
          id: 8,
          question: '양자요법에서 환자 상담 시 포함되어야 할 내용은?',
          options: [
            '증상, 병력, 생활습관, 기대 효과 등 종합 상담',
            '증상만 간단히 확인',
            '의료 진단',
            '약물 처방'
          ],
          correctAnswer: '증상, 병력, 생활습관, 기대 효과 등 종합 상담',
          explanation: '종합적인 상담을 통해 맞춤형 치료 계획을 수립합니다.'
        },
        {
          id: 9,
          question: '양자요법 치료 후 관리에서 중요한 것은?',
          options: [
            '치료 후 반응 관찰, 추후 관리 계획 수립, 정기적 재평가',
            '한 번의 치료로 완료',
            '환자 추적 없음',
            '비용 청구만 중요'
          ],
          correctAnswer: '치료 후 반응 관찰, 추후 관리 계획 수립, 정기적 재평가',
          explanation: '지속적인 관리와 재평가를 통해 치료 효과를 극대화합니다.'
        }
      ]
    },
    intermediate: {
      title: '중급 양자에너지 치료',
      level: 'intermediate',
      description: '양자에너지를 활용한 실제 치료 방법',
      questions: [
        {
          id: 1,
          question: '양자에너지 치료의 메커니즘은?',
          options: [
            '세포 수준의 에너지 재조정',
            '단순 마사지 효과',
            '약물 투여',
            '수술적 개입'
          ],
          correctAnswer: '세포 수준의 에너지 재조정',
          explanation: '양자에너지는 세포의 미세한 에너지 상태를 조정합니다.'
        },
        {
          id: 2,
          question: '치료 시 주파수 설정의 중요성은?',
          options: [
            '각 질환과 개인에 맞는 최적 주파수 선택',
            '모든 환자에 동일한 주파수 사용',
            '주파수는 중요하지 않음',
            '높을수록 좋음'
          ],
          correctAnswer: '각 질환과 개인에 맞는 최적 주파수 선택',
          explanation: '개인화된 주파수 설정이 치료 효과를 결정합니다.'
        },
        {
          id: 3,
          question: '만성질환 치료에서 양자요법의 역할은?',
          options: [
            '근본적인 에너지 불균형 개선',
            '증상 완화만 가능',
            '효과 없음',
            '일시적 완화만 가능'
          ],
          correctAnswer: '근본적인 에너지 불균형 개선',
          explanation: '양자요법은 질병의 근본 원인인 에너지 불균형을 개선합니다.'
        },
        {
          id: 4,
          question: '치료 중 환자의 반응 모니터링 방법은?',
          options: [
            '신체 신호, 에너지 변화, 증상 변화 종합 관찰',
            '환자의 말만 듣기',
            '모니터링 불필요',
            '한 가지 지표만 확인'
          ],
          correctAnswer: '신체 신호, 에너지 변화, 증상 변화 종합 관찰',
          explanation: '다각적인 모니터링을 통해 치료 진행 상황을 파악합니다.'
        },
        {
          id: 5,
          question: '양자요법과 다른 치료법의 병행 시 주의사항은?',
          options: [
            '상호작용 확인 및 치료 간격 조정',
            '동시 진행 가능',
            '주의사항 없음',
            '약물과 함께 사용 금지'
          ],
          correctAnswer: '상호작용 확인 및 치료 간격 조정',
          explanation: '다른 치료법과의 상호작용을 고려한 계획이 필요합니다.'
        },
        {
          id: 6,
          question: '치료 효과 평가의 기준은?',
          options: [
            '증상 개선, 에너지 수준 향상, 삶의 질 개선',
            '치료 횟수만 중요',
            '비용 투자 정도',
            '환자의 주관적 느낌만'
          ],
          correctAnswer: '증상 개선, 에너지 수준 향상, 삶의 질 개선',
          explanation: '다각적인 지표를 통해 객관적으로 효과를 평가합니다.'
        },
        {
          id: 7,
          question: '장기 치료 계획 수립 시 고려사항은?',
          options: [
            '초기 상태, 목표, 개인 특성, 생활 환경',
            '비용만 고려',
            '치료사의 편의만 고려',
            '환자의 의견 무시'
          ],
          correctAnswer: '초기 상태, 목표, 개인 특성, 생활 환경',
          explanation: '종합적인 정보를 바탕으로 맞춤형 계획을 수립합니다.'
        },
        {
          id: 8,
          question: '응급 상황 발생 시 대응 절차는?',
          options: [
            '즉시 중단, 의료 전문가 연락, 상황 기록',
            '계속 치료 진행',
            '무시하고 진행',
            '나중에 보고'
          ],
          correctAnswer: '즉시 중단, 의료 전문가 연락, 상황 기록',
          explanation: '환자 안전이 최우선이며 즉각적인 대응이 필요합니다.'
        },
        {
          id: 9,
          question: '치료 기록 관리의 중요성은?',
          options: [
            '법적 책임, 치료 효과 추적, 개선 방향 파악',
            '기록 불필요',
            '기억만으로 충분',
            '보안 위험'
          ],
          correctAnswer: '법적 책임, 치료 효과 추적, 개선 방향 파악',
          explanation: '정확한 기록은 전문성과 책임감의 증거입니다.'
        }
      ]
    },
    advanced: {
      title: '고급 양자요법 전문가',
      level: 'advanced',
      description: '양자요법 전문가 자격증 시험',
      questions: [
        {
          id: 1,
          question: '양자 얽힘(Quantum Entanglement)이 생물 시스템에 미치는 영향은?',
          options: [
            '세포 간 정보 전달 및 에너지 동기화',
            '영향 없음',
            '부정적 영향만',
            '이론일 뿐 실제 적용 불가'
          ],
          correctAnswer: '세포 간 정보 전달 및 에너지 동기화',
          explanation: '양자 얽힘은 생체 시스템의 정보 전달 메커니즘입니다.'
        },
        {
          id: 2,
          question: '복합 질환 치료 시 다층적 접근의 필요성은?',
          options: [
            '신체, 정신, 에너지 수준의 통합 치료',
            '단일 접근만 필요',
            '약물 치료만 필요',
            '심리 치료만 필요'
          ],
          correctAnswer: '신체, 정신, 에너지 수준의 통합 치료',
          explanation: '복합 질환은 다층적이고 통합적인 접근이 필수입니다.'
        },
        {
          id: 3,
          question: '개인 맞춤형 치료 프로토콜 개발 절차는?',
          options: [
            '진단, 에너지 분석, 목표 설정, 치료 계획 수립',
            '표준 프로토콜만 사용',
            '환자 의견 무시',
            '시행착오 반복'
          ],
          correctAnswer: '진단, 에너지 분석, 목표 설정, 치료 계획 수립',
          explanation: '과학적이고 체계적인 절차를 통해 최적의 결과를 도출합니다.'
        },
        {
          id: 4,
          question: '치료 저항성 환자의 원인 분석 방법은?',
          options: [
            '에너지 블로케이드, 심리적 저항, 환경 요인 종합 분석',
            '환자 탓만 함',
            '분석 불필요',
            '다른 치료법으로 즉시 변경'
          ],
          correctAnswer: '에너지 블로케이드, 심리적 저항, 환경 요인 종합 분석',
          explanation: '다각적인 분석을 통해 근본 원인을 파악합니다.'
        },
        {
          id: 5,
          question: '신경생물학과 양자요법의 통합 이해는?',
          options: [
            '신경계의 양자적 특성 활용한 치료',
            '관련 없음',
            '상충됨',
            '이론만 존재'
          ],
          correctAnswer: '신경계의 양자적 특성 활용한 치료',
          explanation: '신경계는 양자 수준에서 작동하는 복잡한 시스템입니다.'
        },
        {
          id: 6,
          question: '치료 효과의 생물물리학적 메커니즘 설명 능력은?',
          options: [
            '세포 수준의 에너지 변화 과정 설명 가능',
            '설명 불필요',
            '경험적 설명만 가능',
            '과학적 설명 불가능'
          ],
          correctAnswer: '세포 수준의 에너지 변화 과정 설명 가능',
          explanation: '전문가는 과학적 메커니즘을 명확히 설명할 수 있어야 합니다.'
        },
        {
          id: 7,
          question: '연구 기반 치료 개선 방법론은?',
          options: [
            '임상 데이터 수집, 분석, 프로토콜 개선',
            '고정된 방법만 사용',
            '연구 불필요',
            '직관만 신뢰'
          ],
          correctAnswer: '임상 데이터 수집, 분석, 프로토콜 개선',
          explanation: '지속적인 연구와 개선이 전문성의 증거입니다.'
        },
        {
          id: 8,
          question: '전문가의 지속적 교육 필요성은?',
          options: [
            '최신 이론, 기술, 윤리 기준 습득 필수',
            '초기 교육만 충분',
            '교육 불필요',
            '경험만 중요'
          ],
          correctAnswer: '최신 이론, 기술, 윤리 기준 습득 필수',
          explanation: '전문가는 지속적인 학습과 발전을 추구해야 합니다.'
        },
        {
          id: 9,
          question: '양자요법의 미래 발전 방향은?',
          options: [
            '기술 진화, 임상 근거 확대, 통합 의학 활성화',
            '정체될 것',
            '사라질 것',
            '한계만 있을 것'
          ],
          correctAnswer: '기술 진화, 임상 근거 확대, 통합 의학 활성화',
          explanation: '양자요법은 지속적으로 발전하고 있는 분야입니다.'
        }
      ]
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    if (!selectedExam) return;
    const exam = examBooks[selectedExam];
    const htmlContent = generateHTMLContent(exam);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exam.title}.html`;
    a.click();
  };

  const generateHTMLContent = (exam: ExamData) => {
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${exam.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            color: #333;
            background: #f5f5f5;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #fbbf24;
            padding: 40px;
            border-radius: 8px;
            margin-bottom: 40px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.1em; opacity: 0.9; }
        .question-item {
            background: white;
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 8px;
            border-left: 4px solid #fbbf24;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        .question-number {
            color: #fbbf24;
            font-weight: bold;
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        .question-text {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1e293b;
        }
        .options {
            margin-bottom: 20px;
        }
        .option {
            padding: 12px;
            margin-bottom: 10px;
            background: #f1f5f9;
            border-radius: 6px;
            border-left: 3px solid #cbd5e1;
            cursor: pointer;
            transition: all 0.3s;
        }
        .option:hover {
            background: #e2e8f0;
            border-left-color: #fbbf24;
        }
        .option-label {
            font-weight: 500;
            color: #475569;
        }
        .correct-answer {
            margin-top: 15px;
            padding: 12px;
            background: #dcfce7;
            border-left: 3px solid #22c55e;
            border-radius: 6px;
        }
        .correct-answer-label {
            font-weight: 600;
            color: #166534;
            margin-bottom: 5px;
        }
        .explanation {
            margin-top: 15px;
            padding: 12px;
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            border-radius: 6px;
        }
        .explanation-label {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9em;
        }
        @media print {
            body { background: white; }
            .container { padding: 20px; }
            .question-item { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${exam.title}</h1>
            <p>${exam.description}</p>
        </div>
        
        ${exam.questions.map((q, idx) => `
        <div class="question-item">
            <div class="question-number">문제 ${idx + 1}</div>
            <div class="question-text">${q.question}</div>
            <div class="options">
                ${q.options.map((opt, optIdx) => `
                <div class="option">
                    <span class="option-label">① ② ③ ④</span>
                    ${String.fromCharCode(64 + optIdx + 1)}. ${opt}
                </div>
                `).join('')}
            </div>
            <div class="correct-answer">
                <div class="correct-answer-label">✓ 정답: ${q.correctAnswer}</div>
            </div>
            ${q.explanation ? `
            <div class="explanation">
                <div class="explanation-label">💡 해설</div>
                <div>${q.explanation}</div>
            </div>
            ` : ''}
        </div>
        `).join('')}
        
        <div class="footer">
            <p>© 2026 장•부 양자요법 관리사 협회 | 모든 권리 보유</p>
            <p>인쇄 날짜: ${new Date().toLocaleDateString('ko-KR')}</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">과목별 문제집</h1>
            <p className="text-gray-300 text-lg">
              브라우저에서 바로 확인하고 인쇄할 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(examBooks).map(([key, exam]) => (
              <Card
                key={key}
                className="p-6 bg-slate-800 border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                onClick={() => setSelectedExam(key)}
              >
                <h3 className="text-2xl font-bold text-white mb-3">
                  {exam.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {exam.description}
                </p>
                <div className="text-amber-400 font-semibold">
                  {exam.questions.length}개 문제
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const exam = examBooks[selectedExam];
  const totalPages = Math.ceil(exam.questions.length / questionsPerPage);
  const startIdx = currentPage * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const currentQuestions = exam.questions.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 mb-8 border border-amber-500/20">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">
            {exam.title}
          </h1>
          <p className="text-gray-300 mb-4">
            {exam.description}
          </p>
          <div className="text-gray-400 text-sm">
            전체 {exam.questions.length}개 문제 | 페이지 {currentPage + 1}/{totalPages}
          </div>
        </div>

        {/* 문제 표시 */}
        <div className="space-y-6 mb-8">
          {currentQuestions.map((question, idx) => (
            <Card
              key={question.id}
              className="p-6 bg-slate-800 border-slate-700"
            >
              <div className="mb-4">
                <span className="text-amber-400 font-bold text-lg">
                  문제 {startIdx + idx + 1}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">
                {question.question}
              </h3>

              <div className="space-y-3 mb-6">
                {question.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-amber-500/50 transition"
                  >
                    <span className="text-amber-400 font-semibold mr-2">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="text-gray-300">{option}</span>
                  </div>
                ))}
              </div>

              {/* 정답 */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-semibold mb-1">✓ 정답</p>
                <p className="text-green-300">{question.correctAnswer}</p>
              </div>

              {/* 해설 */}
              {question.explanation && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-400 font-semibold mb-1">💡 해설</p>
                  <p className="text-amber-100">{question.explanation}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            이전
          </Button>

          <span className="text-gray-300">
            페이지 {currentPage + 1} / {totalPages}
          </span>

          <Button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            다음
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            인쇄하기
          </Button>
          <Button
            onClick={handleDownloadHTML}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            HTML 다운로드
          </Button>
          <Button
            onClick={() => setSelectedExam(null)}
            variant="outline"
            className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

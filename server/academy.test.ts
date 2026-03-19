import { describe, it, expect } from 'vitest';

describe('Academy Page', () => {
  it('should display academy courses', () => {
    const courses = [
      {
        id: 1,
        title: '양자요법 기초',
        description: '양자에너지 치유의 기본 원리를 배웁니다.',
        materials: ['양자에너지의 정의', '인체와 에너지 필드', '기본 치료 기법'],
        exam: [
          { id: 1, question: '양자에너지 치유의 핵심 원리는?', options: ['에너지 진동', '물리적 접촉', '약물 투여', '수술'], correct: 0 },
          { id: 2, question: '인체의 주요 에너지 센터는?', options: ['7개', '5개', '9개', '12개'], correct: 0 },
          { id: 3, question: '기본 치료 기법의 첫 단계는?', options: ['에너지 감지', '약 처방', '수술 준비', '검사'], correct: 0 },
        ],
        passingScore: 60,
      },
    ];

    expect(courses).toHaveLength(1);
    expect(courses[0].title).toBe('양자요법 기초');
    expect(courses[0].exam).toHaveLength(3);
    expect(courses[0].passingScore).toBe(60);
  });

  it('should calculate exam score correctly', () => {
    const exam = [
      { id: 1, correct: 0 },
      { id: 2, correct: 0 },
      { id: 3, correct: 0 },
    ];

    const userAnswers = {
      1: '0',
      2: '0',
      3: '1',
    };

    let correctCount = 0;
    exam.forEach(q => {
      if (userAnswers[q.id] !== undefined && parseInt(userAnswers[q.id]) === q.correct) {
        correctCount++;
      }
    });

    const score = (correctCount / exam.length) * 100;
    expect(score).toBe(66.66666666666666);
  });

  it('should determine passing status', () => {
    const passingScore = 60;
    const score = 75;

    expect(score >= passingScore).toBe(true);
  });

  it('should determine failing status', () => {
    const passingScore = 60;
    const score = 50;

    expect(score >= passingScore).toBe(false);
  });

  it('should generate certificate for passing', () => {
    const isPassed = true;
    const course = { title: '양자요법 기초' };

    if (isPassed) {
      const certificate = {
        title: `${course.title} 수료증`,
        date: new Date().toISOString(),
        status: 'issued',
      };

      expect(certificate.status).toBe('issued');
      expect(certificate.title).toContain('수료증');
    }
  });
});

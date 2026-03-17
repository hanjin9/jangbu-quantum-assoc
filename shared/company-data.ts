/**
 * 장•부 양자요법 관리사 협회 공식 정보
 */

export const COMPANY_INFO = {
  name: "장•부 (양자요법) 관리사 협회",
  nameEn: "Jangbu Quantum Therapy Association",
  description: "최첨단 양자 에너지 치료로 몸과 마음의 완벽한 균형을 찾는 협회",
  founded: 2020,
  members: 250,
  email: "info@jangbu-quantum.kr",
  phone: "+82-2-6959-0123",
  address: "서울시 강남구 테헤란로 123, 양자웰니스센터 5층",
  website: "www.jangbu-quantum.kr",
  socialMedia: {
    facebook: "https://facebook.com/jangbuquantum",
    instagram: "https://instagram.com/jangbuquantum",
    linkedin: "https://linkedin.com/company/jangbu-quantum"
  }
};

export const ABOUT_CONTENT = {
  title: "양자요법이란?",
  description: "양자요법은 최신 양자 물리학 원리를 기반으로 한 혁신적인 에너지 치료법입니다.",
  longDescription: `양자요법은 양자 물리학의 원리를 의료 분야에 적용한 최첨단 치료 방법입니다. 
  신체의 에너지 장(Biofield)을 감지하고 최적화하여 자연 치유력을 극대화합니다.
  
  우리 협회는 국제 표준에 따라 인증된 전문 관리사들로 구성되어 있으며, 
  개인맞춤형 양자 치료 프로토콜을 제공합니다.
  
  양자요법의 효과:
  • 신체 에너지 균형 회복
  • 만성 통증 완화
  • 스트레스 및 불안 감소
  • 면역력 강화
  • 수면의 질 개선
  • 전반적인 웰니스 증진`,
  certifications: [
    "국제 양자 치료 협회(IQTA) 인증",
    "한국 대체의학 협회 정회원",
    "ISO 9001 품질 관리 인증"
  ]
};

export const PRACTITIONERS = [
  {
    id: 1,
    name: "박지현",
    title: "협회 회장 & 수석 관리사",
    specialty: "양자 에너지 밸런싱",
    experience: 15,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/practitioner-1-avatar.webp",
    bio: "15년 이상의 양자 치료 경험으로 수천 명의 환자를 성공적으로 치료했습니다.",
    certifications: ["IQTA Master Practitioner", "양자 물리학 박사"]
  },
  {
    id: 2,
    name: "김준호",
    title: "수석 치료사",
    specialty: "만성 통증 치료",
    experience: 12,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/practitioner-2-avatar.webp",
    bio: "만성 통증 환자 전문으로 95% 이상의 만족도를 기록하고 있습니다.",
    certifications: ["IQTA Certified Practitioner", "통증 관리 전문가"]
  },
  {
    id: 3,
    name: "이수진",
    title: "웰니스 상담사",
    specialty: "스트레스 관리 & 정서 치료",
    experience: 10,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/practitioner-3-avatar.webp",
    bio: "심신 균형을 위한 맞춤형 웰니스 프로그램을 개발하고 제공합니다.",
    certifications: ["IQTA Certified Wellness Consultant", "심리 상담사"]
  },
  {
    id: 4,
    name: "최민준",
    title: "그룹 세션 강사",
    specialty: "집단 에너지 치료",
    experience: 8,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/practitioner-4-avatar.webp",
    bio: "그룹 세션을 통해 참가자들의 공동 에너지 장을 최적화합니다.",
    certifications: ["IQTA Group Facilitator", "에너지 치료 전문가"]
  }
];

export const SERVICES = [
  {
    id: "energy-balancing",
    name: "에너지 밸런싱",
    description: "신체 에너지 장의 불균형을 감지하고 최적화하는 치료",
    duration: "60분",
    price: 150,
    benefits: ["에너지 흐름 정상화", "신체 불편함 완화", "정신 집중력 향상"]
  },
  {
    id: "wellness-consultation",
    name: "웰니스 상담",
    description: "개인의 건강 상태에 맞춘 맞춤형 웰니스 프로그램",
    duration: "90분",
    price: 200,
    benefits: ["개인 맞춤형 계획", "생활 습관 개선", "장기 건강 관리"]
  },
  {
    id: "group-session",
    name: "그룹 세션",
    description: "공동의 목표를 가진 그룹을 위한 집단 치료 프로그램",
    duration: "120분",
    price: 50,
    benefits: ["공동 에너지 증진", "커뮤니티 형성", "비용 효율성"]
  },
  {
    id: "intensive-retreat",
    name: "집중 웰니스 리트릿",
    description: "3일간의 집중 양자 치료 및 웰니스 프로그램",
    duration: "3일",
    price: 1500,
    benefits: ["심층 치료", "생활 방식 전환", "완전한 재생"]
  }
];

export const TESTIMONIALS = [
  {
    name: "이영미",
    age: 42,
    condition: "만성 요통",
    result: "6개월 치료 후 90% 통증 감소",
    quote: "20년간 앓던 요통이 양자 치료로 완화되었습니다. 정말 감사합니다!"
  },
  {
    name: "김태호",
    age: 35,
    condition: "스트레스 & 불면증",
    result: "3개월 후 정상 수면 회복",
    quote: "업무 스트레스로 고생했는데, 이제는 숙면을 취합니다."
  },
  {
    name: "박수진",
    age: 58,
    condition: "만성 피로",
    result: "에너지 수준 70% 향상",
    quote: "다시 활기찬 생활을 할 수 있게 되었습니다."
  },
  {
    name: "정현우",
    age: 28,
    condition: "운동 부상 회복",
    result: "4주 후 완전 회복",
    quote: "운동 선수들도 많이 찾는 치료법입니다."
  }
];

export const FAQ = [
  {
    question: "양자요법은 과학적으로 입증되었나요?",
    answer: "네, 양자요법은 양자 물리학 원리에 기반하며, 많은 임상 연구와 사례 보고가 있습니다. 우리 협회의 모든 관리사는 국제 인증을 받았습니다."
  },
  {
    question: "부작용이 있나요?",
    answer: "양자요법은 비침습적이고 안전한 치료법입니다. 부작용은 거의 없으며, 일부 환자는 초기에 가벼운 이완 반응을 경험할 수 있습니다."
  },
  {
    question: "얼마나 자주 치료를 받아야 하나요?",
    answer: "개인의 상태에 따라 다릅니다. 일반적으로 주 1-2회 치료를 권장하며, 상담 후 맞춤형 계획을 수립합니다."
  },
  {
    question: "보험 적용이 되나요?",
    answer: "현재 일부 민간 건강보험에서 대체의학 치료를 지원합니다. 자세한 내용은 문의해주세요."
  },
  {
    question: "온라인 상담도 가능한가요?",
    answer: "네, 초기 상담은 온라인으로 가능합니다. 다만 실제 치료는 센터 방문이 필요합니다."
  }
];

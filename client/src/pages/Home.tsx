import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Heart, Zap, Users, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/logo-jangbu-quantum-n3qap7ovY3jWLvdsE7qXYB.webp";
const HERO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-wellness-6axHUfUtzzm7yj6XrwXh93.webp";
const ABOUT_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/section-about-quantum-RanunNKBVa3WzhHiis6bRh.webp";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const membershipTiers = [
    {
      name: "Silver Wellness",
      price: "$299",
      period: "/month",
      description: "Basic quantum therapy access",
      features: ["Basic quantum sessions", "Monthly newsletter", "Community access", "Email support"],
      highlighted: false
    },
    {
      name: "Gold Wellness",
      price: "$599",
      period: "/month",
      description: "Premium quantum therapy with personalized care",
      features: ["All Silver features", "Priority sessions", "Personalized plan", "Monthly consultation", "Priority support"],
      highlighted: true
    },
    {
      name: "Platinum Elite",
      price: "$999",
      period: "/month",
      description: "Ultimate quantum healing experience",
      features: ["All Gold features", "Unlimited sessions", "VIP lounge", "Weekly calls", "Dedicated manager", "24/7 support"],
      highlighted: false
    },
    {
      name: "Diamond Quantum",
      price: "$1,999",
      period: "/month",
      description: "Exclusive quantum elite membership",
      features: ["All Platinum features", "Research access", "Private sessions", "Annual retreat", "Concierge service"],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <img src={LOGO_URL} alt="Jangbu Logo" className="h-10 w-10 rounded-full" />
              <span className="text-xl font-bold text-primary hidden sm:inline">장•부 협회</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-foreground hover:text-primary transition-colors">소개</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">서비스</a>
              <a href="#membership" className="text-foreground hover:text-primary transition-colors">멤버십</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">문의</a>
              <Button className="btn-accent">시작하기</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
              <a href="#about" className="block text-foreground hover:text-primary transition-colors">소개</a>
              <a href="#services" className="block text-foreground hover:text-primary transition-colors">서비스</a>
              <a href="#membership" className="block text-foreground hover:text-primary transition-colors">멤버십</a>
              <a href="#contact" className="block text-foreground hover:text-primary transition-colors">문의</a>
              <Button className="btn-accent w-full">시작하기</Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img 
          src={HERO_URL} 
          alt="Quantum Wellness" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            양자요법으로 시작하는 웰니스
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            최첨단 양자 에너지 치료로 몸과 마음의 완벽한 균형을 찾으세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button className="btn-accent text-lg px-8 py-6">지금 시작하기</Button>
            <Button variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
              더 알아보기
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-primary">
                양자요법이란?
              </h2>
              <p className="text-lg text-foreground/80 mb-4">
                양자요법은 최신 양자 물리학 원리를 기반으로 한 혁신적인 에너지 치료법입니다. 
                신체의 에너지 장을 최적화하여 자연 치유력을 극대화합니다.
              </p>
              <p className="text-lg text-foreground/80 mb-6">
                우리 협회는 국제 표준에 따라 인증된 전문 관리사들로 구성되어 있으며, 
                개인맞춤형 양자 치료 프로토콜을 제공합니다.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent" size={24} />
                  <span className="text-foreground">과학 기반의 치료법</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent" size={24} />
                  <span className="text-foreground">인증된 전문 관리사</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent" size={24} />
                  <span className="text-foreground">개인맞춤형 프로토콜</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img src={ABOUT_URL} alt="Quantum Therapy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">우리의 서비스</h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            전문 관리사들이 제공하는 다양한 양자 치료 서비스
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-accent" size={32} />,
                title: "에너지 밸런싱",
                description: "신체 에너지 장의 불균형을 감지하고 최적화하는 치료"
              },
              {
                icon: <Heart className="text-accent" size={32} />,
                title: "웰니스 상담",
                description: "개인의 건강 상태에 맞춘 맞춤형 웰니스 프로그램"
              },
              {
                icon: <Users className="text-accent" size={32} />,
                title: "그룹 세션",
                description: "공동의 목표를 가진 그룹을 위한 집단 치료 프로그램"
              }
            ].map((service, idx) => (
              <Card key={idx} className="card-luxury card-hover">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">멤버십 플랜</h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            당신의 웰니스 목표에 맞는 완벽한 플랜을 선택하세요
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {membershipTiers.map((tier, idx) => (
              <Card 
                key={idx} 
                className={`card-luxury card-hover transition-all ${
                  tier.highlighted ? 'ring-2 ring-accent md:scale-105' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-primary">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-accent">{tier.price}</span>
                    <span className="text-foreground/60">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="btn-primary w-full">
                    선택하기
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">특별 오퍼</h3>
            <p className="mb-4">첫 달 50% 할인 + 무료 초기 상담</p>
            <Button className="bg-accent text-primary hover:bg-accent/90">
              지금 가입하기
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">문의하기</h2>
          <p className="text-center text-foreground/70 mb-12">
            더 자세한 정보가 필요하신가요? 우리 팀에 연락하세요.
          </p>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>연락처</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">이메일</h4>
                <p className="text-foreground/70">info@jangbu-quantum.kr</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">전화</h4>
                <p className="text-foreground/70">+82-2-XXXX-XXXX</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">주소</h4>
                <p className="text-foreground/70">서울시 강남구 테헤란로 123</p>
              </div>
              <Button className="btn-accent w-full">
                무료 상담 예약
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">회사</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition">소개</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">팀</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">경력</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">서비스</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition">치료</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">상담</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">교육</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">리소스</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition">블로그</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">뉴스레터</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">법률</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition">개인정보</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">이용약관</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition">쿠키</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-primary-foreground/80">
                © 2026 장•부 (양자요법) 관리사 협회. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Facebook</a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Instagram</a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Award, Users, Zap } from 'lucide-react';
import { COMPANY_INFO, ABOUT_CONTENT, PRACTITIONERS, TESTIMONIALS, FAQ } from '@shared/company-data';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{COMPANY_INFO.name}</h1>
          <p className="text-xl text-white/90">{COMPANY_INFO.description}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-primary mb-6">{ABOUT_CONTENT.title}</h2>
          <div className="prose prose-lg max-w-none mb-12">
            {ABOUT_CONTENT.longDescription.split('\n').map((para, idx) => (
              <p key={idx} className="text-foreground/80 mb-4 whitespace-pre-wrap">
                {para}
              </p>
            ))}
          </div>

          {/* Certifications */}
          <div className="grid md:grid-cols-3 gap-6">
            {ABOUT_CONTENT.certifications.map((cert, idx) => (
              <Card key={idx} className="card-luxury">
                <CardContent className="pt-6">
                  <Award className="text-accent mb-4" size={32} />
                  <p className="font-semibold text-primary">{cert}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Practitioners Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">우리의 전문가</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {PRACTITIONERS.map((practitioner) => (
              <Card key={practitioner.id} className="card-luxury card-hover">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img 
                      src={practitioner.image} 
                      alt={practitioner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle>{practitioner.name}</CardTitle>
                      <CardDescription>{practitioner.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">전문 분야</p>
                    <p className="font-semibold">{practitioner.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">경력</p>
                    <p className="font-semibold">{practitioner.experience}년</p>
                  </div>
                  <p className="text-foreground/80">{practitioner.bio}</p>
                  <div>
                    <p className="text-sm text-foreground/70 mb-2">자격증</p>
                    <ul className="space-y-1">
                      {practitioner.certifications.map((cert, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-accent" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">고객 후기</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} className="card-luxury">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-foreground/70">{testimonial.age}세 • {testimonial.condition}</p>
                    <p className="text-sm text-accent font-semibold mt-2">{testimonial.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">자주 묻는 질문</h2>
          
          <div className="space-y-6">
            {FAQ.map((faq, idx) => (
              <Card key={idx} className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">연락처</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-white/80 mb-2">이메일</p>
              <p className="text-xl font-semibold">{COMPANY_INFO.email}</p>
            </div>
            <div>
              <p className="text-white/80 mb-2">전화</p>
              <p className="text-xl font-semibold">{COMPANY_INFO.phone}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white/80 mb-2">주소</p>
            <p className="text-lg">{COMPANY_INFO.address}</p>
          </div>

          <Button className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6">
            무료 상담 예약
          </Button>
        </div>
      </section>
    </div>
  );
}

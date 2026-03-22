import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Award } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  qualification: string[];
  experience: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: '박준호',
    position: '협회장',
    qualification: ['양자요법 국제 자격증', '의학박사', '대체의학 전문가'],
    experience: '25년',
    bio: '양자 에너지 치료법의 선구자로서 국내외 학술지에 50편 이상의 논문 발표',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_1_opening-C2BBqsUQXWUy4We9jL95Fx.webp',
    email: 'park.junho@jbrma.com',
    phone: '02-XXXX-XXXX',
  },
  {
    id: 2,
    name: '이미영',
    position: '부협회장',
    qualification: ['양자요법 마스터 자격증', '한의학박사', '심신의학 전문가'],
    experience: '20년',
    bio: '동양의학과 양자 기술을 결합한 통합 치료법 개발 및 교육',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_2_foundation-HVnTazWRWkLC2xt8ek98XP.webp',
    email: 'lee.miyoung@jbrma.com',
    phone: '02-XXXX-XXXX',
  },
  {
    id: 3,
    name: '김성철',
    position: '교육이사',
    qualification: ['양자요법 교육 전문가', '물리학박사', '교육학 석사'],
    experience: '18년',
    bio: '체계적인 양자요법 교육 커리큘럼 개발 및 1,000명 이상의 전문가 배출',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_3_benefits-ZSAKA7TF36HAYNGuycY3na.webp',
    email: 'kim.sungchul@jbrma.com',
    phone: '02-XXXX-XXXX',
  },
  {
    id: 4,
    name: '최혜진',
    position: '연구이사',
    qualification: ['양자 물리학 박사', '임상 연구 전문가', '국제 학술지 편집위원'],
    experience: '15년',
    bio: '양자요법의 과학적 근거 규명을 위한 임상 연구 주도 및 국제 학술 활동',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/video_frame_4_vision-4PsYQAC52drY9mWjz5whud.webp',
    email: 'choi.hyejin@jbrma.com',
    phone: '02-XXXX-XXXX',
  },
];

export default function TeamProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            협회 임원진 및 전문가
          </h1>
          <p className="text-lg text-gray-300">
            양자요법 분야의 최고 전문가들이 함께합니다
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="bg-slate-800 border-yellow-400/20 overflow-hidden hover:border-yellow-400/40 transition-all">
              <div className="aspect-square overflow-hidden bg-slate-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-2xl text-yellow-400">{member.name}</CardTitle>
                    <CardDescription className="text-lg text-yellow-300 font-semibold">
                      {member.position}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-gray-300 leading-relaxed">{member.bio}</p>

                {/* Experience */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">경력: {member.experience}</span>
                </div>

                {/* Qualifications */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 font-semibold">자격 및 경력</p>
                  <div className="flex flex-wrap gap-2">
                    {member.qualification.map((qual, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Mail className="w-4 h-4 text-yellow-400" />
                    <a href={`mailto:${member.email}`} className="hover:text-yellow-400 transition-colors">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone className="w-4 h-4 text-yellow-400" />
                    <a href={`tel:${member.phone}`} className="hover:text-yellow-400 transition-colors">
                      {member.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

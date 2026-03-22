import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

interface FeedbackItem {
  id: number;
  type: 'lecture' | 'consultation';
  title: string;
  rating: number;
  satisfaction: number;
  comment: string;
  date: string;
  categories: {
    content: number;
    instructor: number;
    materials: number;
    pace: number;
  };
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: 1,
    type: 'lecture',
    title: '기초 양자요법 입문',
    rating: 5,
    satisfaction: 5,
    comment: '매우 유익한 강의였습니다. 강사님의 설명이 명확하고 자료도 잘 정리되어 있었습니다.',
    date: '2026-03-15',
    categories: { content: 5, instructor: 5, materials: 5, pace: 4 },
  },
  {
    id: 2,
    type: 'consultation',
    title: '개인 맞춤 상담',
    rating: 5,
    satisfaction: 5,
    comment: '전문적인 상담을 받았습니다. 개인 상황에 맞는 조언을 주셔서 감사합니다.',
    date: '2026-03-10',
    categories: { content: 5, instructor: 5, materials: 4, pace: 5 },
  },
  {
    id: 3,
    type: 'lecture',
    title: '고급 에너지 치유법',
    rating: 4,
    satisfaction: 4,
    comment: '좋은 강의였습니다. 실습 시간이 조금 더 있으면 좋겠습니다.',
    date: '2026-03-05',
    categories: { content: 4, instructor: 5, materials: 4, pace: 3 },
  },
];

const stats: StatCard[] = [
  {
    label: '제출한 피드백',
    value: '23개',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'text-blue-400',
  },
  {
    label: '평균 만족도',
    value: '4.7/5.0',
    icon: <Star className="w-6 h-6" />,
    color: 'text-yellow-400',
  },
  {
    label: '평가 기여도',
    value: '상위 15%',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-green-400',
  },
  {
    label: '피드백 배지',
    value: '5개',
    icon: <Award className="w-6 h-6" />,
    color: 'text-purple-400',
  },
];

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">피드백 및 평가</h1>
          <p className="text-gray-400">강의와 상담에 대한 만족도를 평가하세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-slate-800 border-yellow-400/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feedback List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-yellow-400/20 mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-400">최근 피드백</CardTitle>
                <CardDescription className="text-gray-400">제출한 피드백 목록</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-yellow-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{item.title}</h3>
                          <Badge
                            className={`${
                              item.type === 'lecture'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {item.type === 'lecture' ? '강의' : '상담'}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2">{item.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Rating Distribution */}
            <Card className="bg-slate-800 border-yellow-400/20 mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-lg">평점 분포</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${(rating === 5 ? 60 : rating === 4 ? 30 : 10) * (rating / 5)}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-8 text-right">
                      {rating === 5 ? 12 : rating === 4 ? 8 : 3}명
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            {selectedFeedback && (
              <Card className="bg-slate-800 border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-lg">세부 평가</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedFeedback.categories).map(([category, rating]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300 text-sm capitalize">
                          {category === 'content'
                            ? '강의 내용'
                            : category === 'instructor'
                            ? '강사'
                            : category === 'materials'
                            ? '교재'
                            : '진행 속도'}
                        </span>
                        <span className="text-yellow-400 font-semibold">{rating}/5</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Pending Feedback */}
        <Card className="bg-slate-800 border-yellow-400/20 mt-8">
          <CardHeader>
            <CardTitle className="text-yellow-400">대기 중인 피드백</CardTitle>
            <CardDescription className="text-gray-400">완료한 강의/상담에 대한 피드백을 남겨주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: '강의', title: '심화 양자 에너지', date: '2026-03-20' },
                { type: '상담', title: '건강 상담', date: '2026-03-19' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-400 text-sm">{item.type}</p>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{item.date}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                    피드백 작성
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

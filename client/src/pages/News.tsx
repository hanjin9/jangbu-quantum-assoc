import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Bell, Calendar, Eye, ChevronRight } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    type: 'news',
    title: '장·부 양자요법 관리사 협회 공식 출범',
    summary: '장·부 양자요법 관리사 협회가 2026년 공식 출범하였습니다. 양자요법 분야의 전문 관리사 양성을 목표로 체계적인 교육 과정과 자격증 제도를 운영합니다.',
    date: '2026-05-01',
    views: 1240,
    tag: '협회 소식',
  },
  {
    id: 2,
    type: 'news',
    title: '2026년 상반기 양자요법 관리사 자격시험 일정 발표',
    summary: '2026년 상반기 자격시험이 6월 15일(토)에 온라인으로 진행됩니다. 기초·중급·고급 3단계 시험 모두 60점 이상 합격 기준이 적용됩니다. 응시 신청은 협회 홈페이지를 통해 가능합니다.',
    date: '2026-04-20',
    views: 876,
    tag: '시험 안내',
  },
  {
    id: 3,
    type: 'news',
    title: '온라인 심화 교육 과정 신규 개설',
    summary: '2026년 5월부터 온라인 심화 교육 과정이 신규 개설됩니다. 에너지 진단법, 치료 기법 심화, 임상 실습 등 총 6개 과목으로 구성되며, 24시간 언제든지 수강 가능합니다.',
    date: '2026-04-10',
    views: 654,
    tag: '교육 안내',
  },
];

const noticeItems = [
  {
    id: 1,
    type: 'notice',
    title: '[필독] 회원 가입 시 주의사항 및 약관 안내',
    summary: '회원 가입 시 반드시 본인 확인 절차를 완료해 주시기 바랍니다. 허위 정보 입력 시 자격증 발급이 제한될 수 있습니다.',
    date: '2026-05-10',
    views: 2103,
    tag: '필독 공지',
    important: true,
  },
  {
    id: 2,
    type: 'notice',
    title: '2026년 협회 운영 시간 및 상담 예약 안내',
    summary: '협회 온라인 상담은 평일 오전 9시 ~ 오후 6시에 운영됩니다. 상담 예약은 홈페이지 "상담 예약하기" 메뉴를 이용해 주세요.',
    date: '2026-05-05',
    views: 987,
    tag: '운영 안내',
    important: false,
  },
  {
    id: 3,
    type: 'notice',
    title: '자격증 발급 처리 기간 안내 (온라인: 즉시 / 오프라인: 7~14일)',
    summary: '온라인 자격증은 시험 합격 즉시 발급됩니다. 오프라인 실물 자격증은 신청 후 7~14일 이내 우편 발송됩니다.',
    date: '2026-04-28',
    views: 765,
    tag: '자격증 안내',
    important: false,
  },
];

export default function News() {
  const [activeTab, setActiveTab] = useState<'news' | 'notice'>('news');

  const items = activeTab === 'news' ? newsItems : noticeItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="w-7 h-7 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">소식</h1>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'news'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            뉴스
          </button>
          <button
            onClick={() => setActiveTab('notice')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'notice'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            공지사항
          </button>
        </div>

        {/* 목록 */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-800/80 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={`text-xs px-2 py-0.5 ${
                        (item as any).important
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                      variant="outline"
                    >
                      {item.tag}
                    </Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5" />
                </div>

                <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    조회 {item.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
          <p className="text-gray-400 text-sm">
            더 많은 소식은 순차적으로 업데이트 됩니다.
          </p>
          <p className="text-amber-400 text-xs mt-1">
            협회 공식 소식은 이 페이지에서 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

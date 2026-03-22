import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'notice' | 'event' | 'update' | 'urgent';
  author: string;
  date: string;
  viewCount: number;
  commentCount: number;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: '새로운 양자요법 강의 오픈',
    content: '새로운 고급 양자요법 강의가 오픈되었습니다. 전문가 이상의 회원만 수강 가능합니다.',
    category: 'event',
    author: '박준호 협회장',
    date: '2026-03-22',
    viewCount: 247,
    commentCount: 12,
  },
  {
    id: 2,
    title: '3월 협회 정기 회의 안내',
    content: '3월 협회 정기 회의가 개최됩니다. 모든 회원의 참석을 부탁드립니다.',
    category: 'notice',
    author: '박준호 협회장',
    date: '2026-03-20',
    viewCount: 189,
    commentCount: 8,
  },
  {
    id: 3,
    title: '시스템 업데이트 안내',
    content: '새로운 기능이 추가되었습니다. 더 나은 서비스를 위해 업데이트해주세요.',
    category: 'update',
    author: '시스템 관리자',
    date: '2026-03-18',
    viewCount: 156,
    commentCount: 5,
  },
  {
    id: 4,
    title: '⚠️ 긴급 공지사항',
    content: '서버 점검 예정: 2026-03-25 (22:00 ~ 23:00)',
    category: 'urgent',
    author: '시스템 관리자',
    date: '2026-03-17',
    viewCount: 423,
    commentCount: 34,
  },
];

const categoryConfig = {
  notice: { label: '공지', color: 'bg-blue-500/20 text-blue-300' },
  event: { label: '이벤트', color: 'bg-green-500/20 text-green-300' },
  update: { label: '업데이트', color: 'bg-purple-500/20 text-purple-300' },
  urgent: { label: '긴급', color: 'bg-red-500/20 text-red-300' },
};

export default function AnnouncementPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || ann.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">협회 공지사항</h1>
              <p className="text-gray-400">협회의 최신 소식을 확인하세요</p>
            </div>
            <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 gap-2">
              <Plus className="w-4 h-4" />
              공지사항 작성
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800 border-yellow-400/20 mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="공지사항 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  className={selectedCategory === null ? 'bg-yellow-400 text-slate-900' : ''}
                  onClick={() => setSelectedCategory(null)}
                >
                  전체
                </Button>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    className={selectedCategory === key ? 'bg-yellow-400 text-slate-900' : ''}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAnnouncements.map((ann) => (
              <Card
                key={ann.id}
                className="bg-slate-800 border-yellow-400/20 cursor-pointer hover:border-yellow-400 transition-all"
                onClick={() => setSelectedAnnouncement(ann)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryConfig[ann.category as keyof typeof categoryConfig].color}>
                          {categoryConfig[ann.category as keyof typeof categoryConfig].label}
                        </Badge>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ann.date}
                        </span>
                      </div>

                      <h3 className="text-white font-semibold mb-2 text-lg">{ann.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">{ann.content}</p>

                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {ann.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {ann.commentCount}
                        </span>
                        <span className="text-gray-500">작성자: {ann.author}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Selected Announcement Detail */}
          {selectedAnnouncement && (
            <div>
              <Card className="bg-slate-800 border-yellow-400/20 sticky top-32">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={categoryConfig[selectedAnnouncement.category as keyof typeof categoryConfig].color}>
                      {categoryConfig[selectedAnnouncement.category as keyof typeof categoryConfig].label}
                    </Badge>
                  </div>
                  <CardTitle className="text-yellow-400">{selectedAnnouncement.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedAnnouncement.author} · {selectedAnnouncement.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{selectedAnnouncement.content}</p>

                  <div className="border-t border-slate-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">조회수</span>
                      <span className="text-white font-semibold">{selectedAnnouncement.viewCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">댓글</span>
                      <span className="text-white font-semibold">{selectedAnnouncement.commentCount}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                    댓글 작성
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

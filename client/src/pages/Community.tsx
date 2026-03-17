import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Heart, Eye, Plus, Search } from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');

  // 게시판 샘플 데이터
  const posts = [
    {
      id: 1,
      category: 'notice',
      title: '2026년 1월 양자요법 자격증 시험 안내',
      author: '관리자',
      views: 234,
      likes: 45,
      comments: 12,
      date: '2026-03-18',
      content: '양자요법 자격증 시험이 다음 달에 예정되어 있습니다...'
    },
    {
      id: 2,
      category: 'qa',
      title: '양자에너지 치료 중 주의사항이 있나요?',
      author: '김민지',
      views: 156,
      likes: 28,
      comments: 8,
      date: '2026-03-17',
      content: '최근에 양자요법을 시작했는데...'
    },
    {
      id: 3,
      category: 'free',
      title: '저도 성공했어요! 건강이 많이 개선되었습니다',
      author: '이준호',
      views: 312,
      likes: 89,
      comments: 24,
      date: '2026-03-16',
      content: '3개월 전부터 양자요법을 받기 시작했는데...'
    }
  ];

  // 커뮤니티 그룹 샘플 데이터
  const communities = [
    {
      id: 1,
      name: 'VIP 라운지',
      description: '프리미엄 멤버 전용 커뮤니티',
      category: 'vip_lounge',
      members: 234,
      icon: '👑'
    },
    {
      id: 2,
      name: '학습 그룹',
      description: '양자요법 이론 및 실습 공유',
      category: 'study',
      members: 567,
      icon: '📚'
    },
    {
      id: 3,
      name: '경험 공유',
      description: '실제 치료 경험과 사례 공유',
      category: 'experience',
      members: 892,
      icon: '💡'
    }
  ];

  const categoryLabels = {
    notice: '공지사항',
    qa: '질문/답변',
    free: '자유게시판'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">커뮤니티</h1>
          <p className="text-gray-300 text-lg">
            양자요법 관리사들과 경험을 나누고 함께 성장하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-slate-800 border-b border-amber-500/20">
            <TabsTrigger 
              value="board"
              className="text-gray-300 data-[state=active]:text-amber-400 data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              게시판
            </TabsTrigger>
            <TabsTrigger 
              value="community"
              className="text-gray-300 data-[state=active]:text-amber-400 data-[state=active]:border-b-2 data-[state=active]:border-amber-500"
            >
              <Users className="w-4 h-4 mr-2" />
              커뮤니티 그룹
            </TabsTrigger>
          </TabsList>

          {/* 게시판 탭 */}
          <TabsContent value="board" className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                새 글 작성
              </Button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-6">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="p-6 bg-slate-800 border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                          {categoryLabels[post.category as keyof typeof categoryLabels]}
                        </span>
                        <span className="text-gray-400 text-sm">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-amber-400">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>작성자: {post.author}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 ml-6">
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 커뮤니티 그룹 탭 */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card
                  key={community.id}
                  className="p-6 bg-slate-800 border-slate-700 hover:border-amber-500/50 transition cursor-pointer"
                >
                  <div className="text-4xl mb-4">{community.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {community.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {community.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{community.members}명</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      참여
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* 커뮤니티 활동 */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">최근 활동</h3>
              <div className="space-y-4">
                {posts.slice(0, 2).map((post) => (
                  <Card
                    key={post.id}
                    className="p-4 bg-slate-800 border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">{post.title}</p>
                        <p className="text-gray-400 text-sm">
                          {post.author} · {post.date}
                        </p>
                      </div>
                      <div className="text-amber-400 font-semibold">
                        {post.comments} 댓글
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Heart, Eye, Plus, Search, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function Community() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, Array<{ author: string; text: string; date: string }>>>({
    1: [{ author: '박수진', text: '감사합니다. 유용한 정보네요!', date: '2026-03-18' }],
    2: [{ author: '이준호', text: '저도 같은 경험이 있습니다.', date: '2026-03-17' }],
  });

  const [posts] = useState([
    { id: 1, category: 'notice', title: '2026년 양자요법 자격증 시험 안내', author: '관리자', views: 234, likes: 45, comments: 12, date: '2026-03-18', content: '양자요법 자격증 시험이 다음 달에 예정되어 있습니다. 시험 일정과 준비 방법을 안내드립니다.' },
    { id: 2, category: 'qa', title: '양자에너지 치료 중 주의사항이 있나요?', author: '김민지', views: 156, likes: 28, comments: 8, date: '2026-03-17', content: '최근에 양자요법을 시작했는데, 치료 중 주의할 점이 있으면 알려주세요.' },
    { id: 3, category: 'free', title: '저도 성공했어요! 건강이 많이 개선되었습니다', author: '이준호', views: 312, likes: 89, comments: 24, date: '2026-03-16', content: '3개월 전부터 양자요법을 받기 시작했는데, 정말 효과가 있네요!' },
    { id: 4, category: 'free', title: '에너지 치유 경험 공유합니다', author: '박수진', views: 189, likes: 56, comments: 15, date: '2026-03-15', content: '저의 개인적인 에너지 치유 경험을 공유하고 싶습니다.' },
    { id: 5, category: 'qa', title: '자격증 취득 후 개인 사업 시작하려면?', author: '최영수', views: 267, likes: 72, comments: 19, date: '2026-03-14', content: '자격증을 취득한 후 개인적으로 사업을 시작하려고 하는데 조언 부탁드립니다.' },
    { id: 6, category: 'notice', title: '3월 온라인 세미나 개최 안내', author: '관리자', views: 145, likes: 34, comments: 7, date: '2026-03-13', content: '3월 25일 온라인 세미나가 개최됩니다. 주제는 "심화 에너지 치유 기법"입니다.' },
    { id: 7, category: 'free', title: '스트레스 해소에 효과적인 호흡법', author: '김미영', views: 423, likes: 156, comments: 42, date: '2026-03-12', content: '일상에서 실천할 수 있는 스트레스 해소 호흡법을 소개합니다.' },
    { id: 8, category: 'qa', title: '에너지 감지 능력을 키우려면?', author: '이동욱', views: 198, likes: 61, comments: 18, date: '2026-03-11', content: '에너지 감지 능력을 더 키우기 위한 연습 방법이 있을까요?' },
    { id: 9, category: 'free', title: '명상 후 변화된 점들', author: '정현아', views: 276, likes: 98, comments: 31, date: '2026-03-10', content: '3개월간의 명상 수행으로 얻은 변화들을 정리해봤습니다.' },
    { id: 10, category: 'notice', title: '새로운 교육 과정 개설 안내', author: '관리자', views: 312, likes: 67, comments: 14, date: '2026-03-09', content: '4월부터 새로운 심화 교육 과정이 개설됩니다.' },
    { id: 11, category: 'qa', title: '만성질환 환자 치료 경험담', author: '송준호', views: 234, likes: 85, comments: 28, date: '2026-03-08', content: '만성질환을 가진 환자를 치료한 경험을 공유하고 싶습니다.' },
    { id: 12, category: 'free', title: '일상 속 에너지 관리 팁', author: '박지은', views: 189, likes: 72, comments: 22, date: '2026-03-07', content: '바쁜 일상 속에서 에너지를 효과적으로 관리하는 방법들입니다.' },
  ]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    setComments({
      ...comments,
      [postId]: [...(comments[postId] || []), { author: '나', text: newComment, date: new Date().toISOString().split('T')[0] }]
    });
    setNewComment('');
  };

  const handleLike = (postId: number) => {
    setLikes({ ...likes, [postId]: !likes[postId] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">커뮤니티</h1>
        <p className="text-gray-300 mb-8">양자요법 전문가들과 경험을 나누는 공간입니다</p>

        {/* Search and Create */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="게시물 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-amber-500/20 text-white"
            />
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            새 글 작성
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-slate-800 border-b border-amber-500/20">
            <TabsTrigger value="board" className="text-gray-300">전체 게시판</TabsTrigger>
            <TabsTrigger value="notice" className="text-gray-300">공지사항</TabsTrigger>
            <TabsTrigger value="qa" className="text-gray-300">Q&A</TabsTrigger>
            <TabsTrigger value="free" className="text-gray-300">자유게시판</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4">
            {filteredPosts.map(post => (
              <Card key={post.id} className="bg-slate-800/50 border-amber-500/20 hover:border-amber-500 transition cursor-pointer" onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                          {post.category === 'notice' ? '공지' : post.category === 'qa' ? 'Q&A' : '자유'}
                        </span>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{post.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">작성자: {post.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{(comments[post.id] || []).length}</span>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {selectedPost === post.id && (
                    <div className="mt-6 pt-6 border-t border-amber-500/20">
                      <p className="text-gray-300 mb-6">{post.content}</p>

                      {/* Comments */}
                      <div className="mb-6">
                        <h4 className="text-white font-bold mb-4">댓글 ({(comments[post.id] || []).length})</h4>
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                          {(comments[post.id] || []).map((comment, i) => (
                            <div key={i} className="bg-slate-900/50 p-3 rounded">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-semibold text-amber-400">{comment.author}</span>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <p className="text-sm text-gray-300">{comment.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-slate-900 border-amber-500/20 text-white"
                          />
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => handleAddComment(post.id)}
                          >
                            등록
                          </Button>
                        </div>
                      </div>

                      {/* Like Button */}
                      <Button
                        variant="outline"
                        className={`border-amber-500 ${likes[post.id] ? 'bg-amber-500/20 text-amber-400' : 'text-amber-400'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {likes[post.id] ? '좋아요 취소' : '좋아요'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notice" className="space-y-4">
            {filteredPosts.filter(p => p.category === 'notice').map(post => (
              <Card key={post.id} className="bg-slate-800/50 border-amber-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{post.date} | 작성자: {post.author}</p>
                <p className="text-gray-300">{post.content}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="qa" className="space-y-4">
            {filteredPosts.filter(p => p.category === 'qa').map(post => (
              <Card key={post.id} className="bg-slate-800/50 border-amber-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{post.date} | 작성자: {post.author}</p>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>조회: {post.views}</span>
                  <span>좋아요: {post.likes}</span>
                  <span>댓글: {(comments[post.id] || []).length}</span>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="free" className="space-y-4">
            {filteredPosts.filter(p => p.category === 'free').map(post => (
              <Card key={post.id} className="bg-slate-800/50 border-amber-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{post.date} | 작성자: {post.author}</p>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>조회: {post.views}</span>
                  <span>좋아요: {post.likes}</span>
                  <span>댓글: {(comments[post.id] || []).length}</span>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

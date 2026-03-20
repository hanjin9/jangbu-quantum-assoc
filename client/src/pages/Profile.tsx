import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Download, Edit2, Save, X, Award, BookOpen, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  // 모의 데이터
  const enrolledCourses = [
    { id: 1, name: '양자요법 기초', status: '완료', completedDate: '2026-03-10', score: 95 },
    { id: 2, name: '에너지 진단법', status: '진행중', completedDate: null, score: null },
    { id: 3, name: '치료 기법 심화', status: '미수강', completedDate: null, score: null },
  ];

  const certificates = [
    { id: 1, name: '양자요법 기초 수료증', issuedDate: '2026-03-10', certificateId: 'CERT-2026-001' },
    { id: 2, name: '에너지 진단법 수료증', issuedDate: '2026-02-15', certificateId: 'CERT-2026-002' },
  ];

  const subscriptionHistory = [
    { id: 1, tier: 'Gold Premium', startDate: '2026-01-15', endDate: '2026-02-15', amount: '₩59,900', status: '완료' },
    { id: 2, tier: 'Gold Premium', startDate: '2026-02-15', endDate: '2026-03-15', amount: '₩59,900', status: '진행중' },
  ];

  const handleSaveProfile = async () => {
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('프로필이 업데이트되었습니다');
      setIsEditing(false);
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다');
    }
  };

  const handleDownloadCertificate = (certificateId: string) => {
    toast.success(`${certificateId} 수료증이 다운로드되었습니다`);
    // 실제 PDF 다운로드 구현
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">프로필을 보려면 로그인해주세요.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">마이페이지</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800 border border-amber-500/20">
            <TabsTrigger value="profile" className="text-white data-[state=active]:text-amber-400">
              <User className="w-4 h-4 mr-2" />
              개인정보
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-white data-[state=active]:text-amber-400">
              <BookOpen className="w-4 h-4 mr-2" />
              수강 이력
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-white data-[state=active]:text-amber-400">
              <Award className="w-4 h-4 mr-2" />
              수료증
            </TabsTrigger>
            <TabsTrigger value="subscription" className="text-white data-[state=active]:text-amber-400">
              구독 관리
            </TabsTrigger>
          </TabsList>

          {/* 개인정보 탭 */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-amber-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">개인정보</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        취소
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        수정
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">이름</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">이메일</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">전화번호</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">주소</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="서울시 강남구..."
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 수강 이력 탭 */}
          <TabsContent value="courses">
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="bg-slate-800/50 border-amber-500/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{course.name}</h3>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>상태: <span className={`${course.status === '완료' ? 'text-green-400' : course.status === '진행중' ? 'text-blue-400' : 'text-gray-500'}`}>{course.status}</span></p>
                          {course.completedDate && <p>완료일: {course.completedDate}</p>}
                          {course.score && <p>점수: {course.score}점</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 수료증 탭 */}
          <TabsContent value="certificates">
            <div className="space-y-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="bg-slate-800/50 border-amber-500/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-semibold mb-2">{cert.name}</h3>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>발급일: {cert.issuedDate}</p>
                          <p>인증번호: {cert.certificateId}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadCertificate(cert.certificateId)}
                        className="bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:opacity-90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 구독 관리 탭 */}
          <TabsContent value="subscription">
            <div className="space-y-4">
              {subscriptionHistory.map((sub) => (
                <Card key={sub.id} className="bg-slate-800/50 border-amber-500/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{sub.tier}</h3>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>기간: {sub.startDate} ~ {sub.endDate}</p>
                          <p>금액: {sub.amount}</p>
                          <p>상태: <span className={`${sub.status === '진행중' ? 'text-green-400' : 'text-gray-400'}`}>{sub.status}</span></p>
                        </div>
                      </div>
                      {sub.status === '진행중' && (
                        <Button
                          variant="outline"
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          구독 취소
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

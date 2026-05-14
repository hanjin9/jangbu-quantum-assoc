import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, ShoppingBag, LogOut, CheckCircle2, AlertCircle, BookOpen, Trophy, Award, Camera, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface Subscription {
  id: number;
  tier_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
}

interface Order {
  id: number;
  stripe_session_id: string;
  tier_id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface LearningProgress {
  courseId: string;
  courseName: string;
  progress: number;
  status: "진행중" | "완료" | "미시작";
}

interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
}

interface ExamResult {
  id: string;
  examName: string;
  score: number;
  totalScore: number;
  passStatus: "합격" | "불합격";
  testDate: string;
}

export function MyPage() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [certImage, setCertImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCertImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!user) return;
    setDashboardLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <User className="w-16 h-16 mx-auto text-amber-400 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">마이페이지에 접근하려면</h2>
          <p className="text-gray-300 mb-8">로그인이 필요합니다. 로그인 후 개인정보, 학습 진도, 자격증 등을 확인하세요.</p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg"
          >
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
          <p className="text-gray-300">개인정보, 멤버쉽, 학습 진도, 쇼핑, 포인트를 관리하세요</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">개인정보</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">멤버쉽</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">학습</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">자격증</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>프로필 정보</CardTitle>
                <CardDescription>개인 정보를 확인하고 수정하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <Button
                      onClick={() => profileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      사진 변경
                    </Button>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600">이름</label>
                      <p className="text-lg text-slate-900 mt-1">{user.name || "미설정"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">이메일</label>
                      <p className="text-lg text-slate-900 mt-1">{user.email || "미설정"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">로그인 방식</label>
                      <p className="text-lg text-slate-900 mt-1">{user.loginMethod || "미설정"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">자격증 사진 업로드</h3>
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden bg-slate-50">
                      {certImage ? (
                        <img src={certImage} alt="Certificate" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-500">클릭하여 자격증 사진 업로드</p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => certInputRef.current?.click()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      자격증 사진 선택
                    </Button>
                    <input
                      ref={certInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCertImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button className="flex-1 bg-slate-600 hover:bg-slate-700">저장</Button>
                  <Button
                    onClick={() => logout()}
                    variant="destructive"
                    className="flex-1"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>멤버쉽 정보</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-900">{subscription.tier_id}</p>
                        <p className="text-sm text-amber-700">{subscription.status}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      갱신일: {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600">활성 멤버쉽이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>학습 진도</CardTitle>
              </CardHeader>
              <CardContent>
                {learningProgress.length > 0 ? (
                  <div className="space-y-4">
                    {learningProgress.map((course) => (
                      <div key={course.courseId} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{course.courseName}</h4>
                          <span className="text-sm font-medium text-slate-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{course.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">진행 중인 강의가 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>자격증</CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border">
                        <Award className="w-5 h-5 text-amber-500" />
                        <div className="flex-1">
                          <p className="font-semibold">{cert.name}</p>
                          <p className="text-sm text-slate-600">발급일: {new Date(cert.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">취득한 자격증이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, ShoppingBag, LogOut, CheckCircle2, AlertCircle, BookOpen, Trophy, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setDashboardLoading(true);
    try {
      // Mock subscription data
      setSubscription({
        id: 1,
        tier_id: "gold",
        status: "active",
        current_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Mock orders data
      setOrders([
        {
          id: 1,
          stripe_session_id: "cs_test_123",
          tier_id: "gold",
          amount: 99.99,
          status: "completed",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      // Mock learning progress data
      setLearningProgress([
        {
          courseId: "course_001",
          courseName: "양자요법 기초",
          progress: 75,
          status: "진행중",
        },
        {
          courseId: "course_002",
          courseName: "고급 에너지 치료",
          progress: 100,
          status: "완료",
        },
      ]);

      // Mock certificates data
      setCertificates([
        {
          id: "cert_001",
          name: "양자요법 관리사 1급",
          issueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      // Mock exam results data
      setExamResults([
        {
          id: "exam_001",
          examName: "양자요법 기초 시험",
          score: 92,
          totalScore: 100,
          passStatus: "합격",
          testDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm("구독을 취소하시겠습니까?")) return;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
          <p className="text-gray-300">개인정보, 구독/주문, 학습 진도를 관리하세요</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-200 border border-slate-300 grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              개인정보
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              구독/주문
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-[#d4af37] text-slate-800">
              학습 진도
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="mb-6 border-[#d4af37]/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <CardTitle>개인정보</CardTitle>
                    <CardDescription className="text-gray-300">계정 정보 및 프로필</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="text-sm font-semibold text-slate-600">가입일</label>
                      <p className="text-lg text-slate-900 mt-1">
                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate("/settings")}
                    className="w-full bg-[#d4af37] hover:bg-[#c99f2e] text-black font-semibold"
                  >
                    개인정보 수정
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription & Orders Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Subscription Section */}
            {subscription ? (
              <Card className="border-[#d4af37]/20 shadow-lg mb-6">
                <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-[#d4af37]" />
                    <div>
                      <CardTitle>구독 정보</CardTitle>
                      <CardDescription className="text-gray-300">현재 구독 상태 및 플랜</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="text-slate-900 font-semibold">Gold 플랜</p>
                          <p className="text-sm text-slate-600">활성 상태</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[#d4af37]">$99.99</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 rounded-lg p-4">
                        <p className="text-xs text-slate-600 mb-1">구독 시작일</p>
                        <p className="text-slate-900 font-semibold">
                          {new Date(subscription.current_period_start).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-4">
                        <p className="text-xs text-slate-600 mb-1">다음 갱신일</p>
                        <p className="text-slate-900 font-semibold">
                          {new Date(subscription.current_period_end).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleCancelSubscription}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      구독 취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-[#d4af37]/20 shadow-lg mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>현재 활성 구독이 없습니다.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Orders Section */}
            <Card className="border-[#d4af37]/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <CardTitle>주문 이력</CardTitle>
                    <CardDescription className="text-gray-300">학습 과정 및 상품 구매 이력</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-semibold text-slate-900">{order.tier_id.toUpperCase()} 플랜</p>
                          <p className="text-sm text-slate-600">
                            {new Date(order.created_at).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#d4af37]">${order.amount}</p>
                          <p className="text-sm text-green-600 font-semibold">{order.status === "completed" ? "완료" : "진행중"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>주문 이력이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Progress Tab */}
          <TabsContent value="learning" className="space-y-6">
            {/* Learning Progress Section */}
            <Card className="border-[#d4af37]/20 shadow-lg mb-6">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <CardTitle>학습 진도</CardTitle>
                    <CardDescription className="text-gray-300">현재 수강 중인 과정의 진도율</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {learningProgress.length > 0 ? (
                  <div className="space-y-4">
                    {learningProgress.map((course) => (
                      <div key={course.courseId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{course.courseName}</p>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                            course.status === "완료" ? "bg-green-100 text-green-700" :
                            course.status === "진행중" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {course.status}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-[#d4af37] h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-600">{course.progress}% 완료</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>수강 중인 과정이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificates Section */}
            <Card className="border-[#d4af37]/20 shadow-lg mb-6">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <CardTitle>수료증</CardTitle>
                    <CardDescription className="text-gray-300">취득한 자격증 및 수료증</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="p-4 bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 rounded-lg border border-[#d4af37]/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-[#d4af37] flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{cert.name}</p>
                            <p className="text-sm text-slate-600">
                              발급일: {new Date(cert.issueDate).toLocaleDateString("ko-KR")}
                            </p>
                            {cert.expiryDate && (
                              <p className="text-sm text-slate-600">
                                유효기간: {new Date(cert.expiryDate).toLocaleDateString("ko-KR")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>취득한 수료증이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Results Section */}
            <Card className="border-[#d4af37]/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-[#d4af37]" />
                  <div>
                    <CardTitle>시험 결과</CardTitle>
                    <CardDescription className="text-gray-300">응시한 시험의 성적 및 합격 여부</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {examResults.length > 0 ? (
                  <div className="space-y-4">
                    {examResults.map((exam) => (
                      <div key={exam.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-slate-900">{exam.examName}</p>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                            exam.passStatus === "합격" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {exam.passStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">성적</p>
                            <p className="text-lg font-bold text-[#d4af37]">{exam.score}/{exam.totalScore}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">응시일</p>
                            <p className="text-slate-900 font-semibold">
                              {new Date(exam.testDate).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertCircle className="w-5 h-5" />
                    <p>시험 결과가 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
}

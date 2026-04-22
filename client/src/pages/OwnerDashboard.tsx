import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { TrendingUp, Users, BookOpen, DollarSign, AlertCircle } from "lucide-react";

/**
 * Owner Dashboard - 수입/매출 분석, 통계
 * Owner 역할만 접근 가능
 */
export function OwnerDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // 권한 확인
  useEffect(() => {
    if (!loading && user) {
      if (user.role !== "owner") {
        setLocation("/");
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  if (!user || user.role !== "owner") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              접근 거부
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              오너 권한이 필요합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 샘플 데이터
  const revenueData = [
    { month: "1월", revenue: 2500, students: 15, courses: 3 },
    { month: "2월", revenue: 3200, students: 22, courses: 4 },
    { month: "3월", revenue: 2800, students: 18, courses: 3 },
    { month: "4월", revenue: 3900, students: 28, courses: 5 },
    { month: "5월", revenue: 4200, students: 35, courses: 6 },
  ];

  const courseData = [
    { name: "기초 양자요법", value: 35, color: "#1e3a8a" },
    { name: "중급 양자에너지", value: 28, color: "#f59e0b" },
    { name: "고급 양자요법", value: 22, color: "#10b981" },
    { name: "전문가 과정", value: 15, color: "#ef4444" },
  ];

  const tierData = [
    { name: "기초", students: 45, revenue: 4500 },
    { name: "중급", students: 32, revenue: 6400 },
    { name: "고급", students: 18, revenue: 5400 },
    { name: "프리미엄", students: 5, revenue: 2500 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#d4af37] mb-2">오너 대시보드</h1>
          <p className="text-gray-400">수입 분석, 통계 및 사업 현황</p>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-[#d4af37]" />
                총 수입
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">₩16,700</p>
              <p className="text-xs text-gray-400 mt-1">이번 달 누적</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-[#d4af37]" />
                총 학생 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">118</p>
              <p className="text-xs text-gray-400 mt-1">활성 수강생</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-[#d4af37]" />
                개설 강의
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">6</p>
              <p className="text-xs text-gray-400 mt-1">활성 강의</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                평균 수료율
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4af37]">82%</p>
              <p className="text-xs text-gray-400 mt-1">전체 평균</p>
            </CardContent>
          </Card>
        </div>

        {/* 탭 섹션 */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-background border border-blue-700/50">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37]">
              수입 분석
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37]">
              강의별 통계
            </TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37]">
              등급별 분석
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37]">
              보고서
            </TabsTrigger>
          </TabsList>

          {/* 수입 분석 탭 */}
          <TabsContent value="revenue" className="mt-6">
            <Card className="border-blue-700/50">
              <CardHeader>
                <CardTitle>월별 수입 추이</CardTitle>
                <CardDescription>지난 5개월간의 수입 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                      formatter={(value) => `₩${value}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#d4af37" 
                      strokeWidth={2}
                      dot={{ fill: "#d4af37", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 강의별 통계 탭 */}
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-700/50">
                <CardHeader>
                  <CardTitle>강의별 수강생 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}명`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}명`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-purple-700/50">
                <CardHeader>
                  <CardTitle>강의별 수강생 수</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={courseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                        formatter={(value) => `${value}명`}
                      />
                      <Bar dataKey="value" fill="#d4af37" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 등급별 분석 탭 */}
          <TabsContent value="tiers" className="mt-6">
            <Card className="border-orange-700/50">
              <CardHeader>
                <CardTitle>등급별 수강생 및 수입</CardTitle>
                <CardDescription>각 등급별 학생 수와 수입 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tierData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                      formatter={(value) => {
                        if (typeof value === "number" && value > 100) {
                          return `₩${value}`;
                        }
                        return `${value}명`;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="students" fill="#3b82f6" name="학생 수" />
                    <Bar dataKey="revenue" fill="#d4af37" name="수입(₩)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 보고서 탭 */}
          <TabsContent value="reports" className="mt-6">
            <Card className="border-blue-700/50">
              <CardHeader>
                <CardTitle>사업 보고서</CardTitle>
                <CardDescription>주요 지표 및 성과 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                      <p className="text-sm text-gray-400 mb-2">이번 달 수입</p>
                      <p className="text-2xl font-bold text-[#d4af37]">₩16,700</p>
                      <p className="text-xs text-green-400 mt-2">지난 달 대비 +8%</p>
                    </div>

                    <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
                      <p className="text-sm text-gray-400 mb-2">신규 학생</p>
                      <p className="text-2xl font-bold text-[#d4af37]">12명</p>
                      <p className="text-xs text-green-400 mt-2">이번 달 신규 가입</p>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
                      <p className="text-sm text-gray-400 mb-2">평균 수료율</p>
                      <p className="text-2xl font-bold text-[#d4af37]">82%</p>
                      <p className="text-xs text-green-400 mt-2">전체 평균 대비 +5%</p>
                    </div>

                    <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-700/50">
                      <p className="text-sm text-gray-400 mb-2">활성 강의</p>
                      <p className="text-2xl font-bold text-[#d4af37]">6개</p>
                      <p className="text-xs text-green-400 mt-2">총 118명 수강 중</p>
                    </div>
                  </div>

                  <div className="p-4 bg-background border border-blue-700/50 rounded-lg">
                    <h3 className="font-bold text-[#d4af37] mb-3">주요 성과</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ 월별 수입 지속적 증가 추세</li>
                      <li>✓ 신규 강의 개설로 수강생 다양화</li>
                      <li>✓ 고객 만족도 82% 달성</li>
                      <li>✓ 프리미엄 등급 가입자 증가</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

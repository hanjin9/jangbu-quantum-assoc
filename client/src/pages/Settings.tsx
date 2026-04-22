import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Type, Globe, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('ko');

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
    toast.success('알림 설정이 저장되었습니다');
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    toast.success('글자 크기가 변경되었습니다');
  };

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    toast.success(`언어가 ${languages.find(l => l.code === code)?.name}로 변경되었습니다`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">설정을 보려면 로그인해주세요.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">설정</h1>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-slate-800 border border-amber-500/20 w-full justify-start flex-wrap h-auto gap-2 p-2">
            <TabsTrigger value="notifications" className="text-white data-[state=active]:text-amber-400">
              <Bell className="w-4 h-4 mr-2" />
              알림 설정
            </TabsTrigger>
            <TabsTrigger value="fontSize" className="text-white data-[state=active]:text-amber-400">
              <Type className="w-4 h-4 mr-2" />
              글자 크기
            </TabsTrigger>
            <TabsTrigger value="language" className="text-white data-[state=active]:text-amber-400">
              <Globe className="w-4 h-4 mr-2" />
              다국어 지원
            </TabsTrigger>
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <TabsTrigger value="admin" className="text-white data-[state=active]:text-amber-400">
                <Shield className="w-4 h-4 mr-2" />
                관리자
              </TabsTrigger>
            )}
          </TabsList>

          {/* 알림 설정 - 맨 위 */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  알림 설정
                </CardTitle>
                <CardDescription className="text-slate-400">
                  어떤 알림을 받을지 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">이메일 알림</p>
                    <p className="text-slate-400 text-sm">중요한 소식을 이메일로 받기</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">SMS 알림</p>
                    <p className="text-slate-400 text-sm">긴급 소식을 SMS로 받기</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">푸시 알림</p>
                    <p className="text-slate-400 text-sm">실시간 알림 받기</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={() => handleNotificationChange('pushNotifications')}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 글자 크기 */}
          <TabsContent value="fontSize" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-amber-400" />
                  글자 크기
                </CardTitle>
                <CardDescription className="text-slate-400">
                  화면에 표시되는 글자 크기를 조정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleFontSizeChange('small')}
                    className={`p-4 rounded-lg font-semibold transition ${
                      fontSize === 'small'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">작음</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('medium')}
                    className={`p-4 rounded-lg font-semibold transition ${
                      fontSize === 'medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-base">중간</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange('large')}
                    className={`p-4 rounded-lg font-semibold transition ${
                      fontSize === 'large'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-lg">큼</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 다국어 지원 */}
          <TabsContent value="language" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  다국어 지원
                </CardTitle>
                <CardDescription className="text-slate-400">
                  원하는 언어를 선택하세요 (12개 언어 지원)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`p-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                        language === lang.code
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 관리자 설정 - 맨 마지막 */}
          {(user?.role === 'admin' || user?.role === 'owner') && (
            <TabsContent value="admin" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    관리자 설정
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    관리자 기능에 접근하세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.role === 'owner' && (
                    <Button
                      onClick={() => navigate('/admin/dashboard')}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      관리자 대시보드 (Owner)
                    </Button>
                  )}
                  {user?.role === 'admin' && (
                    <Button
                      onClick={() => navigate('/admin/members')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      학생 관리 (Admin)
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

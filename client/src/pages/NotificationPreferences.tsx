import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mail, Smartphone, MessageSquare, Clock, AlertCircle } from 'lucide-react';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: 'blog_update',
    name: '블로그 포스트 업데이트',
    description: '새로운 블로그 포스트가 게시될 때 알림을 받습니다',
    icon: <Mail className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
  },
  {
    id: 'lecture_start',
    name: '라이브 강의 시작',
    description: '라이브 강의가 시작될 때 알림을 받습니다',
    icon: <Clock className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: true,
  },
  {
    id: 'appointment_confirmed',
    name: '상담 예약 확정',
    description: '상담 예약이 확정되었을 때 알림을 받습니다',
    icon: <MessageSquare className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: true,
  },
  {
    id: 'certification_verified',
    name: '자격증 검증 완료',
    description: '자격증 검증이 완료되었을 때 알림을 받습니다',
    icon: <AlertCircle className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: true,
  },
  {
    id: 'community_reply',
    name: '커뮤니티 댓글 알림',
    description: '내 게시물에 댓글이 달렸을 때 알림을 받습니다',
    icon: <MessageSquare className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
  },
  {
    id: 'system_notice',
    name: '시스템 공지사항',
    description: '협회의 중요한 공지사항을 받습니다',
    icon: <AlertCircle className="w-5 h-5" />,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
  },
];

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (id: string, channel: 'push' | 'email' | 'sms') => {
    setPreferences(preferences.map(pref => {
      if (pref.id === id) {
        return {
          ...pref,
          [`${channel}Enabled`]: !pref[`${channel}Enabled` as keyof NotificationPreference],
        };
      }
      return pref;
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // 저장 로직 (API 호출)
    console.log('Preferences saved:', preferences);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSelectAll = (channel: 'push' | 'email' | 'sms') => {
    const allEnabled = preferences.every(p => p[`${channel}Enabled` as keyof NotificationPreference]);
    setPreferences(preferences.map(pref => ({
      ...pref,
      [`${channel}Enabled`]: !allEnabled,
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">알림 선호도 설정</h1>
          <p className="text-gray-400">어떤 알림을 어느 채널로 받을지 선택하세요</p>
        </div>

        {/* Save Status */}
        {isSaved && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-300">알림 설정이 저장되었습니다!</p>
          </div>
        )}

        {/* Channel Selection */}
        <Card className="bg-slate-800 border-yellow-400/20 mb-8">
          <CardHeader>
            <CardTitle className="text-yellow-400">알림 채널 선택</CardTitle>
            <CardDescription className="text-gray-300">
              각 채널별로 모든 알림을 활성화/비활성화할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Push Notifications */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">푸시 알림</h3>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300">
                    {preferences.filter(p => p.pushEnabled).length}/{preferences.length}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  브라우저 및 모바일 푸시 알림
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('push')}
                  className="w-full text-purple-300 border-purple-500/30 hover:bg-purple-500/10"
                >
                  {preferences.every(p => p.pushEnabled) ? '모두 비활성화' : '모두 활성화'}
                </Button>
              </div>

              {/* Email Notifications */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">이메일</h3>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {preferences.filter(p => p.emailEnabled).length}/{preferences.length}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  이메일로 알림 수신
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('email')}
                  className="w-full text-blue-300 border-blue-500/30 hover:bg-blue-500/10"
                >
                  {preferences.every(p => p.emailEnabled) ? '모두 비활성화' : '모두 활성화'}
                </Button>
              </div>

              {/* SMS Notifications */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">SMS</h3>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300">
                    {preferences.filter(p => p.smsEnabled).length}/{preferences.length}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  문자 메시지로 알림 수신
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('sms')}
                  className="w-full text-green-300 border-green-500/30 hover:bg-green-500/10"
                >
                  {preferences.every(p => p.smsEnabled) ? '모두 비활성화' : '모두 활성화'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">알림 유형별 설정</h2>
          
          {preferences.map((pref) => (
            <Card key={pref.id} className="bg-slate-800 border-yellow-400/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0 text-yellow-400">
                      {pref.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{pref.name}</h3>
                      <p className="text-sm text-gray-400">{pref.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4">
                    {/* Push Toggle */}
                    <div className="flex flex-col items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-400" />
                      <Switch
                        checked={pref.pushEnabled}
                        onCheckedChange={() => handleToggle(pref.id, 'push')}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>

                    {/* Email Toggle */}
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <Switch
                        checked={pref.emailEnabled}
                        onCheckedChange={() => handleToggle(pref.id, 'email')}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>

                    {/* SMS Toggle */}
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <Switch
                        checked={pref.smsEnabled}
                        onCheckedChange={() => handleToggle(pref.id, 'sms')}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="bg-yellow-400 text-slate-900 hover:bg-yellow-500"
          >
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  );
}

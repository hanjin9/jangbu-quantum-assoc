import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Smartphone, CheckCircle, AlertCircle, BookOpen, Calendar } from 'lucide-react';

interface Notification {
  id: number;
  type: 'blog' | 'lecture' | 'appointment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isPushSent: boolean;
  isEmailSent: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'blog',
    title: '새 블로그 포스트: 양자 에너지와 면역력',
    message: '박준호 협회장이 새로운 연구 결과를 발표했습니다. 양자 에너지가 면역력을 45% 증가시킨다는 내용입니다.',
    timestamp: '2024-03-22 09:30',
    isRead: false,
    isPushSent: true,
    isEmailSent: true,
  },
  {
    id: 2,
    type: 'lecture',
    title: '라이브 강의 시작: 양자요법 기초',
    message: '이미영 부협회장의 라이브 강의가 곧 시작됩니다. 지금 참석하세요!',
    timestamp: '2024-03-22 08:15',
    isRead: true,
    isPushSent: true,
    isEmailSent: false,
  },
  {
    id: 3,
    type: 'appointment',
    title: '상담 예약 확정',
    message: '3월 25일 오후 2시 상담이 확정되었습니다. 확인 메일을 보내드렸습니다.',
    timestamp: '2024-03-21 14:45',
    isRead: true,
    isPushSent: true,
    isEmailSent: true,
  },
  {
    id: 4,
    type: 'blog',
    title: '회원 성공 사례: 60대 만성 통증 완화',
    message: '김영희 회원의 성공 사례가 블로그에 게시되었습니다. 20년 만성 통증이 3개월 만에 70% 개선되었습니다.',
    timestamp: '2024-03-20 16:20',
    isRead: true,
    isPushSent: true,
    isEmailSent: true,
  },
  {
    id: 5,
    type: 'system',
    title: '자격증 검증 완료',
    message: '귀하의 양자요법 자격증이 검증되었습니다. 이제 협회 전문가로 등록되었습니다.',
    timestamp: '2024-03-19 11:00',
    isRead: true,
    isPushSent: true,
    isEmailSent: true,
  },
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <BookOpen className="w-5 h-5" />;
      case 'lecture':
        return <Calendar className="w-5 h-5" />;
      case 'appointment':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'lecture':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'appointment':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blog':
        return '블로그';
      case 'lecture':
        return '라이브 강의';
      case 'appointment':
        return '상담 예약';
      default:
        return '시스템';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Bell className="w-8 h-8 text-yellow-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">알림 센터</h1>
          </div>
          <p className="text-gray-400">새 블로그 포스트, 라이브 강의, 상담 예약 등의 알림을 받으세요</p>
        </div>

        {/* Notification Settings */}
        <Card className="bg-slate-800 border-yellow-400/20 mb-8">
          <CardHeader>
            <CardTitle className="text-yellow-400">알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-semibold text-white">푸시 알림</p>
                    <p className="text-sm text-gray-400">모바일 및 브라우저 알림</p>
                  </div>
                </div>
                <Badge className="bg-green-500">활성화</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white">이메일 알림</p>
                    <p className="text-sm text-gray-400">중요 소식 이메일 발송</p>
                  </div>
                </div>
                <Badge className="bg-green-500">활성화</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <div className="space-y-4">
          <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
            <TabsList className="bg-slate-700 border border-slate-600 grid w-full grid-cols-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500 text-gray-200">
                모든 알림 ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-yellow-500 text-gray-200">
                읽지 않음 ({unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`bg-slate-800 border-yellow-400/20 cursor-pointer transition-all hover:border-yellow-400/40 ${
                    !notification.isRead ? 'border-l-4 border-l-yellow-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    markAsRead(notification.id);
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{notification.title}</h3>
                            <p className="text-sm text-gray-400">{notification.timestamp}</p>
                          </div>
                          <Badge variant="secondary" className={getTypeColor(notification.type)}>
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{notification.message}</p>
                        <div className="flex gap-2">
                          {notification.isPushSent && (
                            <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                              <Smartphone className="w-3 h-3 mr-1" />
                              푸시 발송됨
                            </Badge>
                          )}
                          {notification.isEmailSent && (
                            <Badge variant="outline" className="text-blue-300 border-blue-500/30">
                              <Mail className="w-3 h-3 mr-1" />
                              이메일 발송됨
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="bg-slate-800 border-yellow-400/20">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-300">모든 알림을 읽었습니다!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className="bg-slate-800 border-yellow-400/20 cursor-pointer transition-all hover:border-yellow-400/40 border-l-4 border-l-yellow-400"
                    onClick={() => {
                      setSelectedNotification(notification);
                      markAsRead(notification.id);
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{notification.title}</h3>
                              <p className="text-sm text-gray-400">{notification.timestamp}</p>
                            </div>
                            <Badge variant="secondary" className={getTypeColor(notification.type)}>
                              {getTypeLabel(notification.type)}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm">{notification.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Zap,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

export function MobileNotificationCenter() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  useEffect(() => {
    // 더미 데이터 로드
    const dummyAlerts = [
      {
        id: 'alert_1',
        title: '🔐 관리자 로그인',
        message: 'director@jangbu.com이(가) 로그인했습니다.',
        type: 'info',
        createdAt: new Date(Date.now() - 5 * 60000),
        isRead: false,
        priority: 'high',
      },
      {
        id: 'alert_2',
        title: '⚠️ 의심 활동 감지',
        message: '비정상 IP(192.168.1.100)에서 접근이 감지되었습니다.',
        type: 'warning',
        createdAt: new Date(Date.now() - 15 * 60000),
        isRead: false,
        priority: 'high',
      },
      {
        id: 'alert_3',
        title: '🚨 긴급 알림',
        message: '대량 삭제 시도가 감지되었습니다. 즉시 확인해주세요.',
        type: 'critical',
        createdAt: new Date(Date.now() - 30 * 60000),
        isRead: true,
        priority: 'critical',
      },
      {
        id: 'alert_4',
        title: '📊 일일 요약',
        message: '어제 로그인 5회, 신규 회원 2명, 수익 ₩500,000',
        type: 'info',
        createdAt: new Date(Date.now() - 24 * 60 * 60000),
        isRead: true,
        priority: 'normal',
      },
    ];

    const dummyDevices = [
      {
        id: 'device_1',
        platform: 'iOS',
        appVersion: '1.0.0',
        osVersion: '17.2',
        lastSeen: new Date(Date.now() - 5 * 60000),
        isActive: true,
      },
      {
        id: 'device_2',
        platform: 'Android',
        appVersion: '1.0.0',
        osVersion: '14',
        lastSeen: new Date(Date.now() - 2 * 60 * 60000),
        isActive: true,
      },
      {
        id: 'device_3',
        platform: 'iOS',
        appVersion: '0.9.0',
        osVersion: '16.5',
        lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60000),
        isActive: false,
      },
    ];

    setAlerts(dummyAlerts);
    setDevices(dummyDevices);
  }, []);

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'unread':
        return alerts.filter((a) => !a.isRead);
      case 'critical':
        return alerts.filter((a) => a.priority === 'critical' || a.priority === 'high');
      default:
        return alerts;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === alertId ? { ...a, isRead: true } : a
      )
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(
      alerts.map((a) => ({ ...a, isRead: true }))
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">모바일 알림 센터</h1>
          <p className="text-gray-400">
            실시간 알림 및 긴급 상황 대응 관리
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">전체 알림</p>
                <p className="text-3xl font-bold text-white mt-2">{alerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-[#d4af37]" />
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">읽지 않은 알림</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{unreadCount}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">등록된 기기</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {devices.filter((d) => d.isActive).length}
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 알림 목록 */}
          <div className="lg:col-span-2">
            {/* 필터 버튼 및 모두 읽음 */}
            <div className="flex gap-2 mb-6 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilter('all')}
                  variant={filter === 'all' ? 'default' : 'outline'}
                  className={filter === 'all' ? 'bg-[#d4af37] text-black' : ''}
                >
                  전체
                </Button>
                <Button
                  onClick={() => setFilter('unread')}
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  className={filter === 'unread' ? 'bg-blue-600 text-white' : ''}
                >
                  읽지 않음 ({unreadCount})
                </Button>
                <Button
                  onClick={() => setFilter('critical')}
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  className={filter === 'critical' ? 'bg-red-600 text-white' : ''}
                >
                  긴급
                </Button>
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="text-[#d4af37] border-[#d4af37] hover:bg-[#d4af37] hover:text-black text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  모두 읽음
                </Button>
              )}
            </div>

            {/* 알림 목록 */}
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <Card className="bg-slate-900 border-slate-700 p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">알림이 없습니다</p>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`bg-slate-900 border-slate-700 p-4 cursor-pointer transition-all hover:bg-slate-800 ${
                      !alert.isRead ? 'border-l-4 border-l-[#d4af37]' : ''
                    }`}
                    onClick={() => setSelectedAlert(alert.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* 아이콘 */}
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-white">{alert.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{alert.message}</p>
                          </div>
                          {!alert.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-[#d4af37] rounded-full mt-2" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(alert.createdAt)}
                        </p>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex-shrink-0 flex gap-2">
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(alert.id);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlert(alert.id);
                          }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* 등록된 기기 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">등록된 기기</h2>
            <div className="space-y-3">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className="bg-slate-900 border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-[#d4af37] mt-1" />
                      <div>
                        <p className="font-semibold text-white">{device.platform}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          App v{device.appVersion}
                        </p>
                        <p className="text-xs text-gray-400">
                          OS v{device.osVersion}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {device.isActive ? (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              활성
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-3 h-3" />
                              비활성
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    마지막 활동: {formatTime(device.lastSeen)}
                  </p>
                </Card>
              ))}
            </div>

            {/* 기기 추가 */}
            <Button className="w-full mt-4 bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold">
              새 기기 등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

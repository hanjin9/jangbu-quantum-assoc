import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  Activity,
  Search,
  Download,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function AuditLogDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [suspiciousActivities, setSuspiciousActivities] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    // 더미 데이터 로드
    const dummyLogs = [
      {
        id: 'audit_1',
        adminEmail: 'director@jangbu.com',
        adminRole: 'director',
        action: 'UPDATE',
        resource: 'members',
        timestamp: new Date(Date.now() - 1 * 60000),
        status: 'success',
        ipAddress: '192.168.1.1',
      },
      {
        id: 'audit_2',
        adminEmail: 'manager@jangbu.com',
        adminRole: 'manager',
        action: 'DELETE',
        resource: 'lectures',
        timestamp: new Date(Date.now() - 5 * 60000),
        status: 'success',
        ipAddress: '192.168.1.2',
      },
      {
        id: 'audit_3',
        adminEmail: 'admin@jangbu.com',
        adminRole: 'admin',
        action: 'LOGIN',
        resource: 'system',
        timestamp: new Date(Date.now() - 10 * 60000),
        status: 'failed',
        ipAddress: '192.168.1.3',
      },
      {
        id: 'audit_4',
        adminEmail: 'director@jangbu.com',
        adminRole: 'director',
        action: 'CREATE',
        resource: 'announcements',
        timestamp: new Date(Date.now() - 30 * 60000),
        status: 'success',
        ipAddress: '192.168.1.1',
      },
      {
        id: 'audit_5',
        adminEmail: 'manager@jangbu.com',
        adminRole: 'manager',
        action: 'READ',
        resource: 'revenue',
        timestamp: new Date(Date.now() - 60 * 60000),
        status: 'success',
        ipAddress: '192.168.1.2',
      },
    ];

    setLogs(dummyLogs);
    setFilteredLogs(dummyLogs);

    // 통계 계산
    setStatistics({
      totalActions: dummyLogs.length,
      successfulActions: dummyLogs.filter((log) => log.status === 'success').length,
      failedActions: dummyLogs.filter((log) => log.status === 'failed').length,
    });

    // 의심 활동 감지
    setSuspiciousActivities(
      dummyLogs.filter((log) => log.status === 'failed' || log.action === 'DELETE')
    );
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = logs.filter(
      (log) =>
        log.adminEmail.toLowerCase().includes(term.toLowerCase()) ||
        log.action.toLowerCase().includes(term.toLowerCase()) ||
        log.resource.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    let filtered = logs;

    if (filter === 'success') {
      filtered = logs.filter((log) => log.status === 'success');
    } else if (filter === 'failed') {
      filtered = logs.filter((log) => log.status === 'failed');
    } else if (filter === 'suspicious') {
      filtered = suspiciousActivities;
    }

    setFilteredLogs(filtered);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-400';
      case 'UPDATE':
        return 'text-blue-400';
      case 'DELETE':
        return 'text-red-400';
      case 'READ':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'director':
        return 'bg-purple-900/20 text-purple-300 border-purple-700';
      case 'manager':
        return 'bg-blue-900/20 text-blue-300 border-blue-700';
      case 'admin':
        return 'bg-gray-900/20 text-gray-300 border-gray-700';
      default:
        return 'bg-gray-900/20 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8 text-white">감사 로그</h1>

        {/* 통계 카드 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">전체 활동</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {statistics.totalActions}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-[#d4af37]" />
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">성공</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">
                    {statistics.successfulActions}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">실패</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">
                    {statistics.failedActions}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">의심 활동</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">
                    {suspiciousActivities.length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>
          </div>
        )}

        {/* 검색 및 필터 */}
        <Card className="bg-slate-900 border-slate-700 p-6 mb-8">
          <div className="space-y-4">
            {/* 검색 */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="관리자, 작업, 리소스 검색..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-500"
                />
              </div>
              <Button className="bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold flex items-center gap-2">
                <Download className="w-4 h-4" />
                내보내기
              </Button>
            </div>

            {/* 필터 */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilter('all')}
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                className={selectedFilter === 'all' ? 'bg-[#d4af37] text-black' : ''}
              >
                전체
              </Button>
              <Button
                onClick={() => handleFilter('success')}
                variant={selectedFilter === 'success' ? 'default' : 'outline'}
                className={selectedFilter === 'success' ? 'bg-green-600 text-white' : ''}
              >
                성공
              </Button>
              <Button
                onClick={() => handleFilter('failed')}
                variant={selectedFilter === 'failed' ? 'default' : 'outline'}
                className={selectedFilter === 'failed' ? 'bg-red-600 text-white' : ''}
              >
                실패
              </Button>
              <Button
                onClick={() => handleFilter('suspicious')}
                variant={selectedFilter === 'suspicious' ? 'default' : 'outline'}
                className={selectedFilter === 'suspicious' ? 'bg-yellow-600 text-white' : ''}
              >
                의심 활동
              </Button>
            </div>
          </div>
        </Card>

        {/* 로그 테이블 */}
        <Card className="bg-slate-900 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    시간
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    관리자
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    역할
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    작업
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    리소스
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    IP 주소
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    상세
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div>
                        <p>{formatDate(log.timestamp)}</p>
                        <p className="text-xs text-gray-500">{formatTime(log.timestamp)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{log.adminEmail}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                          log.adminRole
                        )}`}
                      >
                        {log.adminRole === 'director'
                          ? '협회장'
                          : log.adminRole === 'manager'
                          ? '부회장'
                          : '관리자'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{log.resource}</td>
                    <td className="px-6 py-4 text-sm">
                      {log.status === 'success' ? (
                        <span className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          성공
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-4 h-4" />
                          실패
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{log.ipAddress}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

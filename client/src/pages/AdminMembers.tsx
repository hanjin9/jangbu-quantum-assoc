'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Edit, Trash2, Eye, EyeOff, Download, Filter } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'user' | 'admin';
  courses: number;
  certificates: number;
}

export default function AdminMembers() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // 더미 데이터
  const mockMembers: Member[] = [
    {
      id: '1',
      name: '한진',
      email: 'hanjin@example.com',
      phone: '010-1234-5678',
      joinDate: '2024-01-15',
      status: 'active',
      role: 'admin',
      courses: 6,
      certificates: 4,
    },
    {
      id: '2',
      name: '김지수',
      email: 'kim@example.com',
      phone: '010-2345-6789',
      joinDate: '2024-02-10',
      status: 'active',
      role: 'user',
      courses: 3,
      certificates: 2,
    },
    {
      id: '3',
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-3456-7890',
      joinDate: '2024-03-05',
      status: 'active',
      role: 'user',
      courses: 4,
      certificates: 3,
    },
    {
      id: '4',
      name: '박민수',
      email: 'park@example.com',
      phone: '010-4567-8901',
      joinDate: '2024-01-20',
      status: 'inactive',
      role: 'user',
      courses: 1,
      certificates: 0,
    },
    {
      id: '5',
      name: '최수진',
      email: 'choi@example.com',
      phone: '010-5678-9012',
      joinDate: '2024-02-28',
      status: 'suspended',
      role: 'user',
      courses: 2,
      certificates: 1,
    },
  ];

  // 권한 확인
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // 초기 데이터 로드
  useEffect(() => {
    setMembers(mockMembers);
    setFilteredMembers(mockMembers);
    setIsLoading(false);
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = members;

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.phone.includes(query)
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    // 역할 필터
    if (roleFilter !== 'all') {
      filtered = filtered.filter((m) => m.role === roleFilter);
    }

    setFilteredMembers(filtered);
  }, [searchQuery, statusFilter, roleFilter, members]);

  // 상태별 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'suspended':
        return '정지됨';
      default:
        return '알 수 없음';
    }
  };

  const handleSelectMember = (id: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', '이름', '이메일', '전화', '가입일', '상태', '역할', '과정', '수료증'];
    const rows = filteredMembers.map((m) => [
      m.id,
      m.name,
      m.email,
      m.phone,
      m.joinDate,
      getStatusLabel(m.status),
      m.role,
      m.courses,
      m.certificates,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
          <p className="mt-4 text-slate-600">회원 데이터 로드 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">회원 관리</h1>
          <p className="text-slate-600">
            총 <strong>{members.length}</strong>명의 회원 중 <strong>{filteredMembers.length}</strong>명 표시
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="이름, 이메일, 전화로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지됨</option>
            </select>

            {/* 역할 필터 */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            >
              <option value="all">모든 역할</option>
              <option value="user">사용자</option>
              <option value="admin">관리자</option>
            </select>

            {/* 내보내기 */}
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d4af37] text-white font-semibold rounded-lg hover:bg-[#d4af37]/90 transition"
            >
              <Download className="w-5 h-5" />
              CSV 내보내기
            </button>
          </div>

          {/* 선택된 회원 수 */}
          {selectedMembers.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-800">
                <strong>{selectedMembers.size}</strong>명의 회원이 선택됨
              </span>
              <button
                onClick={() => setSelectedMembers(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                선택 해제
              </button>
            </div>
          )}
        </div>

        {/* 회원 테이블 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMembers.size === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">이름</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">이메일</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">전화</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">상태</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">역할</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">과정/수료증</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">가입일</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{member.name}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{member.email}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{member.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}>
                          {getStatusLabel(member.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role === 'admin' ? '관리자' : '사용자'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {member.courses}개 / {member.certificates}개
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(member.joinDate).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/members/${member.id}`)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            title="편집"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">회원 삭제</h3>
            <p className="text-slate-600 mb-6">
              이 회원을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                취소
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

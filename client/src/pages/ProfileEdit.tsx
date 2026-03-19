import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

export default function ProfileEdit() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    bio: ''
  });

  const getProfile = trpc.profile.getProfile.useQuery();
  const updateProfile = trpc.profile.updateProfile.useMutation();

  useEffect(() => {
    if (getProfile.data) {
      setFormData({
        name: getProfile.data.name || '',
        phoneNumber: getProfile.data.phoneNumber || '',
        address: getProfile.data.address || '',
        city: getProfile.data.city || '',
        zipCode: getProfile.data.zipCode || '',
        bio: getProfile.data.bio || ''
      });
    }
  }, [getProfile.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile.mutateAsync({
        name: formData.name || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        bio: formData.bio || undefined
      });

      toast.success(result.message);
      navigate('/dashboard');
    } catch (error) {
      toast.error('프로필 업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white">로그인이 필요합니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">프로필 편집</CardTitle>
            <CardDescription className="text-slate-300">
              개인 정보를 수정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  이름
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 휴대폰 번호 */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-slate-200">
                  휴대폰 번호
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-200">
                  주소
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="도로명 주소를 입력하세요"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 도시 */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-200">
                  도시
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="도시명을 입력하세요"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 우편번호 */}
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-slate-200">
                  우편번호
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 자기소개 */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-200">
                  자기소개
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="자신을 소개해주세요"
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {loading ? '저장 중...' : '저장'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface Subscription {
  id: number;
  userId: number;
  userName: string;
  email: string;
  tierId: string;
  status: string;
  amount: number;
  currentPeriodEnd: string;
  createdAt: string;
}

interface Refund {
  id: number;
  userId: number;
  orderId: number;
  amount: number;
  reason: string;
  status: string;
  processedAt: string;
}

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Mock data loading
  // Mock data loading
  useEffect(() => {
    setLoading(true);
    try {
      setSubscriptions([
        {
          id: 1,
          userId: 2,
          userName: '김민지',
          email: 'kim@example.com',
          tierId: 'gold',
          status: 'active',
          amount: 49.99,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          userId: 3,
          userName: '이준호',
          email: 'lee@example.com',
          tierId: 'silver',
          status: 'active',
          amount: 29.99,
          currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      setRefunds([
        {
          id: 1,
          userId: 2,
          orderId: 5,
          amount: 49.99,
          reason: '사용자 요청',
          status: 'succeeded',
          processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          userId: 3,
          orderId: 6,
          amount: 29.99,
          reason: '서비스 불만족',
          status: 'succeeded',
          processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!selectedSubscription || !cancelReason.trim()) {
      toast.error('취소 사유를 입력해주세요');
      return;
    }

    setProcessing(true);
    try {
      toast.success('구독이 취소되었습니다');
      setSubscriptions(subscriptions.filter(s => s.id !== selectedSubscription.id));
      setCancelReason('');
      setSelectedSubscription(null);
    } catch (error) {
      toast.error('구독 취소 실패');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedSubscription || !refundAmount.trim()) {
      toast.error('환불 금액을 입력해주세요');
      return;
    }

    setProcessing(true);
    try {
      const newRefund: Refund = {
        id: refunds.length + 1,
        userId: selectedSubscription.userId,
        orderId: selectedSubscription.id,
        amount: parseFloat(refundAmount),
        reason: refundNotes || '관리자 처리',
        status: 'succeeded',
        processedAt: new Date().toISOString(),
      };

      setRefunds([...refunds, newRefund]);
      toast.success('환불이 처리되었습니다');
      setRefundAmount('');
      setRefundNotes('');
      setSelectedSubscription(null);
    } catch (error) {
      toast.error('환불 처리 실패');
    } finally {
      setProcessing(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-12 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-white">관리자만 접근 가능합니다</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">구독 관리</h1>

        {/* Subscriptions Table */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">활성 구독</CardTitle>
            <CardDescription>사용자 구독 현황 및 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">사용자</TableHead>
                    <TableHead className="text-gray-300">이메일</TableHead>
                    <TableHead className="text-gray-300">플랜</TableHead>
                    <TableHead className="text-gray-300">금액</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">갱신일</TableHead>
                    <TableHead className="text-gray-300">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-slate-700">
                      <TableCell className="text-white">{sub.userName}</TableCell>
                      <TableCell className="text-gray-400">{sub.email}</TableCell>
                      <TableCell className="text-white capitalize">{sub.tierId}</TableCell>
                      <TableCell className="text-white">${sub.amount}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-900 text-green-200 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          활성
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedSubscription(sub)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              취소
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">구독 취소</DialogTitle>
                              <DialogDescription>
                                {selectedSubscription?.userName}님의 구독을 취소하시겠습니까?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-300">취소 사유</Label>
                                <Textarea
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value)}
                                  placeholder="취소 사유를 입력하세요"
                                  className="bg-slate-700 border-slate-600 text-white mt-2"
                                />
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setSelectedSubscription(null)}
                                >
                                  취소
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={handleCancelSubscription}
                                  disabled={processing}
                                >
                                  {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                  구독 취소
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Refunds Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">환불 이력</CardTitle>
            <CardDescription>처리된 환불 기록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">사용자 ID</TableHead>
                    <TableHead className="text-gray-300">주문 ID</TableHead>
                    <TableHead className="text-gray-300">환불 금액</TableHead>
                    <TableHead className="text-gray-300">사유</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                    <TableHead className="text-gray-300">처리일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id} className="border-slate-700">
                      <TableCell className="text-white">{refund.userId}</TableCell>
                      <TableCell className="text-white">{refund.orderId}</TableCell>
                      <TableCell className="text-white">${refund.amount}</TableCell>
                      <TableCell className="text-gray-400">{refund.reason}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-900 text-green-200 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          완료
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(refund.processedAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

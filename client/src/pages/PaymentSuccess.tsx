import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Verify session
    fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrderDetails(data.order);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-accent" size={48} />
          <p className="text-foreground/70">결제 확인 중...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="card-luxury border-red-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={32} />
                <CardTitle className="text-red-600">결제 확인 실패</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground/70">
                결제 정보를 확인할 수 없습니다. 다시 시도해주세요.
              </p>
              <div className="flex gap-4">
                <Button 
                  className="btn-primary flex-1"
                  onClick={() => navigate('/checkout')}
                >
                  결제 다시 시도
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  홈으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="card-luxury border-green-200">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-green-500" size={32} />
              <div>
                <CardTitle className="text-green-600">결제 완료!</CardTitle>
                <CardDescription>구독이 활성화되었습니다</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-3">구독 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">플랜:</span>
                  <span className="font-semibold">{orderDetails?.tier_id?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">금액:</span>
                  <span className="font-semibold">${(orderDetails?.amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">구독 ID:</span>
                  <span className="font-mono text-xs">{orderDetails?.stripe_subscription_id?.slice(0, 20)}...</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-primary">다음 단계</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>대시보드에서 구독 관리</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>첫 번째 상담 예약</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>멤버 커뮤니티 접근</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>확인 이메일:</strong> 결제 확인 이메일이 발송되었습니다. 
                스팸 폴더를 확인해주세요.
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                className="btn-accent flex-1"
                onClick={() => navigate('/dashboard')}
              >
                대시보드로 이동
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                홈으로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

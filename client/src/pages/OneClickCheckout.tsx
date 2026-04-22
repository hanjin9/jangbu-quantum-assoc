import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreditCard, Loader2, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface CheckoutProps {
  tierId: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export default function OneClickCheckout({
  tierId,
  amount,
  currency = 'USD',
  onSuccess,
}: CheckoutProps) {
  const [, navigate] = useLocation();
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // tRPC 쿼리 및 뮤테이션
  const { data: cardsData, isLoading: loadingCards } = trpc.payment.getSavedCards.useQuery();
  const payWithCardMutation = trpc.payment.payWithSavedCard.useMutation();
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();

  // 카드 로드 시 첫 번째 카드 선택
  useEffect(() => {
    if (cardsData?.cards && cardsData.cards.length > 0) {
      setSelectedCardId(cardsData.cards[0].id);
    }
  }, [cardsData]);

  // 1클릭 결제 처리
  const handleQuickPay = async () => {
    setError('');

    if (!selectedCardId) {
      setError('카드를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await payWithCardMutation.mutateAsync({
        paymentMethodId: selectedCardId,
        tierId,
        amount,
        currency,
      });

      if (result.success && result.status === 'completed') {
        toast.success('결제가 완료되었습니다!');
        onSuccess?.();
        // 결제 성공 페이지로 이동
        setTimeout(() => navigate('/payment-success'), 1000);
      } else if (result.status === 'requires_action') {
        toast.info('추가 인증이 필요합니다.');
        // 3D Secure 인증 처리 (필요시)
      }
    } catch (err: any) {
      const errorMessage = err.message || '결제 처리에 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 새 카드로 결제
  const handleNewCardCheckout = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await createCheckoutMutation.mutateAsync({
        tierId,
        amount,
        currency,
      });

      if (result.success && result.checkoutUrl) {
        // Stripe Checkout으로 이동
        window.open(result.checkoutUrl, '_blank');
        toast.success('결제 페이지가 열렸습니다.');
      }
    } catch (err: any) {
      const errorMessage = err.message || '결제 페이지 생성에 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 카드 브랜드 아이콘
  const getBrandIcon = (brand: string) => {
    const brandMap: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
    };
    return brandMap[brand.toLowerCase()] || '💳';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="card-luxury">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-accent/10 rounded-full p-3">
              <CreditCard className="text-accent" size={32} />
            </div>
          </div>
          <CardTitle className="text-center">결제하기</CardTitle>
          <CardDescription className="text-center">
            {amount.toLocaleString()} {currency}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 저장된 카드가 있을 경우 */}
          {cardsData?.hasCards ? (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  결제 수단 선택
                </label>

                {cardsData.cards.map((card: SavedCard) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`w-full p-3 border-2 rounded-lg transition-all ${
                      selectedCardId === card.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getBrandIcon(card.brand)}</span>
                        <div className="text-left">
                          <p className="font-semibold text-sm capitalize">
                            {card.brand} •••• {card.last4}
                          </p>
                          <p className="text-xs text-foreground/50">
                            {card.expMonth}/{card.expYear}
                          </p>
                        </div>
                      </div>
                      {selectedCardId === card.id && (
                        <CheckCircle2 className="text-accent" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* 1클릭 결제 버튼 */}
              <Button
                onClick={handleQuickPay}
                disabled={loading || !selectedCardId}
                className="w-full btn-primary"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    결제 중...
                  </>
                ) : (
                  `${amount.toLocaleString()} ${currency} 결제`
                )}
              </Button>

              {/* 다른 카드로 결제 */}
              <Button
                onClick={handleNewCardCheckout}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <Plus className="mr-2" size={18} />
                다른 카드로 결제
              </Button>
            </>
          ) : (
            <>
              {/* 저장된 카드가 없을 경우 */}
              <div className="text-center py-6">
                <CreditCard className="mx-auto mb-3 text-foreground/30" size={40} />
                <p className="text-sm text-foreground/70 mb-4">
                  저장된 카드가 없습니다.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                onClick={handleNewCardCheckout}
                disabled={loading}
                className="w-full btn-primary"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2" size={18} />
                    카드로 결제
                  </>
                )}
              </Button>
            </>
          )}

          {/* 로딩 상태 */}
          {loadingCards && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-accent" size={24} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

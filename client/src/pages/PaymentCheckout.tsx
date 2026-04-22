import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
}

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MembershipTier {
  id: string;
  name: string;
  price: number;
}

const membershipTiers: Record<string, MembershipTier> = {
  basic: { id: 'basic', name: '일반 회원', price: 0 },
  professional: { id: 'professional', name: '전문가', price: 99000 },
  president: { id: 'president', name: '협회장', price: 0 },
};

export default function PaymentCheckout() {
  const [, navigate] = useLocation();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('professional');
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([
    { id: '1', name: '양자요법 기초 과정', price: 99000, quantity: 1 },
  ]);

  // URL에서 tier 파라미터 추출 및 멤버십 정보 설정
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || localStorage.getItem('selectedTier') || 'professional';
    
    setSelectedTier(tier);
    
    // 선택된 멤버십에 따라 상품 정보 업데이트
    const tierInfo = membershipTiers[tier];
    if (tierInfo) {
      const tierName = tier === 'professional' ? '전문가 멤버십' : 
                       tier === 'basic' ? '일반 회원 멤버십' : '협회장 멤버십';
      setCheckoutItems([
        { 
          id: tier, 
          name: tierName, 
          price: tierInfo.price, 
          quantity: 1 
        },
      ]);
    }
    
    // localStorage 정리
    localStorage.removeItem('selectedTier');
  }, []);

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 저장된 카드 조회
  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        // 실제로는 tRPC 호출로 저장된 카드 조회
        // const cards = await trpc.payment.getSavedCards.useQuery();
        // setSavedCards(cards);
        
        // 테스트용 더미 데이터
        setSavedCards([
          { id: 'card_1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025 },
          { id: 'card_2', brand: 'mastercard', last4: '5555', expMonth: 6, expYear: 2026 },
        ]);
        setSelectedCardId('card_1');
      } catch (err) {
        console.error('Failed to fetch saved cards:', err);
      }
    };

    fetchSavedCards();
  }, []);

  // 1클릭 결제
  const handleOneClickCheckout = async () => {
    setError('');
    if (!selectedCardId) {
      setError('결제 수단을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제로는 tRPC 호출로 결제 처리
      // const result = await trpc.payment.processOneClickCheckout.useMutation({
      //   cardId: selectedCardId,
      //   amount: totalAmount,
      //   items: checkoutItems,
      // });

      // 테스트용 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('결제가 완료되었습니다!');
      navigate('/payment-success');
    } catch (err) {
      setError('결제에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 새 카드 추가
  const handleAddNewCard = () => {
    navigate('/payment-method-add');
  };

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'from-blue-600 to-blue-700';
      case 'mastercard':
        return 'from-red-600 to-orange-600';
      case 'amex':
        return 'from-green-600 to-green-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getBrandLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      default:
        return 'CARD';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8">결제</h1>

        <div className="grid gap-8">
          {/* 주문 요약 */}
          <Card className="bg-slate-800 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white">주문 요약</CardTitle>
              <CardDescription className="text-gray-400">
                선택된 멤버십: <span className="text-amber-400 font-semibold">{membershipTiers[selectedTier]?.name || '선택 안 함'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <div>
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-gray-400 text-sm">수량: {item.quantity}</p>
                  </div>
                  <p className="text-amber-400 font-bold">₩{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <p className="text-lg font-bold text-white">총액</p>
                <p className="text-2xl font-bold text-amber-400">₩{totalAmount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* 결제 수단 선택 */}
          <Card className="bg-slate-800 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white">결제 수단</CardTitle>
              <CardDescription className="text-gray-400">저장된 카드 중 하나를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 저장된 카드 목록 */}
              <div className="space-y-3">
                {savedCards.length > 0 ? (
                  savedCards.map((card) => (
                    <label
                      key={card.id}
                      className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border-2 border-slate-600 hover:border-amber-500/50 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name="card"
                        value={card.id}
                        checked={selectedCardId === card.id}
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        className="w-5 h-5 text-amber-500 cursor-pointer"
                      />
                      <div className={`flex-shrink-0 w-16 h-10 rounded bg-gradient-to-r ${getBrandColor(card.brand)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{getBrandLogo(card.brand)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold capitalize">{card.brand}</p>
                        <p className="text-gray-400 text-sm">•••• •••• •••• {card.last4}</p>
                        <p className="text-gray-500 text-xs">{card.expMonth}/{card.expYear}</p>
                      </div>
                      {selectedCardId === card.id && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                    </label>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">저장된 카드가 없습니다.</p>
                )}
              </div>

              {/* 새 카드 추가 */}
              <button
                onClick={handleAddNewCard}
                className="w-full p-4 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500/50 transition flex items-center justify-center gap-2 text-gray-300 hover:text-amber-400"
              >
                <Plus className="w-5 h-5" />
                새 카드 추가
              </button>

              {/* 에러 메시지 */}
              {error && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결제 버튼 */}
          <Button
            onClick={handleOneClickCheckout}
            disabled={loading || !selectedCardId}
            className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-bold text-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                결제 처리 중...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                ₩{totalAmount.toLocaleString()} 결제하기
              </>
            )}
          </Button>

          {/* 보안 정보 */}
          <div className="text-center text-gray-400 text-sm">
            <p>🔒 모든 결제는 암호화되어 안전하게 처리됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

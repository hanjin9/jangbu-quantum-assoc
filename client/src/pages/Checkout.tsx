import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('gold');

  const tiers = [
    { id: 'silver', name: 'Silver', price: 299 },
    { id: 'gold', name: 'Gold', price: 599 },
    { id: 'platinum', name: 'Platinum', price: 999 },
    { id: 'diamond', name: 'Diamond', price: 1999 }
  ];

  const handleCheckout = async (tierId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId })
      });

      if (!response.ok) throw new Error('Checkout failed');
      
      const { checkoutUrl } = await response.json();
      window.open(checkoutUrl, '_blank');
      toast.success('Redirecting to checkout...');
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">
          멤버십 선택
        </h1>
        <p className="text-center text-foreground/70 mb-12">
          당신의 웰니스 여정을 시작하세요
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`card-luxury cursor-pointer transition-all ${
                selectedTier === tier.id ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <CardHeader>
                <CardTitle className="text-primary">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-accent">${tier.price}</span>
                  <span className="text-foreground/60">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="btn-accent w-full"
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                  선택하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle>안전한 결제</CardTitle>
              <CardDescription>
                Stripe를 통한 안전한 결제 처리
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-accent" size={20} />
                <span>256-bit SSL 암호화</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-accent" size={20} />
                <span>PCI DSS 준수</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-accent" size={20} />
                <span>언제든지 취소 가능</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

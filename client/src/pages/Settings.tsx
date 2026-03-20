import { FontSizeSettings } from '@/components/FontSizeSettings';
import { LanguageSettings } from '@/components/LanguageSettings';
import { Card } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-24">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-500 mb-8">설정</h1>

        <Card className="bg-slate-800 border-amber-500/30 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">글자 크기</h2>
          <FontSizeSettings />
          <p className="text-sm text-slate-400 mt-4">
            글자 크기를 조정하여 더 편하게 읽을 수 있습니다. 50/60대 사용자를 위해 최적화되었습니다.
          </p>
        </Card>

        <Card className="bg-slate-800 border-amber-500/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">다국어 지원</h2>
          <LanguageSettings />
          <p className="text-sm text-slate-400 mt-4">
            한국어, 영어, 중국어, 일본어, 스페인어를 지원합니다.
          </p>
        </Card>
      </div>
    </div>
  );
}

import { useFontSize, type FontSize } from '@/contexts/FontSizeContext';
import { Button } from '@/components/ui/button';

export function FontSizeSettings() {
  const { fontSize, setFontSize } = useFontSize();

  const sizes: { label: string; value: FontSize }[] = [
    { label: '작음', value: 'small' },
    { label: '중간', value: 'medium' },
    { label: '큼', value: 'large' },
    { label: '매우큼', value: 'xlarge' },
  ];

  return (
    <div className="flex gap-2 p-4 bg-slate-100 rounded-lg">
      <span className="text-sm font-semibold self-center">글자크기:</span>
      {sizes.map((size) => (
        <Button
          key={size.value}
          size="sm"
          variant={fontSize === size.value ? 'default' : 'outline'}
          onClick={() => setFontSize(size.value)}
          className="text-xs"
        >
          {size.label}
        </Button>
      ))}
    </div>
  );
}

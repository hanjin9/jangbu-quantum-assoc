import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface FontSizeStore {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  getScaleFactor: () => number;
}

export const useFontSize = create<FontSizeStore>()(
  persist(
    (set, get) => ({
      fontSize: 'medium',
      setFontSize: (size: FontSize) => set({ fontSize: size }),
      getScaleFactor: () => {
        const { fontSize } = get();
        const scales: Record<FontSize, number> = {
          small: 0.85,
          medium: 1,
          large: 1.2,
          xlarge: 1.5,
        };
        return scales[fontSize];
      },
    }),
    {
      name: 'font-size-storage',
    }
  )
);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const { fontSize, getScaleFactor } = useFontSize();
  const scale = getScaleFactor();

  return (
    <div style={{ fontSize: `${16 * scale}px` }} className="transition-all duration-200">
      {children}
    </div>
  );
}

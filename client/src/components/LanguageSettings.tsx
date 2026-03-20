import { useTranslation, getLanguageName, type Language } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export function LanguageSettings() {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  return (
    <div className="flex gap-2 p-4 bg-slate-100 rounded-lg flex-wrap">
      <span className="text-sm font-semibold self-center">언어:</span>
      {availableLanguages.map((lang) => (
        <Button
          key={lang}
          size="sm"
          variant={language === lang ? 'default' : 'outline'}
          onClick={() => changeLanguage(lang as Language)}
          className="text-xs"
        >
          {getLanguageName(lang as Language)}
        </Button>
      ))}
    </div>
  );
}

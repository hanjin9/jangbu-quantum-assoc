import { useTranslation, getLanguageName, type Language } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, changeLanguage, availableLanguages, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          title={t('common.language')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getLanguageName(language as Language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={language === lang ? 'bg-accent' : ''}
          >
            {getLanguageName(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

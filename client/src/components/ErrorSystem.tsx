import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export type ErrorLevel = 'error' | 'warning' | 'info' | 'success';

interface ErrorMessage {
  title: string;
  message: string;
  level: ErrorLevel;
}

/**
 * 페이지 레벨 오류 메시지 컴포넌트
 */
export function ErrorAlert({ title, message, level }: ErrorMessage) {
  const config = {
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 border-red-200 text-red-900',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      iconColor: 'text-yellow-600',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
    },
    success: {
      icon: CheckCircle2,
      className: 'bg-green-50 border-green-200 text-green-900',
      iconColor: 'text-green-600',
    },
  };

  const Icon = config[level].icon;

  return (
    <Alert className={config[level].className}>
      <Icon className={`h-4 w-4 ${config[level].iconColor}`} />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/**
 * 필드 레벨 오류 메시지 컴포넌트
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Toast 알림 함수들
 */
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 3500,
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

/**
 * 일반적인 오류 메시지 매핑
 */
export const errorMessages = {
  INVALID_EMAIL: '유효한 이메일을 입력해주세요.',
  INVALID_PASSWORD: '비밀번호는 최소 8자 이상이어야 합니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  EMAIL_ALREADY_EXISTS: '이미 가입된 이메일입니다.',
  INVALID_OTP: '인증 코드가 올바르지 않습니다.',
  OTP_EXPIRED: '인증 코드가 만료되었습니다. 다시 요청해주세요.',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
};

/**
 * 오류 코드에 따른 메시지 반환
 */
export function getErrorMessage(code: string): string {
  return errorMessages[code as keyof typeof errorMessages] || '오류가 발생했습니다.';
}

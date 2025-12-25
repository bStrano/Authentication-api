/**
 * Centralized error messages for internationalization
 * Currently supporting English (en) and Portuguese (pt-BR)
 */

export const ErrorMessages = {
  // Token related errors
  TOKEN_NOT_FOUND: {
    en: 'Token not found',
    'pt-BR': 'Token não encontrado',
  },
  TOKEN_EXPIRED: {
    en: 'Token expired',
    'pt-BR': 'Token expirado',
  },
  INVALID_TOKEN: {
    en: 'Invalid token',
    'pt-BR': 'Token inválido',
  },

  // Authentication errors
  INVALID_CREDENTIALS: {
    en: 'Invalid credentials',
    'pt-BR': 'Credenciais inválidas',
  },
  UNAUTHORIZED: {
    en: 'Unauthorized access',
    'pt-BR': 'Acesso não autorizado',
  },

  // User related errors
  USER_NOT_FOUND: {
    en: 'User not found',
    'pt-BR': 'Usuário não encontrado',
  },
  USER_ALREADY_EXISTS: {
    en: 'User already exists',
    'pt-BR': 'Usuário já existe',
  },
  EMAIL_ALREADY_IN_USE: {
    en: 'Email already in use',
    'pt-BR': 'Email já está em uso',
  },

  // Generic errors
  INTERNAL_SERVER_ERROR: {
    en: 'Internal server error',
    'pt-BR': 'Erro interno do servidor',
  },
  BAD_REQUEST: {
    en: 'Bad request',
    'pt-BR': 'Requisição inválida',
  },
  FORBIDDEN: {
    en: 'Forbidden',
    'pt-BR': 'Proibido',
  },
} as const;

/**
 * Helper function to get error message in the desired language
 * @param key - Error message key from ErrorMessages
 * @param lang - Language code (default: 'en')
 * @returns Localized error message
 */
export function getErrorMessage(
  key: keyof typeof ErrorMessages,
  lang: 'en' | 'pt-BR' = 'en',
): string {
  return ErrorMessages[key][lang] || ErrorMessages[key]['en'];
}

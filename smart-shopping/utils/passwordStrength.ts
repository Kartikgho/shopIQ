export type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * Weak: too short or missing letter category.
 * Medium: 8+ chars with at least two of (letters, digits, symbols).
 * Strong: 8+ chars with letters, digits, and symbols.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const len = password.length;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (len < 8 || !hasLetter) return 'weak';

  const categories = [hasLetter, hasDigit, hasSymbol].filter(Boolean).length;
  if (categories >= 3) return 'strong';
  if (categories >= 2) return 'medium';
  return 'weak';
}

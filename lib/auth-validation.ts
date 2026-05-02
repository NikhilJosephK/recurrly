const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  const t = email.trim();
  return t.length > 0 && EMAIL_RE.test(t);
}

export function meetsPasswordPolicy(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

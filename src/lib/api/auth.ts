import { apiFetch, ApiError } from './client';

export interface AdminUser {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role: 'admin' | 'staff' | 'user';
  plan?: string;
  status?: string;
  preferences?: Record<string, unknown>;
  created_at: string;
}

export async function getMe(): Promise<AdminUser> {
  const env = await apiFetch<{ data: AdminUser }>('/v1/me');
  return env.data;
}

export async function requestMagicLink(email: string): Promise<void> {
  await apiFetch('/v1/auth/magic', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function consumeMagicLink(token: string): Promise<AdminUser> {
  const env = await apiFetch<{ data: AdminUser }>('/v1/auth/magic/verify', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
  return env.data;
}

export async function logout(): Promise<void> {
  await apiFetch('/v1/auth/logout', { method: 'POST' });
}

// Simplified passkey stubs — real implementation uses @simplewebauthn/browser
export function passkeysSupported(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

export async function startPasskeyAuth(email?: string): Promise<AdminUser> {
  // In production this calls /v1/auth/passkey/authenticate
  // For mock: just returns the admin user
  const env = await apiFetch<{ data: AdminUser }>('/v1/auth/passkey/options');
  return env.data;
}

export async function registerPasskey(): Promise<void> {
  await apiFetch('/v1/me/passkey/register', { method: 'POST' });
}

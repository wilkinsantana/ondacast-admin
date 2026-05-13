import { getMe, requestMagicLink, consumeMagicLink, logout, passkeysSupported, startPasskeyAuth, type AdminUser } from '$lib/api/auth';

export type AuthStatus = 'unknown' | 'signed-in' | 'signed-out' | 'forbidden';

class AuthStore {
  user = $state<AdminUser | null>(null);
  status = $state<AuthStatus>('unknown');
  error = $state<string | null>(null);

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get isStaff(): boolean {
    return this.user?.role === 'staff' || this.user?.role === 'admin';
  }

  get isSignedIn(): boolean {
    return this.status === 'signed-in';
  }

  async refresh(): Promise<void> {
    try {
      this.error = null;
      const user = await getMe();
      if (!user) {
        this.user = null;
        this.status = 'signed-out';
      } else if (user.role === 'admin' || user.role === 'staff') {
        this.user = user;
        this.status = 'signed-in';
      } else {
        this.user = null;
        this.status = 'forbidden';
      }
    } catch (e: unknown) {
      this.user = null;
      this.status = 'signed-out';
      this.error = 'Failed to reach the server. Check your connection.';
    }
  }

  onSignedIn(user: AdminUser): void {
    this.user = user;
    this.status = 'signed-in';
    this.error = null;
  }

  async sendMagicLink(email: string): Promise<void> {
    this.error = null;
    await requestMagicLink(email);
  }

  async verifyMagicLink(token: string): Promise<void> {
    const user = await consumeMagicLink(token);
    if (user.role === 'admin' || user.role === 'staff') {
      this.onSignedIn(user);
    } else {
      this.user = null;
      this.status = 'forbidden';
      throw new Error('This account does not have admin access.');
    }
  }

  async signInWithPasskey(): Promise<void> {
    this.error = null;
    const user = await startPasskeyAuth();
    if (user.role === 'admin' || user.role === 'staff') {
      this.onSignedIn(user);
    } else {
      this.user = null;
      this.status = 'forbidden';
      throw new Error('This account does not have admin access.');
    }
  }

  async signOut(): Promise<void> {
    try {
      await logout();
    } catch {
      // Ignore logout errors
    }
    this.user = null;
    this.status = 'signed-out';
    this.error = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oc_admin_last_email');
    }
  }

  get passkeysAvailable(): boolean {
    return passkeysSupported();
  }
}

export const auth = new AuthStore();

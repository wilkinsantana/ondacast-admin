// Step-up auth: requires fresh passkey assertion for destructive operations.
// Phase 1: stub that always resolves. Full implementation in Phase 11.

class StepUpStore {
  lastVerified = $state<number | null>(null);

  get isFresh(): boolean {
    if (!this.lastVerified) return false;
    return Date.now() - this.lastVerified < 5 * 60 * 1000; // 5 minutes
  }

  async require(_action: string): Promise<boolean> {
    // Stub: always succeeds in mock mode
    this.lastVerified = Date.now();
    return true;
  }

  reset(): void {
    this.lastVerified = null;
  }
}

export const stepUp = new StepUpStore();

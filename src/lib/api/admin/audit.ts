import { auditLog } from '$lib/mock/data';
import type { AuditEntry } from '$lib/types/models';

export async function getAuditLog(): Promise<AuditEntry[]> {
  return auditLog;
}

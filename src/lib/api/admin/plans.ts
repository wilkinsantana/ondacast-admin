import { apiFetch } from '$lib/api/client';
import { plans as mockPlans } from '$lib/mock/data';
import type { Plan } from '$lib/types/models';

const MOCK = import.meta.env.PUBLIC_MOCK_API === '1';

export async function getPlans(): Promise<Plan[]> {
  if (MOCK) return mockPlans;
  return apiFetch<Plan[]>('/admin/plans');
}

export async function createPlan(plan: Omit<Plan, 'id'> & { id: string }): Promise<Plan> {
  if (MOCK) return { ...plan, featured: false };
  await apiFetch('/admin/plans', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
  return { ...plan, featured: plan.featured ?? false };
}

export async function updatePlan(id: string, patch: Partial<Plan>): Promise<void> {
  if (MOCK) return;
  await apiFetch(`/admin/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deletePlan(id: string): Promise<void> {
  if (MOCK) return;
  await apiFetch(`/admin/plans/${id}`, { method: 'DELETE' });
}

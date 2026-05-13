import { users } from '$lib/mock/data';
import type { OCUser } from '$lib/types/models';

export async function getUsers(): Promise<OCUser[]> {
  return users;
}

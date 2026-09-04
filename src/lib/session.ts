import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

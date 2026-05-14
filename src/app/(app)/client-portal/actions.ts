'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function loginClient(taxId: string) {
  const client = await prisma.client.findFirst({
    where: { taxId: taxId.trim() }
  });

  if (!client) {
    throw new Error("Codice di accesso (P.IVA/CF) non valido.");
  }

  // In a real app, I'd set a cookie or JWT.
  // For this mock, I'll redirect to a client-specific route.
  redirect(`/client-portal/${client.id}`);
}

export async function getClientDashboardData(clientId: string) {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: {
      projects: {
        include: {
          sal: {
            include: { voci: true }
          },
          fatture: true,
          ddts: true
        }
      }
    }
  });
}

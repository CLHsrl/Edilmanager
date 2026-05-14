import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type Role = "ADMIN" | "PM" | "OPERAIO";

interface ServerSession {
  userId: string;
  userName: string;
  role: Role;
}

export async function getServerSession(): Promise<ServerSession> {
  const session = await auth();

  if (!session || !session.user) {
    // In server actions or layouts, redirect to login if no session
    redirect("/login");
  }

  return {
    userId: (session.user as any).id,
    userName: session.user.name || "Utente",
    role: (session.user as any).role as Role,
  };
}

export async function validateAdminRole() {
  const session = await getServerSession();
  if (session.role !== "ADMIN") {
    throw new Error(
      "AUTHORIZATION ERROR: Azione riservata alla Direzione (ADMIN). Operazione annullata."
    );
  }
  return session;
}

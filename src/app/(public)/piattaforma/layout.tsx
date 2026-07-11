import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Piattaforma EdilManager24 | Il Gestionale Completo per Edilizia",
  description: "Scopri come EdilManager24 integra preventivi, rapportini, fatture e controllo costi in un'unica piattaforma cloud."
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children;
}


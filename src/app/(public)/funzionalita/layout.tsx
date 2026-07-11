import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funzionalità | EdilManager24",
  description: "Dalle fatture SDI al controllo dei mezzi: scopri tutte le funzionalità che semplificano la gestione della tua impresa edile."
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}


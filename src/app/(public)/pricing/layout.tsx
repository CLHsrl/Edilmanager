import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prezzi e Piani | EdilManager24",
  description: "Scegli il piano più adatto alla tua impresa edile. Gestisci da 5 operai a un'intera azienda multi-società."
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}


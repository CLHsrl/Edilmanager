import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L'Azienda | Chi è EdilManager24",
  description: "Siamo un team di professionisti dell'edilizia e della tecnologia, uniti per digitalizzare i cantieri italiani."
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}


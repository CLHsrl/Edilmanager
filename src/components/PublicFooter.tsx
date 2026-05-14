import Link from 'next/link';
import Logo from '@/components/Logo';

export default function PublicFooter() {
    return (
        <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="mb-6">
                        <Logo variant="light" />
                    </div>
                    <p className="text-sm max-w-sm mb-8 leading-relaxed">
                        Il sistema operativo definitivo per le imprese edili moderne. Innovazione, tecnologia e controllo totale in un unico posto.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Prodotto</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/features" className="hover:text-white transition-colors">Funzionalità</Link></li>
                        <li><Link href="/platform" className="hover:text-white transition-colors">Piattaforma</Link></li>
                        <li><Link href="/pricing" className="hover:text-white transition-colors">Prezzi</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Risorse</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Guide</Link></li>
                        <li><Link href="/#quiz" className="hover:text-white transition-colors">Maturity Quiz</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Azienda</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/about" className="hover:text-white transition-colors">Chi Siamo</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-900 py-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                <p>© {new Date().getFullYear()} EdilManager Srl — P.IVA IT12345678900. Tutti i diritti riservati.</p>
                <span className="font-bold text-gray-600 uppercase tracking-widest text-[9px]">Made in Italy · GDPR Compliant</span>
            </div>
        </footer>
    );
}

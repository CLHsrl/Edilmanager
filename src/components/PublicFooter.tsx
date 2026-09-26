import Link from 'next/link';
import { Building2, Shield, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicFooter() {
    return (
        <footer className="bg-[#00273D] text-white/70 border-t border-white/10 font-sans">
            {/* Top Brand Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                
                {/* Brand Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Logo variant="light" href="/" />
                    <p className="text-sm text-white/70 max-w-sm leading-relaxed">
                        La piattaforma cloud all-in-one per il coordinamento dei cantieri, contabilità analitica, monitoraggio margini e portale clienti. Creata da costruttori per costruttori.
                    </p>
                    <div className="pt-2 flex flex-col gap-2.5 text-xs text-white/60">
                        <div className="flex items-center gap-2.5">
                            <Building2 size={15} className="text-[#FEDE59]" />
                            <span>Progetto sviluppato da RifacciamoCasa Srl</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Shield size={15} className="text-emerald-400" />
                            <span>Infrastruttura sicura Cloud Enterprise • SSL 256-bit</span>
                        </div>
                    </div>
                </div>

                {/* Moduli */}
                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        Moduli Software
                    </h4>
                    <ul className="space-y-3 text-xs font-medium">
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Gestione Cantieri & SAL</a></li>
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Contabilità & Finanze</a></li>
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Squadre & Presenze</a></li>
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Portale Clienti Privato</a></li>
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Fatturazione & Preventivi</a></li>
                        <li><a href="#moduli" className="hover:text-[#FEDE59] transition-colors">Strategic Financial Advisor</a></li>
                    </ul>
                </div>

                {/* Navigazione */}
                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        Navigazione
                    </h4>
                    <ul className="space-y-3 text-xs font-medium">
                        <li><a href="#dashboard-anteprima" className="hover:text-[#FEDE59] transition-colors">Anteprima Dashboard</a></li>
                        <li><a href="#confronto" className="hover:text-[#FEDE59] transition-colors">Perché Abbandonare Excel</a></li>
                        <li><a href="#prezzi" className="hover:text-[#FEDE59] transition-colors">Piani & Licenze</a></li>
                        <li><Link href="/login" className="text-[#FEDE59] font-bold hover:underline flex items-center gap-1.5">
                            <span>Area Riservata Staff</span>
                            <ArrowRight size={12} />
                        </Link></li>
                        <li><Link href="/login" className="hover:text-white transition-colors">Accesso Clienti & Committenti</Link></li>
                    </ul>
                </div>

                {/* Assistenza & Contatti */}
                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        Supporto Imprese
                    </h4>
                    <ul className="space-y-3 text-xs font-medium">
                        <li className="flex items-center gap-2 text-white/80">
                            <Phone size={14} className="text-[#FEDE59]" />
                            <a href="tel:+393331234567" className="hover:text-white">+39 333 123 4567</a>
                        </li>
                        <li className="flex items-center gap-2 text-white/80">
                            <Mail size={14} className="text-[#FEDE59]" />
                            <a href="mailto:info@edilmanager24.it" className="hover:text-white">info@edilmanager24.it</a>
                        </li>
                        <li className="flex items-start gap-2 text-white/60 pt-1">
                            <MapPin size={14} className="text-[#FEDE59] shrink-0 mt-0.5" />
                            <span>Sede Operativa: Milano / Roma • Italia</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-[#001f30]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/40 font-medium">
                    <p>
                        © {new Date().getFullYear()} EDILMANAGER24 • RifacciamoCasa Srl — P.IVA IT01234567890. Tutti i diritti riservati.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-white/60">Software Gestionale Edile Professionale</span>
                        <span>•</span>
                        <span className="text-[#FEDE59]">Made in Italy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

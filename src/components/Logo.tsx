import Link from 'next/link';

interface LogoProps {
    variant?: 'dark' | 'light';
    href?: string;
    className?: string;
}

export default function Logo({ variant = 'dark', href = '/', className = '' }: LogoProps) {
    const isLight = variant === 'light';
    const mainTextColor = isLight ? 'text-white' : 'text-[#003F61]';
    const subColor = isLight ? 'text-white/60' : 'text-slate-500';

    const inner = (
        <div className={`flex flex-col ${className}`}>
            <span className="font-bold text-xl leading-tight uppercase tracking-tight">
                <span className={mainTextColor}>EDIL</span>
                <span className="text-[#FEDE59]">MANAGER</span>
                <span className={mainTextColor}>24</span>
            </span>
            <span className={`text-[10px] tracking-wider font-medium ${subColor}`}>
                by RifacciamoCasa
            </span>
        </div>
    );

    if (!href) return inner;
    return (
        <Link href={href} className="group transition-transform hover:opacity-90">
            {inner}
        </Link>
    );
}

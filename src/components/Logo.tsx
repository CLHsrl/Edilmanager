import Link from 'next/link';

interface LogoProps {
    variant?: 'dark' | 'light';
    href?: string;
    className?: string;
}

export default function Logo({ variant = 'dark', href = '/', className = '' }: LogoProps) {
    const isLight = variant === 'light';
    
    const markStyles = isLight
        ? 'bg-white text-slate-900'
        : 'bg-slate-900 text-white';
        
    const textStyles = isLight
        ? 'text-white'
        : 'text-slate-900';

    const inner = (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg shadow-sm ${markStyles}`}>
                E
            </div>
            <span className={`font-black text-xl tracking-tighter uppercase ${textStyles}`}>
                EdilManager
            </span>
        </div>
    );

    if (!href) return inner;
    return (
        <Link href={href} className="group transition-transform hover:scale-[1.02] active:scale-[0.98]">
            {inner}
        </Link>
    );
}

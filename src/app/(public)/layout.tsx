import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import ScrollReveal from '@/components/ScrollReveal';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col font-sans relative">
            <ScrollReveal />
            <PublicNavbar />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}

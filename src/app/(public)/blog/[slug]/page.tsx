import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, ArrowRight, BookOpen, Clock, Bookmark } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

    return (
        <article className="bg-white min-h-screen pt-8 pb-20">
            {/* HERO HEADER — Full Width */}
            <div className="bg-slate-50 border-b border-slate-100 pt-8 pb-16 mb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
                    >
                        <ArrowLeft size={16} /> Torna al Blog
                    </Link>

                    <div className="max-w-4xl">
                        <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                            {post.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
                            {post.title}
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-10">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-300"/> {post.date}</span>
                            <span className="flex items-center gap-2"><User size={14} className="text-slate-300"/> {post.author}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-slate-300"/> 5 min lettura</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* COVER IMAGE */}
                <div className="aspect-[21/8] bg-slate-100 rounded-[2.5rem] mb-16 overflow-hidden border border-slate-100 shadow-2xl">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* TWO-COLUMN LAYOUT */}
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        <div 
                            className="prose prose-slate prose-lg max-w-none 
                                prose-h3:text-3xl prose-h3:font-black prose-h3:tracking-tighter prose-h3:text-slate-900 prose-h3:mb-6 prose-h3:mt-14
                                prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:mb-6 prose-p:text-[1.0625rem]
                                prose-strong:text-slate-900 prose-strong:font-black"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* SHARE & CTA */}
                        <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Condividi l'articolo</p>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 transition-colors border border-slate-100">
                                        <Share2 size={14} /> LinkedIn
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 transition-colors border border-slate-100">
                                        <Bookmark size={14} /> Salva
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CONVERSION CTA - Bottom Article */}
                        <div className="mt-16 p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 blur-3xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                    <BookOpen size={14} /> Metti in pratica
                                </div>
                                <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Ti è piaciuto questo articolo?</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed max-w-lg">Vedi come EdilManager può aiutarti ad applicare queste strategie nella tua azienda. Demo gratuita, senza carta di credito.</p>
                                <Link href="/#contatti" className="inline-flex bg-blue-600 hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all items-center gap-2 group shadow-xl shadow-blue-900/30">
                                    Prenota una Demo Gratuita <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* STICKY SIDEBAR */}
                    <aside className="lg:w-[340px] shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {/* AUTHOR CARD */}
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">L'Autore</p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-200">
                                        {post.author.charAt(post.author.lastIndexOf(' ') + 1)}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900">{post.author}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Esperto di Settore</div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Consulente con oltre 15 anni di esperienza nella digitalizzazione delle imprese edili.
                                </p>
                            </div>

                            {/* RELATED ARTICLES */}
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Articoli Correlati</p>
                                <div className="space-y-6">
                                    {relatedPosts.map((related, i) => (
                                        <Link key={i} href={`/blog/${related.slug}`} className="flex gap-4 group cursor-pointer">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                <img src={related.image} alt={related.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">{related.category}</div>
                                                <div className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {related.title}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* MINI CTA CARD */}
                            <div className="bg-blue-600 rounded-[2rem] p-8 text-white">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4">EdilManager</p>
                                <h4 className="text-xl font-black mb-4 leading-tight">Pronto a gestire i cantieri in modo intelligente?</h4>
                                <Link href="/#contatti" className="flex items-center justify-center gap-2 w-full bg-white text-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">
                                    Inizia Gratis <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}

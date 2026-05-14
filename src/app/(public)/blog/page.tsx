'use client';

import { ArrowRight, Clock, User } from 'lucide-react';
import Link from 'next/link';

import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogPage() {
    return (
        <div className="bg-corporate min-h-screen pt-16 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center reveal">
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8">
                        Industry <span className="text-blue-600">Insights.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Esplora le ultime tendenze tecnologiche e strategiche nel mondo dell'edilizia moderna.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post, i) => (
                        <Link href={`/blog/${post.slug}`} key={i} className="bento-card bg-white hover:border-blue-600 transition-all group cursor-pointer reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="aspect-video bg-slate-100 rounded-xl mb-6 overflow-hidden border border-slate-100 relative">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
                                <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">{post.category}</div>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                                <span className="flex items-center gap-1"><Clock size={12} /> {post.date}</span>
                                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:translate-x-2 transition-transform">
                                Leggi Articolo <ArrowRight size={14} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

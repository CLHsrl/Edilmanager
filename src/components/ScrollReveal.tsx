'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — Adds the .is-visible class to all .reveal elements
 * as they enter the viewport. Works globally on every page.
 */
export default function ScrollReveal() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.06,
                rootMargin: '0px 0px -32px 0px',
            }
        );

        const attachObserver = () => {
            const elements = document.querySelectorAll('.reveal:not([data-observed])');
            elements.forEach((el) => {
                el.setAttribute('data-observed', 'true');

                // Auto-stagger siblings in the same parent
                const siblings = el.parentElement
                    ? Array.from(el.parentElement.querySelectorAll(':scope > .reveal'))
                    : [];
                const idx = siblings.indexOf(el);
                if (idx > 0) {
                    (el as HTMLElement).style.transitionDelay = `${idx * 0.08}s`;
                }

                observerRef.current?.observe(el);
            });
        };

        attachObserver();

        // Re-attach on route changes (Next.js soft navigation)
        const mo = new MutationObserver(attachObserver);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            observerRef.current?.disconnect();
            mo.disconnect();
        };
    }, []);

    return null;
}

'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, HardHat, Receipt, Users, Truck, 
  Package, UserCheck, ArrowRight, X, Loader2,
  Calendar, MapPin, Building2, TrendingUp, ChevronRight
} from 'lucide-react';
import { searchGlobal, SearchResultItem, SearchResultCategory } from '@/app/(app)/search-actions';

const CATEGORIES: { key: string; label: string; icon: any }[] = [
  { key: 'ALL', label: 'Tutti', icon: Search },
  { key: 'CANTIERI', label: 'Cantieri', icon: HardHat },
  { key: 'FATTURE', label: 'Fatture', icon: Receipt },
  { key: 'CLIENTI', label: 'Clienti', icon: Users },
  { key: 'FORNITORI', label: 'Fornitori', icon: Truck },
  { key: 'PERSONALE', label: 'Personale', icon: UserCheck },
  { key: 'MAGAZZINO', label: 'Magazzino', icon: Package },
];

export default function GlobalSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Trigger search with debounce
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchGlobal(query, activeCategory);
        setResults(res);
        setSelectedIndex(0);
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [query, activeCategory, isOpen]);

  const handleSelectResult = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const getCategoryIcon = (cat: SearchResultCategory) => {
    switch (cat) {
      case 'CANTIERI': return <HardHat size={16} className="text-[#003F61]" />;
      case 'FATTURE': return <Receipt size={16} className="text-amber-700" />;
      case 'CLIENTI': return <Users size={16} className="text-blue-700" />;
      case 'FORNITORI': return <Truck size={16} className="text-emerald-700" />;
      case 'PERSONALE': return <UserCheck size={16} className="text-purple-700" />;
      case 'MAGAZZINO': return <Package size={16} className="text-indigo-700" />;
      default: return <Search size={16} className="text-slate-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search Input Bar */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex items-center bg-slate-50 border h-10 px-3 w-full transition-colors cursor-text ${
          isOpen ? 'border-[#003F61] bg-white ring-1 ring-[#003F61]' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <Search size={16} className="text-slate-400 shrink-0 mr-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cerca cantieri, fatture, clienti, fornitori... (Ctrl+K)"
          className="bg-transparent border-none outline-none text-xs font-medium w-full text-slate-800 placeholder-slate-400"
        />

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {isPending && <Loader2 size={14} className="animate-spin text-slate-400" />}
          {query && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 uppercase">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Advanced Search Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-xl z-50 flex flex-col max-h-[80vh] overflow-hidden">
          {/* Category Filter Pills Header */}
          <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`h-7 px-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0 ${
                    isActive 
                      ? 'bg-[#003F61] text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-[#FEDE59]' : 'text-slate-400'} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[420px]">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-50 border-l-2 border-l-[#003F61]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-8 h-8 bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                              item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.detail && (
                        <span className="text-xs font-bold text-[#003F61]">
                          {item.detail}
                        </span>
                      )}
                      <ArrowRight size={14} className={`text-slate-400 ${isSelected ? 'text-[#003F61] translate-x-0.5' : ''} transition-transform`} />
                    </div>
                  </div>
                );
              })
            ) : !isPending ? (
              <div className="p-8 text-center">
                <Search size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">Nessun elemento trovato per "{query}"</p>
                <p className="text-[11px] text-slate-400 mt-1">Prova a digitare il nome del cantiere, il numero fattura, o la ragione sociale del cliente.</p>
              </div>
            ) : null}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-2">
              <span>Naviga <kbd className="px-1 bg-white border border-slate-200 font-bold">↑</kbd> <kbd className="px-1 bg-white border border-slate-200 font-bold">↓</kbd></span>
              <span>•</span>
              <span>Apri <kbd className="px-1 bg-white border border-slate-200 font-bold">↵</kbd></span>
              <span>•</span>
              <span>Chiudi <kbd className="px-1 bg-white border border-slate-200 font-bold">ESC</kbd></span>
            </span>
            <span className="font-bold text-[#003F61] uppercase tracking-wider">
              Ricerca Avanzata EDILMANAGER24
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

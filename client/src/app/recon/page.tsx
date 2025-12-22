'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Shield, Download, Cpu, Activity } from 'lucide-react';

interface Entity {
  module: string;
  type: string;
  value: string;
  metadata: any;
}

export default function ReconPage() {
  const [target, setTarget] = useState('');
  const [results, setResults] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = () => {
    const reportData = JSON.stringify({ target, results, date: new Date().toISOString() }, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lakeinator-intel-${target || 'unknown'}.json`;
    a.click();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`http://localhost:8000/api/recon?target=${encodeURIComponent(target)}`);
      if (!res.ok) throw new Error('Failed to fetch intelligence data');
      const data = await res.json();
      setResults(data.entities);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Passive Recon Hub</h1>
            <p className="text-xs text-green-800 uppercase tracking-widest">Automated Multi-Source Intelligence Aggregation</p>
          </div>
          <Link href="/" className="text-xs hover:text-green-300 transition-colors">
            [ RETURN_TO_CORE ]
          </Link>
        </header>

        <section className="mb-12">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="ENTER_DOMAIN_OR_IP (e.g., google.com)"
              className="flex-1 bg-zinc-950 border border-green-900 p-4 text-green-300 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-900/20 border border-green-500 px-8 py-4 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 uppercase font-bold text-sm tracking-widest"
            >
              {loading ? 'EXECUTING...' : 'INITIATE_SCAN'}
            </button>
          </form>
        </section>

        {error && (
          <div className="border border-red-900 bg-red-950/10 p-4 mb-8 text-red-500 text-sm">
            [!] ERROR: {error}
          </div>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-800" />
              <h2 className="text-sm font-bold text-green-800 uppercase border-l-2 border-green-800 pl-2">Harvested Intelligence</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-zinc-600">{results.length} ENTITIES_FOUND</span>
              {results.length > 0 && (
                <button 
                  onClick={generateReport}
                  className="flex items-center gap-2 text-[10px] text-green-500 border border-green-900 px-2 py-1 hover:bg-green-900/20 transition-colors"
                >
                  <Download size={12} />
                  GENERATE_REPORT
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {results.map((entity, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-900 p-3 hover:border-green-900/50 group transition-colors">
                <div className="w-32 shrink-0">
                  <span className="text-[10px] bg-green-900/20 text-green-600 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                    {entity.type}
                  </span>
                </div>
                <div className="flex-1 font-bold text-zinc-300 group-hover:text-green-400 truncate">
                  {entity.value}
                </div>
                <div className="w-32 text-right shrink-0">
                  <span className="text-[9px] text-zinc-700 uppercase italic">
                    via {entity.module}
                  </span>
                </div>
              </div>
            ))}
            
            {!loading && results.length === 0 && !error && (
              <div className="h-48 flex items-center justify-center border border-dashed border-green-900/30 text-zinc-800 uppercase text-xs tracking-[0.2em]">
                System idle. Awaiting target parameters.
              </div>
            )}
            
            {loading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-900/20 animate-pulse border border-zinc-900" />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

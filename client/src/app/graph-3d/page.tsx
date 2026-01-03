'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Rotate3d } from 'lucide-react';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface Node {
  id: string;
  name: string;
  type: string;
  val: number;
  color: string;
}

interface LinkType {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: LinkType[];
}

const TYPE_COLORS: Record<string, string> = {
  target: '#22c55e',
  subdomain: '#3b82f6',
  registrar: '#eab308',
  domain_event: '#a855f7',
  ip_address: '#f97316',
  open_port: '#ec4899',
  system_info: '#71717a',
  error: '#ef4444',
};

export default function Graph3DPage() {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setLoading(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/recon?target=${encodeURIComponent(target)}`);
      const data = await res.json();
      
      const nodes: Node[] = [{ id: target, name: target, type: 'target', val: 12, color: TYPE_COLORS.target }];
      const links: LinkType[] = [];

      data.entities.forEach((entity: { type: string; value: string }) => {
        const nodeId = `${entity.type}-${entity.value}`;
        if (!nodes.find(n => n.id === nodeId)) {
          nodes.push({
            id: nodeId,
            name: entity.value,
            type: entity.type,
            val: 8,
            color: TYPE_COLORS[entity.type] || '#71717a'
          });
        }
        links.push({ source: target, target: nodeId });
      });

      setGraphData({ nodes, links });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col">
      <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end shrink-0 z-10">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter flex items-center gap-3">
            <Rotate3d className="text-green-500" /> 3D Nexus Visualization
          </h1>
          <p className="text-xs text-green-800 uppercase tracking-widest">Multi-Dimensional Entity Correlation Space</p>
        </div>
        <div className="flex gap-4">
          <Link href="/graph" className="text-[10px] border border-green-900 px-2 py-1 hover:bg-green-900/20">
            [ SWITCH_TO_2D ]
          </Link>
          <Link href="/" className="text-[10px] border border-green-900 px-2 py-1 hover:bg-green-900/20">
            [ RETURN_TO_CORE ]
          </Link>
        </div>
      </header>

      <section className="mb-8 shrink-0 z-10">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="INITIALIZE_SPACE_COORD (e.g., example.com)"
            className="flex-1 bg-zinc-950/80 border border-green-900 p-3 text-green-300 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900/20 border border-green-500 px-6 py-3 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 uppercase font-bold text-xs tracking-widest"
          >
            {loading ? 'CALIBRATING...' : 'PROJECT_3D_MAP'}
          </button>
        </form>
      </section>

      <div className="flex-1 border border-green-900/30 bg-black relative overflow-hidden rounded-lg shadow-[inset_0_0_50px_rgba(34,197,94,0.1)]">
        {graphData.nodes.length > 0 ? (
          <ForceGraph3D
            graphData={graphData}
            backgroundColor="#000000"
            nodeColor={(node) => (node as Node).color}
            linkColor={() => '#164e63'}
            nodeLabel={(node) => {
              const n = node as Node;
              return `${n.type.toUpperCase()}: ${n.name}`;
            }}
            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={0.006}
            showNavInfo={true}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-900 uppercase text-xs tracking-[0.5em] animate-pulse">
            Awaiting dimensionality projection...
          </div>
        )}
      </div>
    </div>
  );
}

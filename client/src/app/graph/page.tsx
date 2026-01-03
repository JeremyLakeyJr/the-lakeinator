'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for react-force-graph-2d to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

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
  target: '#22c55e',    // Green
  subdomain: '#3b82f6', // Blue
  registrar: '#eab308', // Yellow
  domain_event: '#a855f7', // Purple
  ip_address: '#f97316', // Orange
  open_port: '#ec4899',  // Pink
  system_info: '#71717a', // Zinc
  error: '#ef4444',     // Red
};

export default function GraphPage() {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setLoading(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/recon?target=${encodeURIComponent(target)}`);
      if (!res.ok) throw new Error('Failed to fetch intelligence data');
      const data = await res.json();
      
      // Transform data to graph format
      const nodes: Node[] = [{ 
        id: target, 
        name: target, 
        type: 'target', 
        val: 10, 
        color: TYPE_COLORS.target 
      }];
      const links: LinkType[] = [];

      data.entities.forEach((entity: { type: string; value: string }) => {
        const nodeId = `${entity.type}-${entity.value}`;
        
        // Add node if it doesn't exist
        if (!nodes.find(n => n.id === nodeId)) {
          nodes.push({
            id: nodeId,
            name: entity.value,
            type: entity.type,
            val: 5,
            color: TYPE_COLORS[entity.type] || '#71717a'
          });
        }
        
        // Add link from target to this node
        links.push({
          source: target,
          target: nodeId
        });
      });

      setGraphData({ nodes, links });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col">
      <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Link Analysis Engine</h1>
          <p className="text-xs text-green-800 uppercase tracking-widest">Visual Relationship Mapping & Entity Correlation</p>
        </div>
        <Link href="/" className="text-xs hover:text-green-300 transition-colors">
          [ RETURN_TO_CORE ]
        </Link>
      </header>

      <section className="mb-8 shrink-0">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="ENTER_DOMAIN_OR_IP (e.g., example.com)"
            className="flex-1 bg-zinc-950 border border-green-900 p-3 text-green-300 focus:outline-none focus:border-green-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900/20 border border-green-500 px-6 py-3 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 uppercase font-bold text-xs tracking-widest"
          >
            {loading ? 'MAPPING...' : 'GENERATE_GRAPH'}
          </button>
        </form>
      </section>

      <div className="flex-1 border border-green-900/30 bg-zinc-950/50 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-sm animate-pulse tracking-[0.3em]">RECON_IN_PROGRESS...</div>
          </div>
        )}
        
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            graphData={graphData}
            nodeLabel={(node) => {
              const n = node as Node;
              return `${n.type.toUpperCase()}: ${n.name}`;
            }}
            nodeColor={(node) => (node as Node).color}
            linkColor={() => '#164e63'}
            backgroundColor="#000000"
            nodeRelSize={6}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            onNodeClick={(node) => {
               // Future: Expand node or show details
               console.log('Clicked node:', node);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-800 uppercase text-xs tracking-[0.2em]">
            Initialize session to visualize entity relationships
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/80 border border-green-900 p-3 text-[10px] space-y-1">
          <p className="text-green-800 font-bold mb-2">LEGEND</p>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="uppercase">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

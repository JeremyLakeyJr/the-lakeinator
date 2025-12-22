import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full border border-green-900 bg-zinc-950 p-12 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <header className="mb-12 border-b border-green-900 pb-6">
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">
            The Lakeinator <span className="animate-pulse">_</span>
          </h1>
          <p className="text-green-700 uppercase tracking-widest text-xs">
            All-in-One Open Source Intelligence Platform
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-l-4 border-green-500 pl-4 mb-4">Core Systems</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-green-900">[+]</span>
                <Link href="/nexus" className="hover:text-green-300 underline underline-offset-4 decoration-green-900 hover:decoration-green-500">Nexus Directory</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-900">[+]</span>
                <Link href="/recon" className="hover:text-green-300 underline underline-offset-4 decoration-green-900 hover:decoration-green-500">Passive Recon Hub</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-900">[+]</span>
                <Link href="/graph" className="hover:text-green-300 underline underline-offset-4 decoration-green-900 hover:decoration-green-500">2D Relationship Mapper</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-900">[+]</span>
                <Link href="/graph-3d" className="hover:text-green-300 underline underline-offset-4 decoration-green-900 hover:decoration-green-500">3D Nexus Visualization</Link>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-900">[+]</span>
                <Link href="/recon" className="hover:text-green-300 underline underline-offset-4 decoration-green-900 hover:decoration-green-500">IoT Discovery Matrix</Link>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-l-4 border-green-500 pl-4 mb-4">Active Session</h2>
            <div className="bg-black border border-green-900 p-4 text-xs space-y-1">
              <p className="text-green-800 font-bold">SYSTEM_LOG:</p>
              <p>{'>'} Booting Lakeinator Core v0.1.0...</p>
              <p>{'>'} Initializing modular plugin architecture...</p>
              <p>{'>'} Awaiting target parameters...</p>
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-6 border-t border-green-900 text-[10px] text-green-900 flex justify-between uppercase">
          <span>Encrypted Session: Active</span>
          <span>Security Status: Nominal</span>
        </footer>
      </div>
    </div>
  );
}
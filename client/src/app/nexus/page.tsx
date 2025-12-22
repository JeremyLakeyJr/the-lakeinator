'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tool {
  name: string;
  url: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
}

export default function NexusPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/directory')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch directory:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter">Nexus Directory</h1>
            <p className="text-xs text-green-800 uppercase tracking-widest">Global OSINT Resource Matrix</p>
          </div>
          <Link href="/" className="text-xs hover:text-green-300 transition-colors">
            [ RETURN_TO_CORE ]
          </Link>
        </header>

        {loading ? (
          <div className="animate-pulse">Accessing database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar: Categories */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-green-800 uppercase mb-4 border-l-2 border-green-800 pl-2">Categories</h2>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left p-3 border text-sm transition-all ${
                    selectedCategory?.id === cat.id
                      ? 'bg-green-900/20 border-green-500 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      : 'bg-zinc-950 border-green-900 hover:border-green-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Main Content: Tools */}
            <div className="md:col-span-2">
              {selectedCategory ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-green-300">{selectedCategory.name}</h2>
                    <p className="text-sm text-green-700 mt-1">{selectedCategory.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCategory.tools.map((tool) => (
                      <div key={tool.name} className="bg-zinc-950 border border-green-900 p-4 hover:border-green-600 transition-colors group">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold group-hover:text-green-400">{tool.name}</h3>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-green-900/30 px-2 py-1 hover:bg-green-500 hover:text-black transition-colors"
                          >
                            LAUNCH_TOOL
                          </a>
                        </div>
                        <p className="text-xs text-green-800 mt-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-green-900 text-green-900 uppercase text-xs tracking-widest">
                  Select a category to initialize search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

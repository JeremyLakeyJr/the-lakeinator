'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOG_MESSAGES = [
  "INITIALIZING_NEURAL_MAPPER...",
  "BYPASSING_REST_PROXY...",
  "HARVESTING_CERT_TRANSPARENCY_LOGS...",
  "CORRELATING_IP_NODE_METADATA...",
  "DECRYPTING_PACKET_HEADER_SIGNATURES...",
  "ESTABLISHING_ENCRYPTED_TUNNEL...",
  "QUERYING_SHODAN_COGNITIVE_ENGINE...",
  "FETCHING_DARKNET_JSON_PAYLOADS...",
  "MAPPING_ENTITY_RELATIONSHIPS...",
  "UPDATING_INTEL_INDEX_V4.2...",
];

export default function TerminalStream() {
  const [logs, setLogs] = useState<string[]>(["SYSTEM_READY"]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/90 border border-green-900/50 p-3 font-mono text-[9px] z-50 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="flex justify-between items-center mb-2 border-b border-green-900/30 pb-1">
        <span className="text-green-800 font-bold uppercase tracking-widest">Live_Intel_Stream</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-900" />
        </div>
      </div>
      <div className="space-y-1 overflow-hidden h-24 flex flex-col justify-end">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={log + i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-600/80 leading-tight"
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

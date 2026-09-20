import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Activity } from 'lucide-react';

export default function ClaimHighlighter({ claims = [], selectedClaimId, onSelectClaim }) {
  if (!claims || claims.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
        No claims extracted yet. Run verification on an LLM response.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        Extracted Medical Claims & BioBERT Entity Inspector
      </h3>
      <div className="space-y-3">
        {claims.map((c, index) => {
          const isSelected = selectedClaimId === c.claim_id;
          const isRefuted = c.verdict === 'REFUTES';
          const isSupported = c.verdict === 'SUPPORTS';

          let statusBg = isRefuted
            ? 'bg-rose-950/40 border-rose-500/40 hover:border-rose-400'
            : isSupported
            ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
            : 'bg-amber-950/40 border-amber-500/40 hover:border-amber-400';

          let statusBadge = isRefuted ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-3.5 h-3.5" /> Hallucinated / Refuted
            </span>
          ) : isSupported ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Claim
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <HelpCircle className="w-3.5 h-3.5" /> Unverified / Caution
            </span>
          );

          return (
            <div
              key={c.claim_id || index}
              onClick={() => onSelectClaim && onSelectClaim(c)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${statusBg} ${
                isSelected ? 'ring-2 ring-cyan-400 shadow-lg' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-mono text-slate-400">Claim #{index + 1}</span>
                {statusBadge}
              </div>

              <p className="text-sm text-slate-100 font-medium leading-relaxed mb-3">
                "{c.claim_text}"
              </p>

              {/* BioBERT Medical Entities */}
              {c.entities && c.entities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 mr-1 self-center font-mono">Entities:</span>
                  {c.entities.map((ent, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-cyan-500/30 font-mono"
                    >
                      {ent.text} <span className="opacity-60 text-[9px] font-sans">[{ent.label}]</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

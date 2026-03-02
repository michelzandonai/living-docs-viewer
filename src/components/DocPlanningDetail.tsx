import {
  CircleDashed,
  Circle,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ListChecks,
} from 'lucide-react';
import type { DocPlanningFields } from '@/lib/types';

const STATUS_CONFIG = {
  p: { icon: CircleDashed, color: 'text-zinc-400', label: 'Pendente' },
  a: { icon: Circle, color: 'text-cyan-500', label: 'Ativo' },
  d: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Concluido' },
} as const;

// --- PlanningOverview ---

export function PlanningOverview({ planning }: { planning: DocPlanningFields }) {
  const items = Array.isArray(planning.items) ? planning.items : [];
  const doneCount = items.filter((i) => i.s === 'd').length;
  const total = items.length;

  return (
    <div className="space-y-4">
      {/* Goal */}
      <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
        <p className="text-sm font-medium text-cyan-800 dark:text-cyan-200">{planning.goal}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <ListChecks className="h-4 w-4" />
        <span>
          {doneCount}/{total} concluidos
        </span>
        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: total > 0 ? `${(doneCount / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const cfg = STATUS_CONFIG[item.s] ?? STATUS_CONFIG.p;
          const Icon = cfg.icon;
          return (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
              <div>
                <span
                  className={
                    item.s === 'd'
                      ? 'line-through text-zinc-400 dark:text-zinc-500'
                      : 'text-zinc-800 dark:text-zinc-100'
                  }
                >
                  {item.t}
                </span>
                {item.d && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.d}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// --- PlanningRisks ---

export function PlanningRisks({ risks }: { risks?: DocPlanningFields['risks'] }) {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        Riscos e Mitigacoes
      </h3>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm dark:shadow-none">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left px-4 py-2.5 font-semibold text-zinc-600 dark:text-zinc-300">
                Risco
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-zinc-600 dark:text-zinc-300">
                Mitigacao
              </th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk, i) => (
              <tr
                key={i}
                className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
              >
                <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-200">{risk.r}</td>
                <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-300">{risk.m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- PlanningTechnical ---

export function PlanningTechnical({ planning }: { planning: DocPlanningFields }) {
  const files = Array.isArray(planning.files) ? planning.files : [];
  const verify = Array.isArray(planning.verify) ? planning.verify : [];
  const hasFiles = files.length > 0;
  const hasVerify = verify.length > 0;

  if (!hasFiles && !hasVerify) return null;

  return (
    <div className="space-y-4">
      {hasFiles && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-zinc-500" />
            Arquivos Impactados
          </h3>
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={i} className="text-sm font-mono text-zinc-600 dark:text-zinc-300 pl-6">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasVerify && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-emerald-500" />
            Verificacao
          </h3>
          <ul className="space-y-1">
            {verify.map((v, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200 pl-6"
              >
                <span className="text-zinc-400 shrink-0">&#8226;</span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Wrapper: backward compatible ---

interface DocPlanningDetailProps {
  planning: DocPlanningFields;
}

export function DocPlanningDetail({ planning }: DocPlanningDetailProps) {
  return (
    <div className="space-y-6">
      <PlanningOverview planning={planning} />
      <PlanningRisks risks={planning.risks} />
      <PlanningTechnical planning={planning} />
    </div>
  );
}

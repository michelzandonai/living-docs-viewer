import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  CircleDashed,
  Circle,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ListChecks,
} from 'lucide-react';
import type { DocPlanningFields, PlanningItem, PlanningPhase } from '@/lib/types';

const STATUS_CONFIG = {
  p: { icon: CircleDashed, color: 'text-zinc-400', label: 'Pendente' },
  a: { icon: Circle, color: 'text-cyan-500', label: 'Ativo' },
  d: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Concluido' },
} as const;

function getAllItems(planning: DocPlanningFields): PlanningItem[] {
  if (planning.phases?.length) {
    return planning.phases.flatMap((p) => p.items);
  }
  return Array.isArray(planning.items) ? planning.items : [];
}

// --- Item renderer (reused in both flat and phase modes) ---

function PlanningItemRow({ item }: { item: PlanningItem }) {
  const cfg = STATUS_CONFIG[item.s] ?? STATUS_CONFIG.p;
  const Icon = cfg.icon;

  return (
    <li className="flex items-start gap-2 text-sm">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="min-w-0">
        <span
          className={
            item.s === 'd'
              ? 'line-through text-zinc-400 dark:text-zinc-500'
              : 'text-zinc-800 dark:text-zinc-100'
          }
        >
          {item.t}
        </span>
        {item.why && (
          <p className="text-xs italic text-zinc-400 dark:text-zinc-500 mt-0.5">
            ↳ Porque: {item.why}
          </p>
        )}
        {item.d && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 prose prose-xs dark:prose-invert max-w-none prose-p:my-0.5 prose-ul:my-0.5 prose-li:my-0 prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.d}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </li>
  );
}

// --- Progress bar component ---

function ProgressBar({
  done,
  total,
  showLabel,
}: {
  done: number;
  total: number;
  showLabel?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
      {showLabel && <ListChecks className="h-4 w-4" />}
      <span>
        {done}/{total} concluidos
      </span>
      <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
        />
      </div>
    </div>
  );
}

// --- Phase group renderer ---

function PhaseGroup({ phase }: { phase: PlanningPhase }) {
  const doneCount = phase.items.filter((i) => i.s === 'd').length;
  const total = phase.items.length;

  return (
    <div className="border-l-2 border-cyan-400 dark:border-cyan-600 pl-4 space-y-2">
      <div>
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {phase.title}
        </h4>
        {phase.rationale && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {phase.rationale}
          </p>
        )}
      </div>
      <ProgressBar done={doneCount} total={total} />
      <ul className="space-y-1.5">
        {phase.items.map((item, i) => (
          <PlanningItemRow key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}

// --- PlanningOverview ---

export function PlanningOverview({ planning }: { planning: DocPlanningFields }) {
  const allItems = getAllItems(planning);
  const doneCount = allItems.filter((i) => i.s === 'd').length;
  const total = allItems.length;
  const hasPhases = (planning.phases?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      {/* Goal */}
      <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
        <p className="text-sm font-medium text-cyan-800 dark:text-cyan-200">{planning.goal}</p>
      </div>

      {/* Global progress */}
      <ProgressBar done={doneCount} total={total} showLabel />

      {/* Phases or flat items */}
      {hasPhases ? (
        <div className="space-y-5">
          {planning.phases!.map((phase, i) => (
            <PhaseGroup key={i} phase={phase} />
          ))}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {allItems.map((item, i) => (
            <PlanningItemRow key={i} item={item} />
          ))}
        </ul>
      )}
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

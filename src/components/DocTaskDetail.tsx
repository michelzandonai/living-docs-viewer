import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  CheckCircle2,
  Circle,
  CircleDot,
  ChevronRight,
  FileCode,
  ListChecks,
  Wrench,
  Link2,
  TestTube2,
  Tag,
} from 'lucide-react';
import type { DocTask, DocTaskFix, DocTaskRegressionTests, DocTaskLinks } from '@/lib/types';

const PROSE_CLASSES = [
  'prose prose-sm dark:prose-invert max-w-none',
  'prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700 prose-pre:shadow-sm',
  'prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
  'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
].join(' ');

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  root_cause: {
    label: 'Causa raiz',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
  defensive: {
    label: 'Defensivo',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  defense_in_depth: {
    label: 'Defesa profundidade',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  api_mapping: {
    label: 'Mapeamento API',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  ui: {
    label: 'UI',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  bug_fix: {
    label: 'Bug fix',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  },
};

// --- Fix status icon ---

function FixStatusIcon({ status }: { status?: DocTaskFix['status'] }) {
  switch (status) {
    case 'in_progress':
      return <CircleDot className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />;
    case 'pending':
    default:
      return <Circle className="h-4 w-4 mt-0.5 shrink-0 text-zinc-400" />;
  }
}

// --- Fix status badge (small, for card headers) ---

const FIX_STATUS_BADGE: Record<string, { label: string; color: string }> = {
  pending: {
    label: 'Pendente',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  in_progress: {
    label: 'Em andamento',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  completed: {
    label: 'Concluido',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
};

// --- File badge parser ---

function parseFileBadge(filePath: string): { path: string; badge?: { label: string; color: string } } {
  if (filePath.includes('(NOVO)')) {
    return {
      path: filePath.replace('(NOVO)', '').trim(),
      badge: { label: 'NEW', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    };
  }
  if (filePath.includes('(MODIFICA)') || filePath.includes('(reescrito)')) {
    return {
      path: filePath.replace('(MODIFICA)', '').replace('(reescrito)', '').trim(),
      badge: { label: 'MOD', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    };
  }
  if (filePath.includes('(NAO MUDA)')) {
    return {
      path: filePath.replace('(NAO MUDA)', '').trim(),
      badge: { label: 'REF', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
    };
  }
  return { path: filePath };
}

// --- Collapsible section ---

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors w-full text-left py-1"
      >
        <ChevronRight
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
        />
        {title}
      </button>
      {open && <div className="mt-1 pl-5">{children}</div>}
    </div>
  );
}

// --- Task status labels ---

function getTaskLabels(task: DocTask) {
  const status = task.metadata?.status;
  const isCompleted = status === 'completed';
  const total = Array.isArray(task.fixes) ? task.fixes.length : 0;

  return {
    summaryText: isCompleted
      ? `${total} ${total === 1 ? 'entrega realizada' : 'entregas realizadas'}`
      : `${total} ${total === 1 ? 'etapa planejada/em andamento' : 'etapas planejadas/em andamento'}`,
    headerLabel: isCompleted ? 'O QUE FOI FEITO' : 'O QUE SERA FEITO',
  };
}

// --- TaskOverview (Tab Resumo) ---

export function TaskOverview({ task }: { task: DocTask }) {
  const fixes = Array.isArray(task.fixes) ? task.fixes : [];
  const context = task.context;
  const total = fixes.length;
  const { summaryText, headerLabel } = getTaskLabels(task);

  return (
    <div className="space-y-4">
      {/* Context */}
      {context?.problem && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
            Problema
          </h4>
          <p className="text-sm text-red-800 dark:text-red-200">{context.problem}</p>
        </div>
      )}

      {context?.rootCause && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Causa raiz
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200">{context.rootCause}</p>
        </div>
      )}

      {/* Progress */}
      {total > 0 && (
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Wrench className="h-4 w-4" />
          <span>{summaryText}</span>
        </div>
      )}

      {/* Fixes summary list */}
      {fixes.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {headerLabel}
          </h4>
          <ul className="space-y-1.5">
            {fixes.map((fix) => {
              const cat = fix.category ? CATEGORY_CONFIG[fix.category] : undefined;
              return (
                <li key={fix.id} className="flex items-start gap-2 text-sm">
                  <FixStatusIcon status={fix.status} />
                  <div className="flex-1 min-w-0">
                    <span className="text-zinc-800 dark:text-zinc-100">
                      <span className="text-zinc-400 mr-1">#{fix.id}</span>
                      {fix.title}
                    </span>
                    {cat && (
                      <span
                        className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                    )}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {fix.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Impacted steps */}
      {context?.impactedSteps && context.impactedSteps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Steps impactados
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {context.impactedSteps.map((step) => (
              <span
                key={step.order}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="text-zinc-400">#{step.order}</span>
                {step.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {task.links && <TaskLinksSection links={task.links} />}
    </div>
  );
}

// --- TaskFixes (Tab Fixes) ---

export function TaskFixes({ fixes }: { fixes: DocTaskFix[] }) {
  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="space-y-4">
      {fixes.map((fix) => (
        <FixCard key={fix.id} fix={fix} />
      ))}
    </div>
  );
}

// --- FixCard (collapsible card per fix) ---

function FixCard({ fix }: { fix: DocTaskFix }) {
  const cat = fix.category ? CATEGORY_CONFIG[fix.category] : undefined;
  const statusBadge = fix.status ? FIX_STATUS_BADGE[fix.status] : undefined;
  const hasLogic = !!fix.logic;
  const hasFiles = fix.files.length > 0;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
        <FixStatusIcon status={fix.status} />
        <span className="text-xs font-mono text-zinc-400">#{fix.id}</span>
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          {fix.title}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {statusBadge && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusBadge.color}`}
            >
              {statusBadge.label}
            </span>
          )}
          {cat && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${cat.color}`}
            >
              <Tag className="h-2.5 w-2.5 mr-0.5" />
              {cat.label}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 bg-white dark:bg-zinc-900">
        {/* Description - open by default */}
        <CollapsibleSection title="Descricao" defaultOpen={true}>
          <div className={PROSE_CLASSES}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {fix.description}
            </ReactMarkdown>
          </div>
        </CollapsibleSection>

        {/* Logic - closed by default */}
        {hasLogic && (
          <CollapsibleSection title="Como funciona" defaultOpen={false}>
            <div className={PROSE_CLASSES}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {fix.logic!}
              </ReactMarkdown>
            </div>
          </CollapsibleSection>
        )}

        {/* Files - closed by default */}
        {hasFiles && (
          <CollapsibleSection title="Arquivos" defaultOpen={false}>
            <ul className="space-y-1">
              {fix.files.map((f, i) => {
                const { path, badge } = parseFileBadge(f);
                return (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-zinc-500 dark:text-zinc-400">{path}</span>
                    {badge && (
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </CollapsibleSection>
        )}

        {/* Test file */}
        {fix.testFile && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <TestTube2 className="h-3 w-3" />
            <span className="font-mono">{fix.testFile}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TaskTechnical (Tab Tecnico) ---

export function TaskTechnical({ task }: { task: DocTask }) {
  const files = Array.isArray(task.allFilesModified) ? task.allFilesModified : [];
  const verify = Array.isArray(task.verify) ? task.verify : [];
  const regression = task.regressionTests;
  const hasFiles = files.length > 0;
  const hasVerify = verify.length > 0;
  const hasRegression = !!regression;

  if (!hasFiles && !hasVerify && !hasRegression) return null;

  return (
    <div className="space-y-6">
      {/* Regression tests */}
      {hasRegression && <TaskRegressionSection regression={regression!} />}

      {/* All files modified */}
      {hasFiles && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-zinc-500" />
            Arquivos Modificados ({files.length})
          </h3>
          <ul className="space-y-0.5">
            {files.map((f, i) => {
              const { path, badge } = parseFileBadge(f);
              return (
                <li key={i} className="flex items-center gap-2 text-sm pl-6">
                  <span className="font-mono text-zinc-600 dark:text-zinc-300">{path}</span>
                  {badge && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Verify */}
      {hasVerify && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-emerald-500" />
            Verificacao ({verify.length})
          </h3>
          <ul className="space-y-1">
            {verify.map((v, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200 pl-6"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Internal: Regression section ---

function TaskRegressionSection({ regression }: { regression: DocTaskRegressionTests }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
        <TestTube2 className="h-4 w-4 text-cyan-500" />
        Testes de Regressao
      </h3>

      {regression.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-300 pl-6">{regression.description}</p>
      )}

      {/* TDD 3-step cycle */}
      {regression.cycle && (
        <div className="ml-6 space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Ciclo TDD (3 etapas)
          </h4>
          <div className="space-y-1">
            <div className="flex items-start gap-2 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">{regression.cycle.step1}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">{regression.cycle.step2}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">{regression.cycle.step3}</span>
            </div>
          </div>
        </div>
      )}

      {/* Suite result */}
      {regression.suiteResult && (
        <div className="ml-6 flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            {regression.suiteResult}
          </span>
        </div>
      )}

      {/* Test files */}
      {regression.files && regression.files.length > 0 && (
        <div className="ml-6 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Arquivos de teste
          </h4>
          <ul className="space-y-0.5">
            {regression.files.map((f, i) => (
              <li key={i} className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exported functions */}
      {regression.exportedFunctions && regression.exportedFunctions.length > 0 && (
        <div className="ml-6 flex flex-wrap gap-1.5">
          {regression.exportedFunctions.map((fn, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
            >
              {fn}()
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Backward-compatible wrapper ---

interface DocTaskDetailProps {
  doc: DocTask;
}

export function DocTaskDetail({ doc }: DocTaskDetailProps) {
  return (
    <div className="space-y-6">
      <TaskOverview task={doc} />
      {doc.fixes && doc.fixes.length > 0 && <TaskFixes fixes={doc.fixes} />}
      <TaskTechnical task={doc} />
    </div>
  );
}

// --- Internal: Links section ---

function TaskLinksSection({ links }: { links: DocTaskLinks }) {
  const entries: { label: string; value: string }[] = [];
  if (links.plan) entries.push({ label: 'Planejamento', value: links.plan });
  if (links.successor) entries.push({ label: 'Continuidade', value: links.successor });
  if (links.adrs) links.adrs.forEach((a) => entries.push({ label: 'ADR', value: a }));
  if (links.relatedFiles) {
    Object.entries(links.relatedFiles).forEach(([key, path]) => {
      entries.push({ label: key.toUpperCase(), value: path });
    });
  }

  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Link2 className="h-3.5 w-3.5" />
        Vinculos
      </h4>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            <span className="text-zinc-400">{entry.label}:</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">{entry.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Shield,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  X,
  FileText,
  Scale,
  Target,
} from 'lucide-react';
import type { DocAdrFields } from '@/lib/types';

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div
      className={[
        'prose prose-sm dark:prose-invert max-w-none',
        'prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700',
        'prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
        'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
      ].join(' ')}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

// --- Sub-component: Context + Decision ---

interface ContextDecisionProps {
  adr?: DocAdrFields;
}

export function AdrContextDecision({ adr }: ContextDecisionProps) {
  if (!adr) return null;

  return (
    <div className="space-y-6">
      {adr.context && (
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <FileText className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Contexto
          </h3>
          <MarkdownBlock content={adr.context} />
        </div>
      )}

      {adr.decision && (
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Scale className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Decisao
          </h3>
          <MarkdownBlock content={adr.decision} />
        </div>
      )}

      {adr.decisions && adr.decisions.length > 0 && (
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Scale className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Decisoes
          </h3>
          <ul className="space-y-2">
            {adr.decisions.map((d) => (
              <li key={d.id} className="text-sm">
                <MarkdownBlock content={d.text} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: Analysis (consequences, alternatives, principles, invariants) ---

interface AnalysisProps {
  adr?: DocAdrFields;
}

export function AdrAnalysis({ adr }: AnalysisProps) {
  if (!adr) return null;

  const hasContent =
    adr.consequences ||
    (adr.principles && adr.principles.length > 0) ||
    (adr.invariants && adr.invariants.length > 0) ||
    (adr.alternatives && adr.alternatives.length > 0);

  if (!hasContent) return null;

  return (
    <div className="space-y-6">
      {adr.consequences && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Consequencias
          </h3>

          <div className="grid gap-3">
            {adr.consequences.positive && adr.consequences.positive.length > 0 && (
              <div className="border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-r-lg">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 mb-2">
                  Positivas
                </span>
                <ul className="space-y-1.5">
                  {adr.consequences.positive.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adr.consequences.negative && adr.consequences.negative.length > 0 && (
              <div className="border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 p-4 rounded-r-lg">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 mb-2">
                  Negativas
                </span>
                <ul className="space-y-1.5">
                  {adr.consequences.negative.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300"
                    >
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adr.consequences.mitigations && adr.consequences.mitigations.length > 0 && (
              <div className="border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-r-lg">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 mb-2">
                  Mitigacoes
                </span>
                <ul className="space-y-1.5">
                  {adr.consequences.mitigations.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
                    >
                      <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {adr.principles && adr.principles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            Principios
          </h3>
          <div className="grid gap-2">
            {adr.principles.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none transition-colors hover:border-blue-200 dark:hover:border-blue-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {adr.invariants && adr.invariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Invariantes
          </h3>
          <div className="rounded-xl border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-5 space-y-2.5">
            {adr.invariants.map((inv, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                <span className="text-sm font-medium text-red-800 dark:text-red-300">{inv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {adr.alternatives && adr.alternatives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-500 dark:text-zinc-400">
            Alternativas Rejeitadas
          </h3>
          <ul className="space-y-2">
            {adr.alternatives.map((alt, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400"
              >
                <X className="h-4 w-4 mt-0.5 shrink-0 text-red-400 dark:text-red-500" />
                <span>
                  {typeof alt === 'string' ? (
                    alt
                  ) : (
                    <>
                      <strong>{alt.name}</strong> — {alt.reason}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- Sub-component: Implementation (phases, success criteria, agent rules) ---

interface ImplementationProps {
  adr?: DocAdrFields;
}

export function AdrImplementation({ adr }: ImplementationProps) {
  if (!adr) return null;

  const hasContent =
    (adr.phases && adr.phases.length > 0) ||
    (adr.successCriteria && adr.successCriteria.length > 0) ||
    (adr.agentRules && adr.agentRules.length > 0);

  if (!hasContent) return null;

  return (
    <div className="space-y-6">
      {adr.phases && adr.phases.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Fases
          </h3>
          <div className="space-y-3">
            {adr.phases.map((phase) => (
              <div
                key={phase.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2"
              >
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {phase.title}
                </h4>
                {phase.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{phase.description}</p>
                )}
                {phase.items && (
                  <ul className="list-disc pl-5 space-y-0.5">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {adr.successCriteria && adr.successCriteria.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Target className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Criterios de Sucesso
          </h3>
          <ul className="space-y-1.5">
            {adr.successCriteria.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {adr.agentRules && adr.agentRules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Agent Rules
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2">
            {adr.agentRules.map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <Shield className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Wrapper: backward compatible ---

interface DocAdrDetailProps {
  adr: DocAdrFields;
}

export function DocAdrDetail({ adr }: DocAdrDetailProps) {
  return (
    <div className="space-y-6">
      <AdrContextDecision adr={adr} />
      <AdrAnalysis adr={adr} />
      <AdrImplementation adr={adr} />
    </div>
  );
}

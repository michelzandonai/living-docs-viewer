import { CheckCircle2, XCircle, AlertTriangle, BookOpen } from 'lucide-react';
import type { DocGuidelineFields } from '@/lib/types';

// --- GuidelineOverview: applies to badges + last revision ---

interface OverviewProps {
  guideline?: DocGuidelineFields;
}

export function GuidelineOverview({ guideline }: OverviewProps) {
  if (!guideline) return null;

  return (
    <div className="space-y-4">
      {guideline.appliesTo && guideline.appliesTo.length > 0 && (
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <BookOpen className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Aplica-se a
          </h3>
          <div className="flex flex-wrap gap-2">
            {guideline.appliesTo.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      {guideline.lastRevision && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Ultima revisao: {guideline.lastRevision}
        </p>
      )}
    </div>
  );
}

// --- GuidelineRules: rules with description, whenApplies, riskOfIgnoring, example ---

interface RulesProps {
  rules?: DocGuidelineFields['rules'];
}

export function GuidelineRules({ rules }: RulesProps) {
  if (!rules || rules.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Regras</h3>
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2"
          >
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {rule.description}
            </p>
            {rule.whenApplies && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold">Quando aplicar:</span> {rule.whenApplies}
              </p>
            )}
            {rule.riskOfIgnoring && (
              <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{rule.riskOfIgnoring}</span>
              </div>
            )}
            {rule.example && (
              <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 overflow-x-auto text-zinc-700 dark:text-zinc-300">
                {rule.example}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- GuidelineChecklist: checkmark items ---

interface ChecklistProps {
  checklist?: string[];
}

export function GuidelineChecklist({ checklist }: ChecklistProps) {
  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Checklist
      </h3>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2">
        {checklist.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- GuidelineAntiPatterns: red alert box with X icons ---

interface AntiPatternsProps {
  antiPatterns?: string[];
}

export function GuidelineAntiPatterns({ antiPatterns }: AntiPatternsProps) {
  if (!antiPatterns || antiPatterns.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Anti-Patterns
      </h3>
      <div className="rounded-xl border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-5 space-y-2.5">
        {antiPatterns.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
            <span className="text-sm font-medium text-red-800 dark:text-red-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Wrapper: backward compatible ---

interface DocGuidelineDetailProps {
  guideline: DocGuidelineFields;
}

export function DocGuidelineDetail({ guideline }: DocGuidelineDetailProps) {
  return (
    <div className="space-y-6">
      <GuidelineOverview guideline={guideline} />
      <GuidelineRules rules={guideline.rules} />
      <GuidelineChecklist checklist={guideline.checklist} />
      <GuidelineAntiPatterns antiPatterns={guideline.antiPatterns} />
    </div>
  );
}

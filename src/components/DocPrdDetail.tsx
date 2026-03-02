import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Users,
  Target,
  FileCode2,
  Lock,
  Gauge,
  ArrowRightLeft,
  FolderTree,
  Database,
} from 'lucide-react';
import type { DocPrdFields } from '@/lib/types';

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

// --- PrdOverview: personas + scope ---

interface OverviewProps {
  prd?: DocPrdFields;
}

export function PrdOverview({ prd }: OverviewProps) {
  if (!prd) return null;

  const hasPersonas = prd.personas && prd.personas.length > 0;
  const hasScope =
    prd.scope &&
    ((prd.scope.included?.length ?? 0) > 0 || (prd.scope.excluded?.length ?? 0) > 0);

  if (!hasPersonas && !hasScope) return null;

  return (
    <div className="space-y-6">
      {hasPersonas && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Personas
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {prd.personas!.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-1.5"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasScope && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Target className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Escopo
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-1/2">
                    Incluido
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-1/2">
                    Excluido
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.max(
                    prd.scope!.included?.length ?? 0,
                    prd.scope!.excluded?.length ?? 0,
                  ),
                }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                      {prd.scope!.included?.[i] ?? ''}
                    </td>
                    <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                      {prd.scope!.excluded?.[i] ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PrdRequirements: FR + NFR + business rules + use cases ---

interface RequirementsProps {
  prd?: DocPrdFields;
}

export function PrdRequirements({ prd }: RequirementsProps) {
  if (!prd) return null;

  const hasFR = prd.functionalRequirements && prd.functionalRequirements.length > 0;
  const hasNFR = prd.nonFunctionalRequirements && prd.nonFunctionalRequirements.length > 0;
  const hasBR = prd.businessRules && prd.businessRules.length > 0;
  const hasUC = prd.useCases && prd.useCases.length > 0;

  if (!hasFR && !hasNFR && !hasBR && !hasUC) return null;

  return (
    <div className="space-y-8">
      {hasFR && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Requisitos Funcionais
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-20">
                    ID
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Descricao
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-48">
                    Endpoint
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.functionalRequirements!.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                      {req.description}
                      {req.validations && req.validations.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {req.validations.map((v, i) => (
                            <li
                              key={i}
                              className="text-xs text-zinc-500 dark:text-zinc-400"
                            >
                              - {v}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {req.endpoint ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasNFR && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Requisitos Nao-Funcionais
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-20">
                    ID
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Descricao
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.nonFunctionalRequirements!.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                      {req.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasBR && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Regras de Negocio
          </h3>
          <div className="space-y-3">
            {prd.businessRules!.map((rule) => (
              <div
                key={rule.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    {rule.id}
                  </span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {rule.description}
                  </span>
                </div>
                {rule.pseudocode && (
                  <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 overflow-x-auto text-zinc-700 dark:text-zinc-300">
                    {rule.pseudocode}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasUC && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <ArrowRightLeft className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Casos de Uso
          </h3>
          <div className="space-y-3">
            {prd.useCases!.map((uc) => (
              <div
                key={uc.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600">
                    {uc.id}
                  </span>
                  {uc.description && (
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {uc.description}
                    </span>
                  )}
                </div>
                {(uc.given || uc.when || uc.then) && (
                  <div className="text-xs space-y-1 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3">
                    {uc.given && (
                      <p>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Given
                        </span>{' '}
                        {uc.given}
                      </p>
                    )}
                    {uc.when && (
                      <p>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          When
                        </span>{' '}
                        {uc.when}
                      </p>
                    )}
                    {uc.then && (
                      <p>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          Then
                        </span>{' '}
                        {uc.then}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- PrdTechnical: API spec + data model + involved files + permissions ---

interface TechnicalProps {
  prd?: DocPrdFields;
}

function methodColor(method: string): string {
  const m = method.toUpperCase();
  if (m === 'GET')
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (m === 'POST') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  if (m === 'PUT' || m === 'PATCH')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  if (m === 'DELETE') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
}

export function PrdTechnical({ prd }: TechnicalProps) {
  if (!prd) return null;

  const hasApi = prd.apiSpecification && prd.apiSpecification.length > 0;
  const hasDataModel = !!prd.dataModel;
  const hasFiles = prd.involvedFiles && prd.involvedFiles.length > 0;
  const hasPermissions = prd.permissions && prd.permissions.length > 0;

  if (!hasApi && !hasDataModel && !hasFiles && !hasPermissions) return null;

  // Group files by layer
  const filesByLayer: Record<string, typeof prd.involvedFiles> = {};
  if (hasFiles) {
    for (const f of prd.involvedFiles!) {
      const layer = f.layer ?? 'other';
      if (!filesByLayer[layer]) filesByLayer[layer] = [];
      filesByLayer[layer]!.push(f);
    }
  }

  return (
    <div className="space-y-8">
      {hasApi && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <FileCode2 className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            API Specification
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300 w-24">
                    Metodo
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Path
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Descricao
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.apiSpecification!.map((api, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${methodColor(api.method)}`}
                      >
                        {api.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {api.path}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                      {api.summary ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasDataModel && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Database className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Modelo de Dados
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm dark:shadow-none">
            <MarkdownBlock content={prd.dataModel!} />
          </div>
        </div>
      )}

      {hasFiles && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <FolderTree className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Arquivos Envolvidos
          </h3>
          <div className="space-y-3">
            {Object.entries(filesByLayer).map(([layer, files]) => (
              <div
                key={layer}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none space-y-2"
              >
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600">
                  {layer}
                </span>
                <ul className="space-y-1">
                  {files!.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <code className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        {f.path}
                      </code>
                      {f.action && (
                        <span className="text-zinc-500 dark:text-zinc-400">({f.action})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasPermissions && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Lock className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            Permissoes
          </h3>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Acao
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                    Roles
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.permissions!.map((perm, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300 font-medium">
                      {perm.action}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {perm.roles.map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PrdMetrics ---

interface MetricsProps {
  prd?: DocPrdFields;
}

export function PrdMetrics({ prd }: MetricsProps) {
  if (!prd?.metrics || prd.metrics.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        <Gauge className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        Metricas
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prd.metrics.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {m.name}
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {m.target}
              {m.unit && (
                <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                  {m.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Wrapper: backward compatible ---

interface DocPrdDetailProps {
  prd: DocPrdFields;
}

export function DocPrdDetail({ prd }: DocPrdDetailProps) {
  return (
    <div className="space-y-6">
      <PrdOverview prd={prd} />
      <PrdRequirements prd={prd} />
      <PrdTechnical prd={prd} />
      <PrdMetrics prd={prd} />
    </div>
  );
}

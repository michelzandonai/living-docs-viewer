import http from 'http'
import fs from 'fs'
import path from 'path'

const docsPath = path.resolve(process.cwd(), '..', 'ajuri-api', 'docs')

const server = http.createServer((req, res) => {
  if (!req.url.startsWith('/docs')) { res.writeHead(404); res.end(); return }
  const filePath = path.join(docsPath, req.url.replace('/docs', ''))
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  fs.createReadStream(filePath).pipe(res)
})

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (r) => {
      let data = ''
      r.on('data', c => data += c)
      r.on('end', () => {
        try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

async function runTests() {
  let passed = 0
  let failed = 0

  function assert(condition, msg) {
    if (condition) { passed++; console.log(`  PASS: ${msg}`) }
    else { failed++; console.error(`  FAIL: ${msg}`) }
  }

  console.log('\n=== Living Docs Viewer — Integration Tests ===\n')

  // Test 1: Index loading
  console.log('1. Index Loading')
  const index = await fetchJSON('http://localhost:3334/docs/docs-index.json')
  assert(index.$docSchema === 'energimap-doc/v1', 'Index has correct schema')
  assert(index.stats.total === 166, `Total docs: ${index.stats.total}`)
  assert(index.stats.byType.adr === 3, 'ADR count: 3')
  assert(index.stats.byType.guideline === 4, 'Guideline count: 4')
  assert(index.stats.byType.prd === 4, 'PRD count: 4')
  assert(index.stats.byType.task === 155, `Task count: ${index.stats.byType.task}`)

  // Test 2: Catalogs
  console.log('\n2. Catalogs')
  const authors = await fetchJSON('http://localhost:3334/docs/_catalogs/authors.json')
  assert(authors.michel?.name === 'Michel Zandonai', 'Author michel exists')
  const tags = await fetchJSON('http://localhost:3334/docs/_catalogs/tags.json')
  assert(tags['clean-architecture']?.label === 'Clean Architecture', 'Tag clean-architecture exists')
  const glossary = await fetchJSON('http://localhost:3334/docs/_catalogs/glossary.json')
  assert(glossary.OS?.definition?.includes('Ordem de Servico'), 'Glossary OS exists')

  // Test 3: Load one of each type
  console.log('\n3. Document Types')

  const adr = await fetchJSON('http://localhost:3334/docs/adr/ADR-001-stored-procedure-migration.json')
  assert(adr.type === 'adr', 'ADR type correct')
  assert(adr.adr?.context, 'ADR has context')
  assert(adr.adr?.decision, 'ADR has decision')
  assert(adr.sections?.length > 0, `ADR has ${adr.sections.length} sections`)
  assert(adr.sections.every(s => s.id), 'ADR all sections have id')

  const prd = await fetchJSON('http://localhost:3334/docs/prd/PRD-001-conclude-new-connection.json')
  assert(prd.type === 'prd', 'PRD type correct')
  assert(prd.prd?.functionalRequirements?.length > 0, `PRD has ${prd.prd?.functionalRequirements?.length} requirements`)
  assert(prd.sections?.length > 0, `PRD has ${prd.sections.length} sections`)

  const guideline = await fetchJSON('http://localhost:3334/docs/guidelines/GUIDELINE-001-usecase-implementation.json')
  assert(guideline.type === 'guideline', 'Guideline type correct')
  assert(guideline.guideline?.rules?.length > 0, `Guideline has ${guideline.guideline?.rules?.length} rules`)
  assert(guideline.guideline?.checklist?.length > 0, `Guideline has ${guideline.guideline?.checklist?.length} checklist items`)

  const task = await fetchJSON('http://localhost:3334/docs/tasks/TASK-001-adicionar-materiais-os.json')
  assert(task.type === 'task', 'Task type correct')
  assert(task.metadata?.title, 'Task has title')
  assert(task.changelog?.length > 0, 'Task has changelog')

  // Test 4: Verify schema compliance
  console.log('\n4. Schema Compliance (random sample)')
  const sampleDocs = index.documents.filter((_, i) => i % 20 === 0)
  for (const entry of sampleDocs) {
    const doc = await fetchJSON(`http://localhost:3334/docs/${entry.path}`)
    assert(doc.$docSchema === 'energimap-doc/v1', `${entry.id} has $docSchema`)
    assert(doc.id === entry.id, `${entry.id} ID matches index`)
    assert(doc.type === entry.type, `${entry.id} type matches index`)
    assert(doc.metadata?.title, `${entry.id} has title`)
    assert(doc.sections?.length > 0, `${entry.id} has sections`)
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  return failed === 0
}

server.listen(3334, async () => {
  try {
    const success = await runTests()
    server.close()
    process.exit(success ? 0 : 1)
  } catch (e) {
    console.error('Test error:', e)
    server.close()
    process.exit(1)
  }
})

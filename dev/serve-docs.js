import express from 'express'
import { resolve } from 'path'

const app = express()
const docsPath = resolve(process.cwd(), '..', 'ajuri-api', 'docs')

app.use('/docs', express.static(docsPath))

app.listen(3334, () => {
  console.log(`Docs server running at http://localhost:3334/docs`)
  console.log(`Serving from: ${docsPath}`)
})

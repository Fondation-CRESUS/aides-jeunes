import express from "express"
import { createServer as createViteServer } from "vite"
import configure from "./configure"
import mock from "../mock"

const port = process.env.PORT || 8080

async function createServer() {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
    configFile: `${__dirname}/../vite.config.ts`,
  })
  if (process.env.NODE_ENV === "front-only") {
    mock(app)
  } else {
    configure(app)
  }
  app.use(vite.middlewares)
  app.listen(port, () => {
    console.log(
      `Aides Jeunes server listening on port ${port}, in ${app.get("env")}`
    )
  })
}

createServer()
/* eslint-disable no-console */

import express, { ErrorRequestHandler, Application } from "express"
import path from "path"
import configure from "./configure"

const app: Application = express()

const port = process.env.PORT || 8080

process.env.MES_AIDES_ROOT_URL =
  process.env.MES_AIDES_ROOT_URL || `http://localhost:${port}`

configure(app)

app.use(express.static(path.join(__dirname, "../../dist")))
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
})
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)
  res.status(parseInt(err.code) || 500).send(err)
  next()
}
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(
    `Aides Jeunes server listening on port ${port}, in ${app.get(
      "env"
    )} mode, expecting to be deployed on ${process.env.MES_AIDES_ROOT_URL}`
  )
})

export default app
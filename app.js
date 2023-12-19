require('dotenv').config()
require('express-async-errors')

const path = require('path')
//security package
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
// const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()

//Connect DB
const connectDB = require('./src/db/connect')

const authenticateUser = require('./src/middleware/authentication')

//router
const authRouter = require('./src/routes/auth')
const jobRouter = require('./src/routes/jobs')

// error handler
const notFoundMiddleware = require('./src/middleware/not-found')
const errorHandlerMiddleware = require('./src/middleware/error-handler')

app.set('trust proxy', 1)
// app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use(express.static(path.resolve(__dirname, './front-end/build')))
app.use(express.json())
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())

// app.get('/', (req, res) => {
//   res.send('<h1>Jobs API</h1>')
// })

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './front-end/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()

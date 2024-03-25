import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import { openAPIRouter } from './api-docs/openAPIRouter'
import errorHandler from './middleware/errorHandler'
import routers from './api/routes'

const app = express()
const port = process.env.PORT || 3333

app.use(cors());
app.use(express.json())

app.use('/api', routers);

app.use(openAPIRouter);

app.use(errorHandler());

app.listen(port, () => {
  console.log(`Server running in port: ${port}`)
})

export { app }
import { Request, Response } from 'express'

import { UserService } from '../services/user.service'
import { handleServiceResponse } from '../utils/httpHandlers'

export default class UserController {
  service = new UserService()

  async getAll (req: Request, res: Response): Promise<Response<unknown>> {
    const users = await this.service.getAll()
    
    return handleServiceResponse(users, res)
  }

  async create (req: Request, res: Response): Promise<Response<unknown>> {
    const { name, email, password } = req.body

    const user = await this.service.create({ name, email, password })

    return handleServiceResponse(user, res)
  }

  async delete (req: Request, res: Response): Promise<Response<unknown>> {
    const { id } = req.body

    const user = await this.service.delete(id)

    return handleServiceResponse(user, res)
  }

  async authenticate (req: Request, res: Response): Promise<Response<unknown>> {
    const { email, password } = req.body

    const user = await this.service.authenticate({ email, password })

    return handleServiceResponse(user, res)
  }
}

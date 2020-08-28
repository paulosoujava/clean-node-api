import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    console.log(req.body)

    const httpRequest: HttpRequest = { body: req.body }
    const httReponse = await controller.handle(httpRequest)
    res.status(httReponse.statusCode).json(httReponse.body)
  }
}

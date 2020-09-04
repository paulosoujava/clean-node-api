import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    console.log(req.body)

    const httpRequest: HttpRequest = { body: req.body }
    const httReponse = await controller.handle(httpRequest)
    if (httReponse.statusCode === 200) {
      res.status(httReponse.statusCode).json(httReponse.body)
    } else {
      res.status(httReponse.statusCode).json({
        error: httReponse.body.message
      })
    }
  }
}

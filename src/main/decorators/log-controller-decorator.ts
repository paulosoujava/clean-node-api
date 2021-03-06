import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-reporitory'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // podemos fazer um LOG
      await this.logErrorRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}

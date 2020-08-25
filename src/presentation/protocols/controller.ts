import { HttpResponse, HttpRequest } from './http'

export interface Controller {
  handle: (httpResponse: HttpResponse) => HttpRequest
}

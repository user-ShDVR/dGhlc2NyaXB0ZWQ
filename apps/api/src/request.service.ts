import { BadGatewayException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, retry, timeout } from 'rxjs';

export class RequestService {
  private readonly timeout: number = 6000;
  private retries: number = 5;

  public sendRequest<TInput, TResult>(
    transport: ClientProxy,
    message: string,
    data?: TInput,
  ): Observable<TResult> {
    return transport.send<TResult>(message, data ? data : {}).pipe(
      timeout(this.timeout),
      retry(this.retries),
      catchError((err) => {
        console.log(err)
        console.log(
          '\x1b[31m',
          `Ошибка при отправке запроса: ${err.message === undefined? err : err.message} по пути ${message}`,
          '\x1b[0m',
        );
        throw new BadGatewayException(err);
      }),
    );
  }
}

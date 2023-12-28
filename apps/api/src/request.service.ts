
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

export class RequestService {
  private readonly timeout: number = 6000;
  private retries: number = 5;

  public sendRequest<TInput, TResult>(
    transport: ClientProxy,
    message: string,
    data?: TInput,
  ): Promise<TResult> {
    const request = transport.send<TResult>(message, data ? data : {});

    return new Promise((resolve, reject) => {
      firstValueFrom(
        request.pipe(
          timeout(this.timeout),
          catchError((err) => {
            console.log(
              '\x1b[31m',
              `Ошибка при отправке запроса: ${err.message === undefined ? err : err.message} по пути ${message}`,
              '\x1b[0m',
            );
            reject(err);
            throw err;
          }),
        )
      ).then(resolve, reject);
    });
  }
}


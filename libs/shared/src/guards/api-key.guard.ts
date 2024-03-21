import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  // [ShDVR]: #TODO / Затычка до появления админ панели (ОБЯЗАТЕЛЬНО ПЕРЕДЕЛАТЬ)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && apiKey === '123412-testkey-dasdas12312412353498648') {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}

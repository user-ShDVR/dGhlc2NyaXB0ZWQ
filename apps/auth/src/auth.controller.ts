import {
  Controller,
  UseGuards,
  Inject,
  ConflictException,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';

import { SharedService } from '@app/shared';

import { AuthService } from './auth.service';
import { NewUserDTO } from './dtos/new-user.dto';
import { ExistingUserDTO } from './dtos/existing-user.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern('get-users')
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.getUsers();
  }

  @MessagePattern('create-user')
  async createUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string; email: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    try {
      return await this.authService.createUser(payload.product, payload.email);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new RpcException({
          statusCode: 409,
          message: 'Такой пользователь уже существует в данном продукте',
        });
      } else {
        throw error;
      }
    }
  }
}

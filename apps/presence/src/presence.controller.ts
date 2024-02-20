import { ConflictException, Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';

import { SharedService } from '@app/shared';

import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly presenceService: PresenceService,
  ) {}
  
  @MessagePattern('get-active-users')
  async getActiveUsers(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string },
  ) {
    try {
      this.sharedService.acknowledgeMessage(context);
      return await this.presenceService.getActiveUsers(payload.product);
    } catch (error) {
      return error
    }
  }

  @MessagePattern('set-active-user')
  async setActiveUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { product: string, hwid: string, key: string },
  ) {
    try {
      this.sharedService.acknowledgeMessage(context);
      return await this.presenceService.setActiveUser(payload.product, payload.hwid, payload.key);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ statusCode: 404, message: "User not found" });
      } else if (error instanceof UnauthorizedException) {
        throw new RpcException({ statusCode: 403, message: "This key is expired" });
      } else {
        throw error; 
      }
    }
  }
}

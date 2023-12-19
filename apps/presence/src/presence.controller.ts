import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
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
    @Payload() payload: { product: string, hwid: string },
  ) {
    try {
      this.sharedService.acknowledgeMessage(context);

      return await this.presenceService.setActiveUser(payload.product, payload.hwid);
    } catch (error) {
      return error
    }
  }
}

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
  ) {}

  @Get('users')
  async getUsers() {
    console.log('getUsers');
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }
  @Get('activeUsers/:cheatName')
  async getActiveUsers(@Param('cheatName') cheatName: string,) {
    console.log(cheatName);
    return this.presenceService.send(
      {
        cmd: 'get-active-users',
      },
      {
        cheatName
      },
    );
  }
  @Post('activeUser/:cheatName')
  async setActiveUsers(@Param('cheatName') cheatName: string, @Body('hwid') hwid: string,) {
    console.log(cheatName);
    console.log('setActiveUsers');
    return this.presenceService.send(
      {
        cmd: 'set-active-user',
      },
      {
        cheatName,
        hwid,
      },
    );
  }
}

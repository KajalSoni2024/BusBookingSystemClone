import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
@Injectable()
export class PusherService {
  private pusher: Pusher;
  constructor() {
    this.pusher = new Pusher({
      appId: '1866169',
      key: '5255d55b22b71ccf514f',
      secret: '452535a6ea8af74a0d0c',
      cluster: 'ap2',
    });
  }

  triggerChannel(channel: string, event: string, payload) {
    this.pusher.trigger(channel, event, payload);
  }
}

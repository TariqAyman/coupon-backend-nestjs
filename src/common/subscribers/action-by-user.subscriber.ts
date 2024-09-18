import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { CURRENT_USER } from '../providers/current-user.provider';

@Injectable({ scope: Scope.REQUEST })
@EventSubscriber()
export class ActionByUserSubscriber implements EntitySubscriberInterface {
  constructor(@Inject(CURRENT_USER) private readonly currentUserId: string) {}

  beforeInsert(event: InsertEvent<any>) {
    if (event?.entity?.createdBy) {
      event.entity.createdBy = this.currentUserId;
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    if (event?.entity?.updatedBy) {
      event.entity.updatedBy = this.currentUserId;
    }
  }
}

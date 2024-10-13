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
  // Listen to load events for all entities
  listenTo() {
    return Object; // This will make the subscriber apply to all entities
  }

  constructor(@Inject(CURRENT_USER) private readonly currentUserId: string) {
  }

  beforeInsert(event: InsertEvent<any>) {
    if (this.currentUserId) {
      if (event?.entity?.createdBy !== undefined) {
        event.entity.createdBy = this.currentUserId;
      }
      if (event?.entity?.createdById !== undefined) {
        event.entity.createdById = this.currentUserId;
      }
    } else {
      console.warn('currentUserId is undefined in beforeInsert');
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    if (this.currentUserId) {
      if (event?.entity?.updatedBy !== undefined) {
        event.entity.updatedBy = this.currentUserId;
      }
      if (event?.entity?.updatedById !== undefined) {
        event.entity.updatedById = this.currentUserId;
      }
    } else {
      console.warn('currentUserId is undefined in beforeUpdate');
    }
  }
}

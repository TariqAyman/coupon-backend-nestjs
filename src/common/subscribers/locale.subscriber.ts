import { Injectable } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
} from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

// Utility function to extract locale-specific data from JSON fields
function extractLocaleFromEntity(entity: any, locale: string): any {
  const newEntity = { ...entity };
  for (const key in entity) {
    if (entity.hasOwnProperty(key)) {
      if (typeof entity[key] === 'object' && entity[key] !== null) {
        console.log('Locale:', locale);

        if ('en' in entity[key] || 'ar' in entity[key]) {
          // Assuming the JSON contains locale keys
          newEntity[key] = entity[key][locale] || entity[key]['en']; // Default to 'en' if locale not found
        }
      }
    }
  }
  return newEntity;
}

@Injectable()
@EventSubscriber()
export class LocaleSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Object;
  }

  // Triggered after the entity has been loaded, regardless of relations
  afterLoad(entity: any) {
    const i18nContext = I18nContext.current();
    const locale = i18nContext ? i18nContext.lang : null;
 
    if (entity && locale) {
      this.extractLocaleFromEntity(entity, locale);
    }
  }

  // Transform JSON columns based on locale
  private extractLocaleFromEntity(entity: any, locale: string): any {
    for (const key in entity) {
      if (
        entity.hasOwnProperty(key) &&
        typeof entity[key] === 'object' &&
        entity[key] !== null
      ) {
        if (entity[key].hasOwnProperty(locale)) {
          entity[key] = entity[key][locale];
        }
      }
    }
    return entity;
  }
}

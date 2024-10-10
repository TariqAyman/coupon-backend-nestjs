import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';

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

@EventSubscriber()
export class LocaleSubscriber implements EntitySubscriberInterface {
  // Listen to load events for all entities
  listenTo() {
    console.log('listenTo:');
    return Object; // This will make the subscriber apply to all entities
  }

  // Before an entity is loaded, manipulate the data based on the locale
  beforeLoad(event: LoadEvent<any>) {
    const locale = event.connection.options.extra?.locale || 'en'; // Get locale from request context or default to 'en'

    console.log('Locale:', locale);

    if (event.entity) {
      event.entity = extractLocaleFromEntity(event.entity, locale);
    }
  }

  // Triggered after the entity has been loaded, regardless of relations
//   afterLoad(entity: any) {
//     const locale = this.getLocaleFromConnection(); // Get locale from request context (you'll need to implement this)

//     if (entity) {
//       this.extractLocaleFromEntity(entity, locale);
//     }
//   }

  // Helper to get locale from TypeORM's connection or some context (if applicable)
  private getLocaleFromConnection(): string {
    return 'en'; // You need to implement a way to get the locale (e.g., from request context)
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

import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Country } from '../countries/entities/country.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Ads } from '../ads/entities/ad.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { connectionSource } from './typeorm.config';
import { faker, fakerAR } from '@faker-js/faker';
import { UserRole } from '../common/enums/UserRole';
import { UserStatus } from '../common/enums/UserStatus';
import { CouponStatusAr, CouponStatusEn } from '../common/enums/CouponStatus';

async function initializeSeeder() {
  const dataSource = connectionSource;
  const NUM_ITEMS = 100;
  const PASSWORD_HASH = await bcrypt.hash('password', 10);

  async function createEntity(entityType: any, data: any) {
    const repository = dataSource.getRepository(entityType);
    await repository.save(data);
    return data;
  }

  function generateCommonFields() {
    return {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  function createSEOData() {
    return {
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: fakerAR.lorem.sentence(),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: fakerAR.lorem.sentence(),
      },
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: fakerAR.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: fakerAR.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: { en: faker.lorem.words(5), ar: fakerAR.lorem.words(5) },

      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: { en: faker.lorem.words(5), ar: fakerAR.lorem.words(5) },
      twitterImage: faker.image.url(),
    };
  }

  async function seedUsers() {
    const users = [
      {
        ...generateCommonFields(),
        fullName: 'Admin',
        email: 'admin@admin.com',
        password: PASSWORD_HASH,
        phoneNumber: '01003003200',
        phoneNumberCountryCode: 'EG',
        userLocale: 'en',
        role: UserRole.Admin,
        confirmAccount: true,
        status: UserStatus.Online,
        likedCoupons: [] as Coupon[],
        followedCoupons: [] as Coupon[],
        favoriteCoupons: [] as Coupon[],
        dislikedCoupons: [] as Coupon[],
        followedBrands: [] as Brand[],
      },
      {
        ...generateCommonFields(),
        fullName: 'User',
        email: 'user@user.com',
        password: PASSWORD_HASH,
        phoneNumber: '01003003201',
        phoneNumberCountryCode: 'EG',
        userLocale: 'ar',
        role: UserRole.User,
        confirmAccount: true,
        status: UserStatus.Online,
        likedCoupons: [] as Coupon[],
        followedCoupons: [] as Coupon[],
        favoriteCoupons: [] as Coupon[],
        dislikedCoupons: [] as Coupon[],
        followedBrands: [] as Brand[],
      },
    ];

    if (process.env.NODE_ENV === 'development') {
      for (let i = 0; i < NUM_ITEMS; i++) {
        users.push({
          ...generateCommonFields(),
          fullName: faker.person.fullName(),
          email: faker.internet.email(),
          password: PASSWORD_HASH,
          phoneNumber: faker.phone.number(),
          phoneNumberCountryCode: faker.location.countryCode(),
          userLocale: 'en',
          role: i % 2 === 0 ? UserRole.Admin : UserRole.User,
          confirmAccount: true,
          status: UserStatus.Online,
          likedCoupons: [] as Coupon[],
          followedCoupons: [] as Coupon[],
          favoriteCoupons: [] as Coupon[],
          dislikedCoupons: [] as Coupon[],
          followedBrands: [] as Brand[],
        });

        logProgress(User.name, i, NUM_ITEMS + 2);
      }
    }

    // check if users already exist with email or phoneNumber
    const existingUsers = await dataSource.getRepository(User).find({
      where: users.map((user) => ({
        email: user.email, // Check the email
      })),
      select: ['email', 'phoneNumber'], // Select email and phone number
    });

    // remove existing users from the array
    const filteredUsers = users.filter(
      (user) =>
        !existingUsers.some(
          (existingUser) =>
            existingUser.email == user.email ||
            existingUser.phoneNumber == user.phoneNumber,
        ),
    );

    return createEntity(User, filteredUsers);
  }

  async function seedCategories() {
    const categories = Array.from({ length: NUM_ITEMS }, (_, i) => {
      // Log progress for each item
      logProgress(Category.name, i, NUM_ITEMS);

      return {
        ...generateCommonFields(),
        ...createSEOData(),
        name: { en: faker.company.name(), ar: fakerAR.company.name() },
        description: {
          en: faker.lorem.sentence(),
          ar: fakerAR.lorem.sentence(),
        },
        slug: { en: faker.lorem.slug(), ar: fakerAR.lorem.slug() },
        image: faker.image.url(),
        color: faker.color.rgb(),
        twitterCard: 'summary_large_image',
        ogImage: faker.image.url(),
        ogUrl: faker.internet.url(),
        twitterImage: faker.image.url(),
      };
    });

    return createEntity(Category, categories);
  }

  async function seedBrands() {
    const brands = Array.from({ length: NUM_ITEMS }, (_, i) => {
      // Log progress for each item
      logProgress(Brand.name, i, NUM_ITEMS);

      return {
        ...generateCommonFields(),
        ...createSEOData(),
        name: { en: faker.company.name(), ar: fakerAR.company.name() },
        description: {
          en: faker.lorem.sentence(),
          ar: fakerAR.lorem.sentence(),
        },
        slug: { en: faker.company.name(), ar: fakerAR.company.name() },
        link: faker.internet.url(),
        image: faker.image.url(),
        twitterCard: 'summary_large_image',
        ogImage: faker.image.url(),
        ogUrl: faker.internet.url(),
        twitterImage: faker.image.url(),
      };
    });

    return createEntity(Brand, brands);
  }

  async function seedCountries() {
    const countries = Array.from({ length: NUM_ITEMS }, (_, i) => {
      // Log progress for each item
      logProgress(Country.name, i, NUM_ITEMS);

      return {
        ...generateCommonFields(),
        ...createSEOData(),
        name: faker.location.country(),
        countryCode: faker.location.countryCode(),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        image: faker.image.url(),
        description: {
          en: faker.lorem.sentence(),
          ar: fakerAR.lorem.sentence(),
        },
        twitterCard: 'summary_large_image',
        ogImage: faker.image.url(),
        ogUrl: faker.internet.url(),
        twitterImage: faker.image.url(),
      };
    });

    return createEntity(Country, countries);
  }

  async function seedCoupons(
    users: User[],
    categories: any[],
    brands: any[],
    countries: any[],
  ) {
    const coupons = Array.from({ length: NUM_ITEMS }, (_, i) => {
      // Log progress for each item
      logProgress(Coupon.name, i, NUM_ITEMS);

      return {
        ...generateCommonFields(),
        ...createSEOData(),
        name: { en: faker.company.name(), ar: fakerAR.company.name() },
        description: {
          en: faker.lorem.sentence(),
          ar: fakerAR.lorem.sentence(),
        },
        code: faker.string.alphanumeric(10),
        amount: faker.number.int({ min: 5, max: 50 }),
        status: { en: CouponStatusEn.DISCOUNT, ar: CouponStatusAr.DISCOUNT },
        expire: faker.date.future(),
        qrCode: faker.string.alphanumeric(10),
        link: faker.internet.url(),
        twitterCard: 'summary_large_image',
        ogImage: faker.image.url(),
        ogUrl: faker.internet.url(),
        twitterImage: faker.image.url(),
        createdById: users[Math.floor(Math.random() * users.length)],
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        countries: [countries[Math.floor(Math.random() * countries.length)]],
        brand: brands[Math.floor(Math.random() * brands.length)],
      };
    });

    return createEntity(Coupon, coupons);
  }

  async function seedAds() {
    const ads = Array.from({ length: NUM_ITEMS }, (_, i) => {
      // Log progress for each item
      logProgress(Ads.name, i, NUM_ITEMS);

      return {
        ...generateCommonFields(),
        ...createSEOData(),
        name: { en: faker.company.name(), ar: fakerAR.company.name() },
        description: {
          en: faker.lorem.sentence(),
          ar: fakerAR.lorem.sentence(),
        },
        link: faker.internet.url(),
        image: faker.image.url(),
        twitterCard: 'summary_large_image',
        ogImage: faker.image.url(),
        ogUrl: faker.internet.url(),
        twitterImage: faker.image.url(),
      };
    });

    return createEntity(Ads, ads);
  }

  async function runSeeders() {
    console.time('Seeding Duration');

    await dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });

    // Run independent seeds in parallel
    const [users, categories, brands, countries, ads] = await Promise.all([
      seedUsers(),
      seedCategories(),
      seedBrands(),
      seedCountries(),
      seedAds(),
    ]);

    const coupons = await seedCoupons(
      users as any,
      categories,
      brands,
      countries,
    );

    // Establish relationships
    await seedRelationships(User, users, coupons, 'likedCoupons');
    await seedRelationships(User, users, coupons, 'followedCoupons');
    await seedRelationships(User, users, coupons, 'favoriteCoupons');
    await seedRelationships(User, users, coupons, 'dislikedCoupons');
    await seedRelationships(User, users, brands, 'followedBrands');

    // Seed additional relationships
    await seedRelationships(Brand, brands, categories, 'categories');
    await seedRelationships(Brand, brands, countries, 'countries');
    await seedRelationships(Ads, ads, countries, 'countries');
    await seedRelationships(Category, categories, countries, 'countries');
    await seedRelationships(Coupon, coupons, brands, 'brands');
  }

  async function seedRelationships(
    entityType: any,
    entities: any,
    relatedEntities: any,
    relationKey: any,
    min = 1,
    max = 3,
  ) {
    const repository = dataSource.getRepository(entityType);

    for (const [index, entity] of entities.entries()) {
      entity[relationKey] = faker.helpers.arrayElements(relatedEntities, {
        min,
        max,
      });

      logRelationshipsProgress(
        `${entityType.name} with ${relationKey}`,
        index + 1,
        entities.length,
      );
      await repository.save(entity);
    }
  }

  const logRelationshipsProgress = (
    entity: any,
    current: number,
    total: number,
  ) => {
    console.warn(
      `Seeding ${entity}: ${current}/${total} (${Math.round((current / total) * 100)}%)`,
    );
  };

  const logProgress = (entity: any, current: number, total: number) => {
    console.warn(
      `Seeding Relationships ${entity}: ${current}/${total} (${Math.round((current / total) * 100)}%)`,
    );
  };

  runSeeders()
    .catch((error) => console.error('Error seeding data:', error))
    .finally(() => {
      dataSource.destroy();
      console.timeEnd('Seeding Duration');
    });
}

initializeSeeder().catch((error) =>
  console.error('Error initializing seeder:', error),
);

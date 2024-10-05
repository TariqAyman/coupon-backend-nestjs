import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Country } from '../countries/entities/country.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Ads } from '../ads/entities/ad.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { connectionSource } from './typeorm.config';
import { faker } from '@faker-js/faker';
import { UserRole } from '../common/enums/UserRole';
import { UserStatus } from '../common/enums/UserStatus';
import { CouponStatusAr, CouponStatusEn } from '../common/enums/CouponStatus';

const dataSource = connectionSource;

async function seedUsers() {
  const userRepository = dataSource.getRepository(User);
  const users = [];
  users.push({
    id: uuidv4(),
    fullName: 'Admin',
    email: 'admin@admin.com',
    password: await bcrypt.hash('password', 10),
    phoneNumber: '01003003200',
    phoneNumberCountryCode: 'EG',
    role: UserRole.Admin,
    confirmAccount: true,
    status: UserStatus.Online,
    createdAt: new Date(),
    updatedAt: new Date(),
    likedCoupons: [] as Coupon[],
    followedCoupons: [] as Coupon[],
    favoriteCoupons: [] as Coupon[],
    dislikedCoupons: [] as Coupon[],
    followedBrands: [] as Brand[],
  });

  users.push({
    id: uuidv4(),
    fullName: 'User',
    email: 'user@user.com',
    password: await bcrypt.hash('password', 10),
    phoneNumber: '01003003201',
    phoneNumberCountryCode: 'EG',
    role: UserRole.User,
    confirmAccount: true,
    status: UserStatus.Online,
    createdAt: new Date(),
    updatedAt: new Date(),
    likedCoupons: [] as Coupon[],
    followedCoupons: [] as Coupon[],
    favoriteCoupons: [] as Coupon[],
    dislikedCoupons: [] as Coupon[],
    followedBrands: [] as Brand[],
  });

  for (let i = 0; i < 100; i++) {
    users.push({
      id: uuidv4(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password', 10),
      phoneNumber: faker.phone.number(),
      phoneNumberCountryCode: faker.location.countryCode(),
      role: i % 2 === 0 ? UserRole.Admin : UserRole.User,
      confirmAccount: true,
      status: UserStatus.Online,
      createdAt: new Date(),
      updatedAt: new Date(),
      likedCoupons: [] as Coupon[],
      followedCoupons: [] as Coupon[],
      favoriteCoupons: [] as Coupon[],
      dislikedCoupons: [] as Coupon[],
      followedBrands: [] as Brand[],
    });
  }
  await userRepository.save(users);
  return users;
}

async function seedCategories() {
  const categoryRepository = dataSource.getRepository(Category);
  const categories = [];
  for (let i = 0; i < 100; i++) {
    categories.push({
      id: uuidv4(),
      name: {
        en: faker.commerce.department(),
        ar: faker.commerce.department(),
      },
      slug: { en: faker.lorem.slug(), ar: faker.lorem.slug() },
      description: { en: faker.lorem.sentence(), ar: faker.lorem.sentence() },
      image: faker.image.url(),
      icon: faker.image.url(),
      color: faker.color.rgb(),
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: faker.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      twitterImage: faker.image.url(),
      createdById: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await categoryRepository.save(categories);
  return categories;
}

async function seedBrands() {
  const brandRepository = dataSource.getRepository(Brand);
  const brands = [];
  for (let i = 0; i < 100; i++) {
    brands.push({
      id: uuidv4(),
      name: { en: faker.company.name(), ar: faker.company.name() },
      slug: faker.lorem.slug(),
      description: { en: faker.lorem.sentence(), ar: faker.lorem.sentence() },
      link: faker.internet.url(),
      image: faker.image.url(),
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: faker.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      twitterImage: faker.image.url(),
      createdById: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await brandRepository.save(brands);
  return brands;
}

async function seedCountries() {
  const countryRepository = dataSource.getRepository(Country);
  const countries = [];
  for (let i = 0; i < 100; i++) {
    countries.push({
      id: uuidv4(),
      name: faker.location.country(),
      countryCode: faker.location.countryCode(),
      latitude: faker.location.latitude().toString(),
      longitude: faker.location.longitude().toString(),
      image: faker.image.url(),
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: faker.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      twitterImage: faker.image.url(),
      createdById: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await countryRepository.save(countries);
  return countries;
}

async function seedCoupons(
  users: User[],
  categories: any[],
  brands: any[],
  countries: any[],
) {
  const couponRepository = dataSource.getRepository(Coupon);
  const coupons = [];
  for (let i = 0; i < 100; i++) {
    coupons.push({
      id: uuidv4(),
      code: faker.string.alphanumeric(10),
      amount: faker.number.int({ min: 5, max: 50 }),
      status: {
        en: CouponStatusEn.DISCOUNT,
        ar: CouponStatusAr.DISCOUNT,
      },
      description: { en: faker.lorem.sentence(), ar: faker.lorem.sentence() },
      expire: faker.date.future(),
      qrCode: faker.string.alphanumeric(10),
      link: faker.internet.url(),
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: faker.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      twitterImage: faker.image.url(),
      createdById: users[Math.floor(Math.random() * users.length)],
      categories: [categories[Math.floor(Math.random() * categories.length)]],
      countries: [countries[Math.floor(Math.random() * countries.length)]],
      brand: brands[Math.floor(Math.random() * brands.length)],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await couponRepository.save(coupons);
  return coupons;
}

async function seedAds(users: User[], countries: any[]) {
  const adsRepository = dataSource.getRepository(Ads);
  const ads = [];
  for (let i = 0; i < 100; i++) {
    ads.push({
      id: uuidv4(),
      name: faker.company.catchPhrase(),
      link: faker.internet.url(),
      image: faker.image.url(),
      seoDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      seoKeywords: {
        en: faker.lorem.words({ min: 10, max: 20 }),
        ar: faker.lorem.words({ min: 10, max: 20 }),
      },
      ogTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      ogDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      ogImage: faker.image.url(),
      ogUrl: faker.internet.url(),
      twitterCard: 'summary_large_image',
      twitterTitle: {
        en: faker.lorem.words(5),
        ar: faker.lorem.words(5),
      },
      twitterDescription: {
        en: faker.lorem.sentence(),
        ar: faker.lorem.sentence(),
      },
      twitterImage: faker.image.url(),
      createdById: users[Math.floor(Math.random() * users.length)],
      countries: [countries[Math.floor(Math.random() * countries.length)]],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await adsRepository.save(ads);
}

async function seedBrandCategories(brands: Brand[], categories: Category[]) {
  const brandRepository = dataSource.getRepository(Brand);

  for (const brand of brands) {
    // Randomly select 1-3 categories for each brand
    const brandCategories = faker.helpers.arrayElements(categories, {
      min: 1,
      max: 3,
    });
    brand.categories = brandCategories;
    await brandRepository.save(brand);
  }
}

async function seedBrandCountries(brands: Brand[], countries: Country[]) {
  const brandRepository = dataSource.getRepository(Brand);

  for (const brand of brands) {
    // Randomly select 1-3 countries for each brand
    const brandCountries = faker.helpers.arrayElements(countries, {
      min: 1,
      max: 3,
    });
    brand.countries = brandCountries;
    await brandRepository.save(brand);
  }
}

async function seedCategoryCountries(
  categories: Category[],
  countries: Country[],
) {
  const categoryRepository = dataSource.getRepository(Category);

  for (const category of categories) {
    // Randomly select 1-3 countries for each category
    const categoryCountries = faker.helpers.arrayElements(countries, {
      min: 1,
      max: 3,
    });
    category.countries = categoryCountries;
    await categoryRepository.save(category);
  }
}

async function seedCouponBrands(coupons: Coupon[], brands: Brand[]) {
  const couponRepository = dataSource.getRepository(Coupon);

  for (const coupon of coupons) {
    // Randomly select 1-3 brands for each coupon
    const couponBrands = faker.helpers.arrayElements(brands, {
      min: 1,
      max: 3,
    });
    coupon.brands = couponBrands;
    await couponRepository.save(coupon);
  }
}

async function runSeeders() {
  await dataSource.initialize();
  const users = await seedUsers();
  const categories = await seedCategories();
  const brands = await seedBrands();
  const countries = await seedCountries();
  const coupons = await seedCoupons(
    users as any,
    categories,
    brands,
    countries,
  );
  await seedAds(users as any, countries);

  // Establish relationships
  const userRepository = dataSource.getRepository(User);
  users.forEach((user) => {
    user.likedCoupons = [
      coupons[Math.floor(Math.random() * coupons.length)] as any,
    ];
    user.followedCoupons = [
      coupons[Math.floor(Math.random() * coupons.length)] as any,
    ];
    user.favoriteCoupons = [
      coupons[Math.floor(Math.random() * coupons.length)] as any,
    ];
    user.dislikedCoupons = [
      coupons[Math.floor(Math.random() * coupons.length)] as any,
    ];
    user.followedBrands = [
      brands[Math.floor(Math.random() * brands.length)] as any,
    ];
  });

  await userRepository.save(users);

  // Seed additional relationships
  await seedBrandCategories(brands as any, categories as any);
  await seedBrandCountries(brands as any, countries as any);
  await seedCategoryCountries(categories as any, countries as any);
  await seedCouponBrands(coupons as any, brands as any);

  await dataSource.destroy();
}

runSeeders().catch((error) => console.error('Error seeding data:', error));

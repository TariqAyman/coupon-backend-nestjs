import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Location } from '../locations/entities/location.entity';
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
    password: 'password',
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
      password: 'password',
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
      password: 'password',
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
      createdBy: null as any,
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
      createdBy: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await brandRepository.save(brands);
  return brands;
}

async function seedLocations() {
  const locationRepository = dataSource.getRepository(Location);
  const locations = [];
  for (let i = 0; i < 100; i++) {
    locations.push({
      id: uuidv4(),
      name: faker.string.alphanumeric(20),
      locationCode: faker.location.zipCode(),
      image: faker.image.url(),
      createdBy: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await locationRepository.save(locations);
  return locations;
}

async function seedCoupons(
  users: User[],
  categories: any[],
  brands: any[],
  locations: any[],
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
      createdBy: users[Math.floor(Math.random() * users.length)],
      categories: [categories[Math.floor(Math.random() * categories.length)]],
      locations: [locations[Math.floor(Math.random() * locations.length)]],
      brand: brands[Math.floor(Math.random() * brands.length)],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await couponRepository.save(coupons);
  return coupons;
}

async function seedAds(users: User[], locations: any[]) {
  const adsRepository = dataSource.getRepository(Ads);
  const ads = [];
  for (let i = 0; i < 100; i++) {
    ads.push({
      id: uuidv4(),
      name: faker.company.catchPhrase(),
      link: faker.internet.url(),
      image: faker.image.url(),
      createdBy: users[Math.floor(Math.random() * users.length)],
      locations: [locations[Math.floor(Math.random() * locations.length)]],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await adsRepository.save(ads);
}

async function seedBrandCategories(brands: Brand[], categories: Category[]) {
  const brandCategoryRepository = dataSource.getRepository('brand_categories');
  const brandCategories = new Set();

  while (brandCategories.size < 100) {
    const brandId = brands[Math.floor(Math.random() * brands.length)].id;
    const categoryId =
      categories[Math.floor(Math.random() * categories.length)].id;
    const key = `${brandId}-${categoryId}`;

    if (!brandCategories.has(key)) {
      brandCategories.add(key);
    }
  }

  const brandCategoryArray = Array.from(brandCategories).map((key: string) => {
    const [brand_id, category_id] = key.split('-');
    return { brand_id, category_id };
  });

  await brandCategoryRepository.save(brandCategoryArray);
}

async function seedBrandLocations(brands: Brand[], locations: Location[]) {
  const brandLocationRepository = dataSource.getRepository('brand_locations');
  const brandLocations = new Set();

  while (brandLocations.size < 100) {
    const brandId = brands[Math.floor(Math.random() * brands.length)].id;
    const locationId =
      locations[Math.floor(Math.random() * locations.length)].id;
    const key = `${brandId}-${locationId}`;

    if (!brandLocations.has(key)) {
      brandLocations.add(key);
    }
  }

  const brandLocationArray = Array.from(brandLocations).map((key: string) => {
    const [brand_id, location_id] = key.split('-');
    return { brand_id, location_id };
  });

  await brandLocationRepository.save(brandLocationArray);
}

async function seedCategoryLocations(
  categories: Category[],
  locations: Location[],
) {
  const categoryLocationRepository =
    dataSource.getRepository('category_locations');
  const categoryLocations = new Set();

  while (categoryLocations.size < 100) {
    const categoryId =
      categories[Math.floor(Math.random() * categories.length)].id;
    const locationId =
      locations[Math.floor(Math.random() * locations.length)].id;
    const key = `${categoryId}-${locationId}`;

    if (!categoryLocations.has(key)) {
      categoryLocations.add(key);
    }
  }

  const categoryLocationArray = Array.from(categoryLocations).map(
    (key: string) => {
      const [category_id, location_id] = key.split('-');
      return { category_id, location_id };
    },
  );

  await categoryLocationRepository.save(categoryLocationArray);
}

async function seedCouponBrands(coupons: Coupon[], brands: Brand[]) {
  const couponBrandRepository = dataSource.getRepository('coupon_brands');
  const couponBrands = new Set();

  while (couponBrands.size < 100) {
    const couponId = coupons[Math.floor(Math.random() * coupons.length)].id;
    const brandId = brands[Math.floor(Math.random() * brands.length)].id;
    const key = `${couponId}-${brandId}`;

    if (!couponBrands.has(key)) {
      couponBrands.add(key);
    }
  }

  const couponBrandArray = Array.from(couponBrands).map((key: string) => {
    const [coupon_id, brand_id] = key.split('-');
    return { coupon_id, brand_id };
  });

  await couponBrandRepository.save(couponBrandArray);
}

async function runSeeders() {
  await dataSource.initialize();
  const users = await seedUsers();
  const categories = await seedCategories();
  const brands = await seedBrands();
  const locations = await seedLocations();
  const coupons = await seedCoupons(
    users as any,
    categories,
    brands,
    locations,
  );
  await seedAds(users as any, locations);

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

  //   // Seed additional relationships
  //   await seedBrandCategories(brands as any, categories as any);
  //   await seedBrandLocations(brands as any, locations as any);
  //   await seedCategoryLocations(categories as any, locations as any);
  //   await seedCouponBrands(coupons as any, brands as any);

  await dataSource.destroy();
}

runSeeders().catch((error) => console.error('Error seeding data:', error));

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { UserRole } from 'src/common/enums/UserRole';
import { UserStatus } from 'src/common/enums/UserStatus';
import { UserProvider } from 'src/common/enums/UserProvider';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { UploadMediaService } from 'src/upload-media/upload-media.service';
import { ProfileDto } from 'src/authentication/dto/profile.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import {
  createDislikedSubQuery,
  createFavoriteSubQuery,
  createFollowedBrandSubQuery,
  createFollowedSubQuery,
  createLikedSubQuery,
} from 'src/common/utils/sub-query';
import { UpdateProfileDto } from 'src/authentication/dto/updateProfile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Coupon)
    private readonly couponsRepository: Repository<Coupon>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
    private readonly uploadMediaService: UploadMediaService,
    private jwtService: JwtService,
    private readonly dataSource: DataSource, // Inject DataSource for transactions
  ) {}

  async register(
    registerMethod: string,
    registerDto: RegisterDto,
    avatar: any,
  ): Promise<ProfileDto> {
    let existingUser: User | null = null;

    if (registerMethod === 'email') {
      existingUser = await this.findByEmail(registerDto.email as string);
    }
    if (registerMethod === 'phoneNumber') {
      existingUser = await this.findByPhoneNumberAndCountryCode(
        registerDto.phoneNumber as string,
        registerDto.phoneNumberCountryCode as string,
      );
    }

    if (existingUser) {
      throw new ConflictException('Email or Phone already exists');
    }

    const user = new User();
    user.email = registerDto?.email;
    user.password = await bcrypt.hash(registerDto.password, 10);
    user.role = UserRole.User;
    user.status = UserStatus.Online;
    user.fullName = registerDto.fullName;
    user.phoneNumber = registerDto?.phoneNumber;
    user.phoneNumberCountryCode = registerDto.phoneNumberCountryCode;

    const uploadedAvatar = await this.uploadMediaService.saveOneFile(
      avatar,
      'brand',
      user.id,
    );
    user.avatar = uploadedAvatar?.url;

    user.birthday = new Date();
    user.joined = new Date();
    user.gender = registerDto.gender;
    user.provider = UserProvider.System;
    user.confirmAccount = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.lastLogin = new Date();
    user.lastLogout = new Date();
    user.verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.userLocale = registerDto.userLocale;
    const newUser = await this.usersRepository.save(user);

    return new ProfileDto(newUser);
  }

  async registerGoogleUser(googleUser: any): Promise<User | null> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = new User();
      user.email = googleUser.email;
      user.password = await bcrypt.hash(googleUser.email, 10);
      user.role = UserRole.User;
      user.status = UserStatus.Online;
      user.fullName = googleUser.firstName + ' ' + googleUser.lastName;
      // user.phoneNumber = googleUser.phoneNumber;
      // user.phoneNumberCountryCode = registerDto.phoneNumberCountryCode;

      user.avatar = googleUser.picture;

      user.joined = new Date();
      user.provider = UserProvider.Google;
      user.confirmAccount = true;
      user.createdAt = new Date();
      user.updatedAt = new Date();
      user.lastLogin = new Date();
      user.lastLogout = new Date();
      user.userLocale = 'en';
      const newUser = await this.usersRepository.save(user);

      return newUser;
    } catch {
      return null;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateUserToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);

    return await this.usersRepository
      .findOne({
        where: { email: decoded.email },
      })
      .then((user: any) => {
        return user ?? null;
      });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .findOne({ where: { email } })
      .then((user: any) => {
        return user ?? null;
      });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.usersRepository
      .findOne({ where: { phoneNumber } })
      .then((user: any) => {
        return user ?? null;
      });
  }

  async findByPhoneNumberAndCountryCode(
    phoneNumber: string,
    countryCode: string,
  ): Promise<User | null> {
    return this.usersRepository
      .findOne({
        where: {
          phoneNumber,
          phoneNumberCountryCode: countryCode,
        },
      })
      .then((user: any) => {
        return user ?? null;
      });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  // add last login time func

  async addDislikedCoupon(userId: string, couponId: string) {
    await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['dislikedCoupons'],
      });

      const coupon = await manager.findOne(Coupon, {
        where: { id: couponId },
      });

      if (coupon && user) {
        // Check if the coupon is already disliked by the user
        if (!user.dislikedCoupons.some((c) => c.id === couponId)) {
          user.dislikedCoupons.push(coupon);
          await manager.save(user);

          // Recalculate dislikeCount
          const dislikeCount = await manager
            .createQueryBuilder('user_liked_coupons', 'ulcc')
            .where('ulcc.couponId = :couponId', { couponId })
            .getCount();

          // Update coupon dislikeCount
          await manager.update(Coupon, couponId, { dislikeCount });
        }
      }
    });
  }

  async addFavoriteCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['favoriteCoupons'],
      });
      const coupon = await manager.findOne(Coupon, { where: { id: couponId } });

      if (user && coupon) {
        if (!user.favoriteCoupons.some((c) => c.id === couponId)) {
          user.favoriteCoupons.push(coupon);
          await manager.save(user);
        }
        return user;
      }
      throw new Error('User or coupon not found');
    });
  }

  async followBrand(userId: string, brandId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['followedBrands'],
      });
      const brand = await manager.findOne(Brand, { where: { id: brandId } });

      if (user && brand) {
        if (!user.followedBrands.some((b) => b.id === brandId)) {
          user.followedBrands.push(brand);
          await manager.save(user);
        }

        // Recalculate likeCount
        const mostFollowed = await manager
          .createQueryBuilder('user_followed_brands', 'ulcc')
          .where('ulcc.brandId = :brandId', { brandId })
          .getCount();

        // Update coupon likeCount
        await manager.update(Brand, brandId, { mostFollowed });

        return user;
      }
      throw new Error('User or brand not found');
    });
  }

  async followCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['followedCoupons'],
      });
      const coupon = await manager.findOne(Coupon, { where: { id: couponId } });

      if (user && coupon) {
        if (!user.followedCoupons.some((c) => c.id === couponId)) {
          user.followedCoupons.push(coupon);
          await manager.save(user);
        }
        return user;
      }
      throw new Error('User or coupon not found');
    });
  }

  async likeCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['likedCoupons'],
      });
      const coupon = await manager.findOne(Coupon, { where: { id: couponId } });

      if (user && coupon) {
        if (!user.likedCoupons.some((c) => c.id === couponId)) {
          user.likedCoupons.push(coupon);
          await manager.save(user);

          // Recalculate likeCount
          const likeCount = await manager
            .createQueryBuilder('user_liked_coupons', 'ulcc')
            .where('ulcc.couponId = :couponId', { couponId })
            .getCount();

          // Update coupon likeCount
          await manager.update(Coupon, couponId, { likeCount });
        }
        return user;
      }
      throw new Error('User or coupon not found');
    });
  }

  async getUserDislikedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['dislikedCoupons'],
    });
    return user?.dislikedCoupons || [];
  }

  async removeDislikedCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['dislikedCoupons'],
      });
      if (!user) throw new Error('User not found');

      user.dislikedCoupons = user.dislikedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      await manager.save(user);

      // Recalculate dislikeCount
      const dislikeCount = await manager
        .createQueryBuilder('user_liked_coupons', 'ulcc')
        .where('ulcc.couponId = :couponId', { couponId })
        .getCount();

      // Update coupon dislikeCount
      await manager.update(Coupon, couponId, { dislikeCount });
    });
  }

  async getUserFavoriteCoupons(
    pagination: PaginationOptionsDto,
    userId: string,
  ): Promise<{
    data: Coupon[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const options: PaginationOptionsDto = {
      ...pagination,
      relationFilterBy: 'userFavorite_entity.userId',
      relationFilterValue: userId,
      hiddenRelationFilterBy: ['userFavorite'],
    };
    return await findWithPagination(
      this.couponsRepository,
      options,
      ['userFavorite', 'categories', 'countries', 'brands'],
      (queryBuilder: any) => {
        if (userId) {
          queryBuilder.addSelect(
            createDislikedSubQuery(userId),
            'entity_isDisliked',
          );
          queryBuilder.addSelect(
            createFavoriteSubQuery(userId),
            'entity_isFavorite',
          );
          queryBuilder.addSelect(
            createFollowedSubQuery(userId),
            'entity_isFollowed',
          );
          queryBuilder.addSelect(createLikedSubQuery(userId), 'entity_isLiked');
        }
      },
    );
  }

  async removeFavoriteCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['favoriteCoupons'],
      });
      if (!user) throw new Error('User not found');

      user.favoriteCoupons = user.favoriteCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      await manager.save(user);
    });
  }

  async getUserFollowedBrands(
    pagination: PaginationOptionsDto,
    userId: string,
  ): Promise<{
    data: Brand[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const options: PaginationOptionsDto = {
      ...pagination,
      relationFilterBy: 'userFollowed_entity.userId',
      relationFilterValue: userId,
      hiddenRelationFilterBy: ['userFollowed'],
    };

    return await findWithPagination(
      this.brandsRepository,
      options,
      ['userFollowed'],
      (queryBuilder: any) => {
        if (userId) {
          queryBuilder.addSelect(
            createFollowedBrandSubQuery(userId),
            'entity_isFollowed',
          );
        }
      },
    );
  }

  async unfollowBrand(userId: string, brandId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['followedBrands'],
      });
      if (!user) throw new Error('User not found');

      user.followedBrands = user.followedBrands.filter(
        (brand) => brand.id !== brandId,
      );
      await manager.save(user);
    });
  }

  async getUserFollowedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedCoupons'],
    });
    return user?.followedCoupons || [];
  }

  async unfollowCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['followedCoupons'],
      });
      if (!user) throw new Error('User not found');

      user.followedCoupons = user.followedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      await manager.save(user);
    });
  }

  async getUserLikedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likedCoupons'],
    });
    return user?.likedCoupons || [];
  }

  async unlikeCoupon(userId: string, couponId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        relations: ['likedCoupons'],
      });
      if (!user) throw new Error('User not found');

      user.likedCoupons = user.likedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      await manager.save(user);

      // Recalculate likeCount
      const likeCount = await manager
        .createQueryBuilder('user_liked_coupons', 'ulcc')
        .where('ulcc.couponId = :couponId', { couponId })
        .getCount();

      // Update coupon likeCount
      await manager.update(Coupon, couponId, { likeCount });
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = newPassword;

    return await this.usersRepository.save(user);
  }

  async verifyUserEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.confirmAccount = true;
    return await this.usersRepository.save(user);
  }

  async profile(userId: string) {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return new ProfileDto(user);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const uploadedAvatar = file
      ? await this.uploadMediaService.saveOneFile(file, 'user', user.id)
      : null;

    await this.usersRepository.update(userId, {
      ...updateProfileDto,
      avatar: uploadedAvatar?.url || user.avatar,
    });

    const newUserInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });

    return new ProfileDto(newUserInfo);
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { UserRole } from 'src/common/enums/UserRole';
import { UserStatus } from 'src/common/enums/UserStatus';
import { UserProvider } from 'src/common/enums/UserProvider';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { UploadMediaService } from 'src/upload-media/upload-media.service';

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
  ) {}

  async register(registerDto: RegisterDto, avatar: any): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new User();
    user.email = registerDto.email;
    user.password = registerDto.password;
    user.role = UserRole.User;
    user.status = UserStatus.Online;
    user.fullName = registerDto.fullName;
    user.phoneNumber = registerDto.phoneNumber;
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
    return this.usersRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } }).then((user) => {
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    });
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  // add last login time func

  async addDislikedCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['dislikedCoupons'],
    });
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (coupon && user) {
      user.dislikedCoupons.push(coupon);
      await this.usersRepository.save(user);
    }
  }

  async addFavoriteCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteCoupons'],
    });
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (user && coupon) {
      user.favoriteCoupons.push(coupon);
      return this.usersRepository.save(user);
    }
    throw new Error('User or coupon not found');
  }

  async followBrand(userId: string, brandId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedBrands'],
    });
    const brand = await this.brandsRepository.findOne({
      where: { id: brandId },
    });

    if (user && brand) {
      user.followedBrands.push(brand);
      return this.usersRepository.save(user);
    }
    throw new Error('User or brand not found');
  }

  async followCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedCoupons'],
    });
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (user && coupon) {
      user.followedCoupons.push(coupon);
      return this.usersRepository.save(user);
    }

    throw new Error('User or coupon not found');
  }

  async likeCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likedCoupons'],
    });
    const coupon = await this.couponsRepository.findOne({
      where: { id: couponId },
    });

    if (user && coupon) {
      user.likedCoupons.push(coupon);
      return this.usersRepository.save(user);
    }
    throw new Error('User or coupon not found');
  }

  async getUserDislikedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['dislikedCoupons'],
    });
    return user?.dislikedCoupons || [];
  }

  async removeDislikedCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['dislikedCoupons'],
    });
    if (user) {
      user.dislikedCoupons = user.dislikedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }

  async getUserFavoriteCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteCoupons'],
    });
    return user?.favoriteCoupons || [];
  }

  async removeFavoriteCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteCoupons'],
    });
    if (user) {
      user.favoriteCoupons = user.favoriteCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }

  async getUserFollowedBrands(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedBrands'],
    });
    return user?.followedBrands || [];
  }

  async unfollowBrand(userId: string, brandId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedBrands'],
    });
    if (user) {
      user.followedBrands = user.followedBrands.filter(
        (brand) => brand.id !== brandId,
      );
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }

  async getUserFollowedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedCoupons'],
    });
    return user?.followedCoupons || [];
  }

  async unfollowCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followedCoupons'],
    });
    if (user) {
      user.followedCoupons = user.followedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }

  async getUserLikedCoupons(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likedCoupons'],
    });
    return user?.likedCoupons || [];
  }

  async unlikeCoupon(userId: string, couponId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likedCoupons'],
    });
    if (user) {
      user.likedCoupons = user.likedCoupons.filter(
        (coupon) => coupon.id !== couponId,
      );
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }
}

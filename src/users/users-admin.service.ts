import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationOptionsDto } from 'src/common/dto/pagination-options.dto';
import { findWithPagination } from 'src/common/utils/pagination.util';
import { ProfileDto } from 'src/authentication/dto/profile.dto';
import { UsersService } from './users.service';
import { UserRole } from 'src/common/enums/UserRole';
import { UserStatus } from 'src/common/enums/UserStatus';
import { UploadMediaService } from 'src/upload-media/upload-media.service';
import * as bcrypt from 'bcrypt';
import { UserProvider } from 'src/common/enums/UserProvider';

@Injectable()
export class UsersAdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly uploadMediaService: UploadMediaService,
  ) {}

  async create(createUserDto: CreateUserDto, avatar: any): Promise<User> {
    let userByEmail: User | null = null;
    let userByPhoneNumber: User | null = null;

    if (createUserDto?.email) {
      userByEmail = await this.findByEmail(createUserDto.email as string);
    }
    if (createUserDto?.phoneNumber) {
      userByPhoneNumber =
        await this.usersService.findByPhoneNumberAndCountryCode(
          createUserDto.phoneNumber as string,
          createUserDto.phoneNumberCountryCode as string,
        );
    }

    if (userByEmail || userByPhoneNumber) {
      throw new ConflictException('Email or Phone already exists');
    }

    const user = new User();
    user.email = createUserDto?.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.role = createUserDto.role;
    user.status = createUserDto.status;
    user.fullName = createUserDto.fullName;
    user.phoneNumber = createUserDto?.phoneNumber;
    user.phoneNumberCountryCode = createUserDto.phoneNumberCountryCode;

    const uploadedAvatar = await this.uploadMediaService.saveOneFile(
      avatar,
      'brand',
      user.id,
    );
    user.avatar = uploadedAvatar?.url;

    user.birthday = new Date();
    user.joined = new Date();
    user.gender = createUserDto.gender;
    user.provider = UserProvider.System;
    user.confirmAccount = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.lastLogin = new Date();
    user.lastLogout = new Date();
    user.verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.userLocale = createUserDto.userLocale;
    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .findOne({ where: { email } })
      .then((user: any) => {
        return user ?? null;
      });
  }

  async findAll(pagination: PaginationOptionsDto): Promise<{
    data: User[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    return findWithPagination(this.usersRepository, pagination);
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, avatar: any) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    const uploadedAvatar = await this.uploadMediaService.saveOneFile(
      avatar,
      'brand',
      user.id,
    );

    const updatedUserData = {
      ...updateUserDto,
      avatar: uploadedAvatar?.url ?? user.avatar,
    };

    await this.usersRepository.update(id, updatedUserData);
    return this.findOne(id);
  }
  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    return this.usersRepository.softDelete(id);
  }

  async getUsersHasTokens() {
    const users = await this.usersRepository.find({
      select: {
        id: true,
        email: true,
        fullName: true,
      },
      relations: {
        userTokens: true,
      },
      where: {
        userTokens: {
          token: Not(IsNull()),
        },
      },
    });

    return users;
  }
}

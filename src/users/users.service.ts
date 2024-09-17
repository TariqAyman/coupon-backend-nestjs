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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
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
    user.image = registerDto.image;
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
}

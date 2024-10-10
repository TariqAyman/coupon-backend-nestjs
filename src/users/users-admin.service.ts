import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersAdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } }).then((user) => {
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    });
  }

  async findAll(pagination: PaginationDto): Promise<{
    data: User[];
    total: number;
    pageNumber: number;
    limitNumber: number;
  }> {
    const pageNumber = Number(pagination.page);
    const limitNumber = Number(pagination.limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid page or limit value');
    }

    const [data, total] = await this.usersRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: { createdAt: 'DESC' },
    });

    return { data, total, pageNumber, limitNumber };
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
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
      where: {
        userTokens: {
          token: Not(IsNull()),
        },
      }
    });

    return users;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private mapUserToResponseDto(user: User): UserResponseDto {
    const { id, email, firstName, lastName, role } = user;

    return { id, email, firstName, lastName, role };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => this.mapUserToResponseDto(user));
  }
}

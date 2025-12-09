import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserResponseDto } from './dto';

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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);

    return this.mapUserToResponseDto(updated);
  }
}

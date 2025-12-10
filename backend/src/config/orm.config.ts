import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const baseTypeOrmOptions: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: ['error'],
};

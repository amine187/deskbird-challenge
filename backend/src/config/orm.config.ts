import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const baseTypeOrmOptions: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: ['error'],
};

import 'reflect-metadata';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../../../.env') });

import { baseTypeOrmOptions } from '../config/orm.config';
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';

const AppDataSource = new DataSource({
  ...baseTypeOrmOptions,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
} as DataSourceOptions & SeederOptions);

export default AppDataSource;

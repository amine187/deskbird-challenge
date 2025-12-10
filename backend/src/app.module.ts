import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { baseTypeOrmOptions } from './config/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...baseTypeOrmOptions,
        logging:
          config.get('LOG_LEVEL') === 'debug'
            ? true
            : baseTypeOrmOptions.logging,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

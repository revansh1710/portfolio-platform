import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import * as joi from 'joi';
import {MongooseModule} from '@nestjs/mongoose';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: joi.object({
        NODE_ENV: joi.string()
          .valid('development', 'production', 'test')
          .required(),
        PORT: joi.number().default(3000),
        MONGODB_URI: joi.string().required(),
        JWT_SECRET: joi.string().min(32).required(),
        JWT_REFRESH_SECRET: joi.string().min(32).required(),
        REDIS_HOST: joi.string().required(),
        REDIS_PORT: joi.number().required(),
        RABBITMQ_URL: joi.string().required(),
      })
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        uri:configService.get<string>('MONGODB_URI')
      })
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

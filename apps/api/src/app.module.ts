import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { validateEnv } from './config/validate-env';
import { HealthModule } from './health/health.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['apps/api/.env', '.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    PostModule,
    UserModule,
    AiModule,
    CommonModule,
  ],
})
export class AppModule {}

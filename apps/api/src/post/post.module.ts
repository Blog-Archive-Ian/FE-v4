import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

import { PostController } from './post.controller';
import { PostMapper } from './post.mapper';
import { PostService } from './post.service';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [PostController],
  providers: [PostService, PostMapper],
})
export class PostModule {}

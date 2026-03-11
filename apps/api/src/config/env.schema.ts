import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, IsUrl, Matches, Min } from 'class-validator';

export class EnvSchema {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT!: number;

  @IsEnum(['development', 'production', 'test'])
  NODE_ENV!: 'development' | 'production' | 'test';

  @IsString()
  DB_IP!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  DB_PORT!: number;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_NAME!: string;

  @IsString()
  JWT_SECRET_KEY!: string;

  @IsUrl({ require_tld: false })
  FRONT_URL!: string;

  @Matches(/^(mysql|mariadb):\/\/.+/i, {
    message: 'DATABASE_URL must start with mysql:// (or mariadb://)',
  })
  DATABASE_URL!: string;
}

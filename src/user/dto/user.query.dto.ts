import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UserQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: Number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: Number;
}

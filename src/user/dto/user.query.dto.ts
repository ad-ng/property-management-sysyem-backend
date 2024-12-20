import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UserQueryDTO {
  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: Number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: Number;
}

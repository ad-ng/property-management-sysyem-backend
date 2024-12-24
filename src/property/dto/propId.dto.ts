import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PropIdDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: Number;
}

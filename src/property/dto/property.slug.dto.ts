import { IsNotEmpty, IsString } from 'class-validator';

export class PropSlugDTO {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

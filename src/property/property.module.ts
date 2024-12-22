import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PlaceModule } from 'src/place/place.module';

@Module({
  providers: [PropertyService],
  controllers: [PropertyController],
  imports: [PlaceModule]
})
export class PropertyModule {}

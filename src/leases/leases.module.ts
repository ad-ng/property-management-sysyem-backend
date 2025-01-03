import { Module } from '@nestjs/common';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';

@Module({
  controllers: [LeasesController],
  providers: [LeasesService],
})
export class LeasesModule {}

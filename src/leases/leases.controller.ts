import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeasesService } from './leases.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ROLE } from '@prisma/client';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PropIdDTO } from 'src/property/dto';

@UseGuards(AuthGuard('jwt'))
@Controller('leases')
export class LeasesController {
  constructor(private leaseService: LeasesService) {}

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('')
  addLease(@Body() dto: any, @Req() req: Request) {
    return this.leaseService.createLease(dto, req.user);
  }

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Put('/:id')
  leaseUpdating(
    @Body() dto: any,
    @Req() req: Request,
    @Param() param: PropIdDTO,
  ) {
    return this.leaseService.updateLease(param, dto, req.user);
  }

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Delete('/:id')
  leaseDelete(@Param() param: PropIdDTO, @Req() req: Request){
    return this.leaseService.deleteLaeses(param,req.user)
  }
}

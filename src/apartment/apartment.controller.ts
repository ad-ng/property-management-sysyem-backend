import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ROLE } from '@prisma/client';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('apartment')
export class ApartmentController {
    constructor( private apartmentService: ApartmentService){}

  @Roles(ROLE.admin,ROLE.manager,ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('')
  addApartment(@Body() dto: any){
    return this.apartmentService.saveApartment(dto)
  }
}



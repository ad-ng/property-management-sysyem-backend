import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ROLE } from '@prisma/client';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';
import { addApartmentDTO } from './dto';
import { PropIdDTO } from 'src/property/dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('apartment')
export class ApartmentController {
  constructor(private apartmentService: ApartmentService) {}

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('')
  addApartment(@Body() dto: addApartmentDTO, @Req() req: Request) {
    return this.apartmentService.saveApartment(dto, req.user);
  }

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/:id')
  getAptById(@Param() param: PropIdDTO, @Req() req: Request) {
    return this.apartmentService.getOneApt(param, req.user);
  }

  @Roles(ROLE.admin, ROLE.manager, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Put('/:id')
  updateApartment(
    @Body() dto: addApartmentDTO,
    @Param() param: PropIdDTO,
    @Req() req: Request,
  ) {
    return this.apartmentService.apartmentUpdate(dto, param, req.user);
  }
}

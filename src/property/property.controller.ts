import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ROLE } from '@prisma/client';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { UserQueryDTO } from 'src/user/dto/user.query.dto';
import { PropertyDTO } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Roles(ROLE.admin, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('add')
  createProperty(@Body() dto: PropertyDTO, @Req() req: Request) {
    return this.propertyService.createProperty(dto, req.user);
  }

  @Roles(ROLE.admin, ROLE.owner)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get()
  getAllProperties(@Query() query: UserQueryDTO, @Req() req: Request) {
    return this.propertyService.readProperties(query, req.user);
  }

  @Roles(ROLE.owner, ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/:slug')
  getOneProperty(@Req() req: Request, @Param() param: any) {
    return this.propertyService.readOne(param, req.user);
  }

  @Roles(ROLE.owner, ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('/manager')
  async addManager(@Body() dto: any, @Req() req: Request) {
    return this.propertyService.makeManager(dto, req.user);
  }
}

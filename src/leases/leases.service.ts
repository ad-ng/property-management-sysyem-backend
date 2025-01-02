import { faker, ne } from '@faker-js/faker/.';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeasesService {
  constructor(private prisma: PrismaService) {}

  async createLease(dto, user) {
    const checkApt = await this.prisma.apartment.findUnique({
      where: { id: dto.apartmentId },
      include: { property: true },
    });
    if (user.role == 'manager') {
      if (checkApt.property.managerEmail != user.email)
        throw ForbiddenException;
    }

    if (user.role == 'owner') {
      if (checkApt.property.ownerId != user.sub) throw ForbiddenException;
    }

    const checkTenant = await this.prisma.user.findUnique({
        where: { email: dto.tenantEmail }
    })

    if(!checkTenant) throw new NotFoundException('tenant not registered')

    if(!await this.prisma.apartment.findUnique({ where: { id: dto.apartmentId }})) throw new NotFoundException('apt not found')    


    try {
      const newLease = await this.prisma.leases.create({
        data: {
            lease_start_date: dto.lease_start_date,
            lease_status: dto.lease_status,
            monthly_rent: dto.monthly_rent,
            payment_due_day: dto.payment_due_day,
            apartmentId: dto.apartmentId,
            lease_end_date: dto.lease_end_date,
            security_deposit: dto.security_deposit,
            tenantEmail: dto.tenantEmail,
        }
      })

      delete newLease.createdAt;
      delete newLease.updatedAt;
      delete newLease.id;

      return {
        message: 'lease created successfully',
        data: newLease,
      };
    } catch (error) {
      return error;
    }
  }
}

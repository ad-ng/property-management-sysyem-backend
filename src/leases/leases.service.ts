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


    try {
      const newLease = await this.prisma.leases.create({
        data: {
          lease_start_date: Date.now().toString(),//dto.lease_start_date,
          lease_status: dto.lease_status,
          apartmentId: dto.apartmentId,
          tenantEmail: dto.tenantEmail,
          payment_due_day: dto.payment_due_day,
          security_deposit: Date.now().toString(),//dto.security_deposit,
          monthly_rent: dto.monthly_rent,
          lease_end_date: dto.lease_end_date,
        },
      });
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

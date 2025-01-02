import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeasesService {
  constructor(private prisma: PrismaService) {}

  async createLease(apartmentId, user) {
    const checkApt = await this.prisma.apartment.findUnique({
      where: { id: apartmentId },
      include: { property: true },
    });
    if (user.role == 'manager') {
      if (checkApt.property.managerEmail != user.email)
        throw ForbiddenException;
    }

    if (user.role == 'owner') {
      if (checkApt.property.ownerId != user.sub) throw ForbiddenException;
    }
  }
}

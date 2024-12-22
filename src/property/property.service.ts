import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async createProperty(dto, user) {
    const newProperty = await this.prisma.property.create({
      data: {
        title: dto.title,
        description: dto.description,
        ownerId: user.sub,
        locationId: 6,
      },
    });
  }
}

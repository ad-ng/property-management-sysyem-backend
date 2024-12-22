import { Injectable } from '@nestjs/common';
import { PlaceService } from 'src/place/place.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private placeService: PlaceService,
  ) {}

  async createProperty(dto, user) {
    const myPlace = await this.placeService.addPlace(dto);
    const newProperty = await this.prisma.property.create({
      data: {
        title: dto.title,
        description: dto.description,
        ownerId: user.sub,
        locationId:  myPlace.id,
        totalUnits: dto.totalUnits,
      },
    });
    delete newProperty.createdAt;
    delete newProperty.updatedAt;
    delete newProperty.id;

    return {
      message: 'property added successfully',
      data: newProperty
    };
  }
}

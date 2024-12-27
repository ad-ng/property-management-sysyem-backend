import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApartmentService {
  constructor(private prisma: PrismaService) {}

  async saveApartment(dto) {
    const mySlug = slugify(`${dto.apartmentName}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    const checkProperty = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });

    if (!checkProperty) throw new NotFoundException('property not found');

    try {
      const newApartment = await this.prisma.apartment.create({
        data: {
          propertyId: dto.propertyId,
          apartmentName: dto.apartmentName,
          floor_number: dto.floor_number,
          slug: mySlug,
          status: dto.status,
        },
      });
      return {
        message: 'apartment has been saved',
        date: newApartment,
      };
    } catch (error) {
      return error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PlaceService } from 'src/place/place.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private placeService: PlaceService,
  ) {}

  async createProperty(dto, user) {
    if (!dto.country) dto.country = 'rwanda'
    const myPlace = await this.placeService.addPlace(dto);
    const mySlug = slugify(`${dto.title}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true // trim leading and trailing replacement chars, defaults to `true`
    })
    const newProperty = await this.prisma.property.create({
      data: {
        title: dto.title,
        slug: mySlug,
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

  async readProperties(query, user){
    const  page  = query.page || 1
    const limit = query.limit || 5

    const allProperties = await this.prisma.property.findMany({
      orderBy: [{ id: 'desc' }],
      where: { ownerId: user.sub },
      take: limit,
      skip: (page -1)*limit
    })

    const totalProperties = await this.prisma.property.count()

    return {
      message: 'properties are found successfully',
      data: allProperties,
      currentPage: page,
      lastPage: Math.ceil(totalProperties / limit),
      total: totalProperties,
    }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
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
    if (!dto.country) dto.country = 'rwanda';
    const myPlace = await this.placeService.addPlace(dto);
    const mySlug = slugify(`${dto.title}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    const newProperty = await this.prisma.property.create({
      data: {
        title: dto.title,
        slug: mySlug,
        description: dto.description,
        ownerId: user.sub,
        locationId: myPlace.id,
        totalUnits: dto.totalUnits,
      },
    });
    delete newProperty.createdAt;
    delete newProperty.updatedAt;
    delete newProperty.id;

    return {
      message: 'property added successfully',
      data: newProperty,
    };
  }

  async readProperties(query, user) {
    const page = query.page || 1;
    const limit = query.limit || 5;

    const allProperties =
      user.role == 'owner'
        ? await this.prisma.property.findMany({
            orderBy: [{ id: 'desc' }],
            where: { ownerId: user.sub },
            take: limit,
            skip: (page - 1) * limit,
          })
        : await this.prisma.property.findMany({
            orderBy: [{ id: 'desc' }],
            take: limit,
            skip: (page - 1) * limit,
          });

    const totalProperties =
      user.role == 'owner'
        ? await this.prisma.property.count({ where: { ownerId: user.sub } })
        : await this.prisma.property.count();

    return {
      message: 'properties are found successfully',
      data: allProperties,
      currentPage: page,
      lastPage: Math.ceil(totalProperties / limit),
      total: totalProperties,
    };
  }

  async readOne(param, user) {
    const { slug } = param;
    const myProperty = await this.prisma.property.findFirst({
      where: { slug, ownerId: user.sub },
      include: {
        apartment: true,
      },
    });

    if (!myProperty) throw new NotFoundException('property not found');

    return {
      message: 'property found successfully',
      data: myProperty,
    };
  }

  async makeManager(dto, user) {
    const { managerEmail, id } = dto;
    const checkProperty = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!checkProperty) throw new NotFoundException('property not found');

    const checkManager = await this.prisma.user.findFirst({
      where: { email: managerEmail },
    });

    if (!checkManager) throw new NotFoundException('manager not registered');

    if (checkManager.role == 'owner' || checkManager.role == 'admin')
      throw new BadRequestException(
        `user with email: ${managerEmail} can not be manager`,
      );

    if (checkProperty.ownerId === user.sub) {
      const saveManager = await this.prisma.property.update({
        where: { id, ownerId: user.sub },
        data: {
          managerEmail,
        },
      });
      await this.prisma.user.update({
        where: { email: managerEmail },
        data: {
          role: 'manager',
        },
      });

      return {
        message: 'manager added successfully',
        data: saveManager,
      };
    }
  }

  async deleteManager(param, user) {
    const { id } = param;

    const myProperty = await this.prisma.property.findUnique({
      where: { id, ownerId: user.sub },
    });

    if (!myProperty) throw new NotFoundException('property not found');

    try {
      await this.prisma.property.update({
        where: { id },
        data: {
          managerEmail: null,
        },
      });

      return {
        message: 'manager deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }

  async updateProperty(param, dto, user) {
    const { id } = param;

    const checkProperty = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!checkProperty) throw new NotFoundException('no property found');

    if (checkProperty.ownerId != user.sub) throw ForbiddenException;

    if (!dto.country) dto.country = 'rwanda';

    const myPlace = await this.placeService.addPlace(dto);

    const mySlug = slugify(`${dto.title}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    const newProperty = await this.prisma.property.update({
      where: { id },
      data: {
        title: dto.title,
        slug: mySlug,
        description: dto.description,
        ownerId: user.sub,
        locationId: myPlace.id,
        totalUnits: dto.totalUnits,
      },
    });
    delete newProperty.createdAt;
    delete newProperty.updatedAt;
    delete newProperty.id;

    return {
      message: 'property updated successfully',
      data: newProperty,
    };
  }

  async deleteProperty(param, user) {
    const { id } = param;
    const checkProperty = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!checkProperty) throw new NotFoundException('property not found');

    if (checkProperty.ownerId != user.sub) throw ForbiddenException;

    try {
      await this.prisma.property.delete({
        where: { id },
      });
      return {
        message: 'property deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }

  async adminAddProperty(dto) {
    const checkOwner = await this.prisma.user.findUnique({
      where: { id: dto.ownerId },
    });

    if (!checkOwner) throw new NotFoundException('owner not registered');

    if (!dto.country) dto.country = 'rwanda';

    const myPlace = await this.placeService.addPlace(dto);
    const mySlug = slugify(`${dto.title}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    if (dto.managerEmail) {
      const checkManager = await this.prisma.user.findFirst({
        where: { email: dto.managerEmail },
      });

      if (!checkManager)
        throw new BadRequestException('manager not registered');
    }

    const newProperty = await this.prisma.property.create({
      data: {
        title: dto.title,
        slug: mySlug,
        managerEmail: dto.managerEmail,
        description: dto.description,
        ownerId: dto.ownerId,
        locationId: myPlace.id,
        totalUnits: dto.totalUnits,
      },
    });
    delete newProperty.createdAt;
    delete newProperty.updatedAt;
    delete newProperty.id;

    return {
      message: 'property added successfully',
      data: newProperty,
    };
  }

  async adminUpdateProp(dto, param) {
    const { email } = param;

    const owner = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!owner) throw new NotFoundException('user not found');

    if (owner.role == 'client') throw BadRequestException;

    const checkProperty = await this.prisma.property.findFirst({
      where: { ownerId: owner.id, title: dto.title },
    });

    if (!checkProperty) throw new NotFoundException('property not found');

    if (!dto.country) dto.country = 'rwanda';

    const myPlace = await this.placeService.addPlace(dto);

    const mySlug = slugify(`${dto.title}`, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: false, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: 'vi', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    if (!dto.newTitle) dto.newTitle = dto.title;

    if (dto.managerEmail) {
      const manager = await this.prisma.user.findUnique({
        where: { email: dto.managerEmail },
      });

      if (!manager)
        throw new BadRequestException(`${dto.managerEmail} not register`);

      if (manager.role == 'admin' || manager.role == 'owner')
        throw new ForbiddenException(
          `${dto.managerEmail} can not be a manager`,
        );

      await this.prisma.user.update({
        where: { email: dto.managerEmail },
        data: {
          role: 'manager',
        },
      });
    }

    var checkNewOwner: User;
    if (dto.owner) {
      checkNewOwner = await this.prisma.user.findUnique({
        where: { email: dto.owner },
      });

      if (!checkNewOwner)
        throw new BadRequestException(`${dto.owner} is not registered`);

      await this.prisma.user.update({
        where: { email: checkNewOwner.email },
        data: {
          role: 'owner',
        },
      });
    }

    if (!dto.owner) checkNewOwner = owner;

    try {
      const propUpdate = await this.prisma.property.update({
        where: { id: checkProperty.id },
        data: {
          title: dto.newTitle,
          slug: mySlug,
          description: dto.description,
          ownerId: checkNewOwner.id,
          managerEmail: dto.managerEmail,
          locationId: myPlace.id,
          totalUnits: dto.totalUnits,
        },
      });
      return {
        message: 'property updated successfully',
        data: propUpdate,
      };
    } catch (error) {
      return error;
    }
  }

  async adminDeleteProp(param, query) {
    const { email } = param;
    const { title } = query;

    const checkOwner = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!checkOwner || checkOwner.role == 'client')
      throw new BadRequestException();

    const checkProperty = await this.prisma.property.findFirst({
      where: { ownerId: checkOwner.id, title },
    });

    if (!checkProperty) throw new NotFoundException('property not found');

    try {
      await this.prisma.property.delete({
        where: { id: checkProperty.id },
      });

      return {
        message: 'property deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }
}

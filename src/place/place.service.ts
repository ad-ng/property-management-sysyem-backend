import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  async addPlace(dto) {
    let myLocation = await this.prisma.place.findFirst({
      where: {
        country: {
          name: dto.country,
        },
        province: {
          name: dto.province,
        },
        district: {
          name: dto.district,
        },
        sector: {
          name: dto.sector,
        },
        cell: {
          name: dto.cell,
        },
      },
      include: {
        country: true,
        province: true,
        district: true,
        sector: true,
        cell: true,
      },
    });

    if (!myLocation) {
      let myCountry = await this.prisma.country.findUnique({
        where: { name: dto.country },
      });
      if (!myCountry) {
        myCountry = await this.prisma.country.create({
          data: { name: dto.country },
        });
      }

      let myProv = await this.prisma.province.findUnique({
        where: { name: dto.province },
      });
      if (!myProv) {
        myProv = await this.prisma.province.create({
          data: {
            name: dto.province,
          },
        });
      }

      let myDistrict = await this.prisma.district.findUnique({
        where: { name: dto.district },
      });
      if (!myDistrict) {
        myDistrict = await this.prisma.district.create({
          data: { name: dto.district },
        });
      }

      let mySector = await this.prisma.sector.findUnique({
        where: { name: dto.sector },
      });
      if (!mySector) {
        mySector = await this.prisma.sector.create({
          data: { name: dto.sector },
        });
      }

      let myCell = await this.prisma.cell.findUnique({
        where: { name: dto.cell },
      });
      if (!myCell) {
        myCell = await this.prisma.cell.create({
          data: { name: dto.cell },
        });
      }

      return await this.prisma.place.create({
        data: {
          cellId: myCell.id,
          sectorId: mySector.id,
          districtId: myDistrict.id,
          provinceId: myProv.id,
          countryId: myCountry.id,
        },
      });
    }

    return myLocation;
  }
}

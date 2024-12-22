import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaceService {
    constructor( private prisma: PrismaService){}

    async addPlace(dto){
        const { province, district, sector, cell } = dto
        
        const  placeProv = await this.prisma.province.findUnique({
            where: { name: province}
        })
    }
}

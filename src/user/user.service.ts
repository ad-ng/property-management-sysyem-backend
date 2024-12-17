import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService){}
    async current(user){
        const currentUser = this.prisma.user.findUnique({
            where: { email: user.email}
        })
        return {
            message: "user found successfully",
            user: currentUser
        }
    }
}

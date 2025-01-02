import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { PropertyModule } from './property/property.module';
import { PlaceModule } from './place/place.module';
import { ApartmentModule } from './apartment/apartment.module';
import { LeasesModule } from './leases/leases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    VerificationModule,
    PropertyModule,
    PlaceModule,
    ApartmentModule,
    LeasesModule,
  ],
})
export class AppModule {}

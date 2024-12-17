import { SetMetadata } from "@nestjs/common";

const IsVerifiedCheck = 'IsVerfied'
export const IsVerified = (isVerified: boolean) => SetMetadata(IsVerifiedCheck, isVerified)
import { SetMetadata } from "@nestjs/common";

export const IsVerifiedKey = 'IsVerfied'
export const IsVerified = (isVerified: boolean) => SetMetadata(IsVerifiedKey, isVerified)
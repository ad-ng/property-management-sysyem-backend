import { SetMetadata } from '@nestjs/common';

export const IS_VERIFIED_KEY = 'isVerified'; // Unique metadata key

export const IsVerifiedCheck = (isVerified: boolean) => {
  return SetMetadata(IS_VERIFIED_KEY, isVerified);
};

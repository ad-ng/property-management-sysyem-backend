-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('owner', 'manager', 'client');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullname" TEXT,
    "username" TEXT NOT NULL,
    "gender" "GENDER",
    "dob" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "role" "ROLE" NOT NULL DEFAULT 'client',
    "isVerified" BOOLEAN,
    "profileImg" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

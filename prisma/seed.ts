import { PrismaClient } from "@prisma/client"
import { faker, ro } from '@faker-js/faker';

const prisma =  new PrismaClient
async function main() {
    console.log("################################# seeding ##############################")

    for(let i = 1; i < 11; i++){
        const gender = i % 2 == 0 ? 'male' : 'female'
        const role = i % 2 == 0 ? 'client' : 'owner'
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: 'test@123',
                fullname: faker.person.fullName(),
                username: faker.internet.username(),
                gender: gender,
                dob: faker.date.birthdate(),
                phoneNumber: faker.phone.number(),
                role: role,
                isVerified: faker.datatype.boolean(),
                verificationCode: faker.commerce.isbn()
            }
        })
    }
    console.log('person seeds completed')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
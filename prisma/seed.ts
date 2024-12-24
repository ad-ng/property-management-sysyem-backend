import { PrismaClient } from "@prisma/client"
import { faker, tr } from '@faker-js/faker';
import * as argon from 'argon2'

const prisma =  new PrismaClient
async function main() {
    console.log("################################# seeding ##############################")

    for(let i = 1; i < 11; i++){
        const gender = i % 2 == 0 ? 'male' : 'female'
        const role = i % 2 == 0 ? 'client' : 'owner'
        const hashedPassword = await argon.hash('test@123')
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: hashedPassword,
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

    for(let i=1; i < 11; i++){
      await prisma.place.create({
        data: {
          country: {
            create: {
              name: 'rwanda'
            }
          },
          province: {
            create: {
              name: faker.location.city()
            }
          },
          district: {
            create: {
              name: faker.location.state()
            }
          },
          sector: {
            create: {
              name: faker.location.street()
            }
          },
          cell: {
            create: {
              name: faker.location.secondaryAddress()
            }
          },
        },
        include: {
          country: true,
          province: true,
          district: true,
          sector: true,
          cell: true
        }
      })
    }
    console.log('location seeds completed');
    
   
    for(let i =1; i < 21; i++) {
      await prisma.property.create({
        data: {
          title: faker.company.name(),
          slug: faker.helpers.slugify(faker.book.title()),
          description: faker.lorem.paragraph(),
          locationId: faker.number.int({ min: 1, max: 10 }),
          ownerId: faker.number.int({ min: 1, max: 10 }),
          totalUnits: faker.number.int({ min: 1, max: 30 })
        }
      })
    }
    console.log('property seeds completed');
    
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
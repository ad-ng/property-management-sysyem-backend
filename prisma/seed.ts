import { PrismaClient } from "@prisma/client"
import { faker, tr } from '@faker-js/faker';
import * as argon from 'argon2'
import { PlaceService } from "src/place/place.service";

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
    console.log("################################# seeding ##############################")

    for (let i = 1; i < 11; i++){
      await prisma.place.create({
        data: {
          province: {
            create: {
              name: `${faker.location.city()}${i}`
            }
          },
          district: {
            create: {
              name: `${faker.location.state}${i}`
            }
          },
          sector: {
            create: {
              name: `${faker.location.street()}${i}`
            }
          },
          cell: {
            create: {
              name: `${faker.location.streetAddress()}${i}`
            }
          }
        }, include: {
          province: true,
          district: true,
          sector: true,
          cell: true
        }
      })
    }

     console.log('location seeds completed')
    console.log("################################# seeding ##############################")

    for(let i = 1; i < 21; i++){
      await prisma.property.create({
        data: {
          title: faker.book.title(),
          slug: faker.helpers.slugify(faker.book.series()),
          ownerId: faker.number.int( { min: 1, max: 10 }),
          locationId: faker.number.int( { min: 1, max: 10 }),
          description: faker.lorem.paragraph(),
          totalUnits: faker.number.int( { min: 1, max: 30 }),
        }
      })
    }

     console.log('property seeds completed')
    console.log("################################# seeding ##############################")

    for(let i = 1; i < 31; i++){
      const aptStatus = (i % 2 == 0 ) ? 'occupied' : 'vacant'
      await prisma.apartment.create({
        data: {
          apartmentName: faker.book.title(),
          slug: faker.helpers.slugify(faker.book.series()),
          floor_number: faker.number.int( { min: 1, max: 15 }),
          status: aptStatus,
          propertyId: faker.number.int( { min: 1, max: 9 })
        }
      })
    }
    console.log('apartment seeds completed')
    console.log("################################# seeding ##############################")
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
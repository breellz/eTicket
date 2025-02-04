
import { ObjectType } from 'typeorm';
import datasource from "../../database/postgres";
import { User } from "../../entities/user.entity";


const userData = [
  {
    username: 'John',
    passsword: '1234',
  },
  {
    username: 'Johndoe',
    passsword: '1234',
  }, {
    username: 'Johnray',
    passsword: '1234',
  },]




export const setUpDb = async () => {
  await datasource.initialize();

  const userRepository = datasource.getRepository(User);
  const users = userRepository.create(userData);
  await userRepository.save(users);

  console.log("DB populated successfully")
}



export const clearDatabase = async () => {
  const entityMetadatas = datasource.entityMetadatas;
  const orderOfDeletion = ['WaitList', 'Booking', 'Event', 'User'];
  for (const entityName of orderOfDeletion) {
    const metadata = entityMetadatas.find(metadata => metadata.name === entityName);
    if (metadata) {
      const repository = datasource.getRepository(metadata.target as ObjectType<any>);
      await repository.delete({});
    }
  }
};

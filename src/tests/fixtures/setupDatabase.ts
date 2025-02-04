
import Postgres from "../../database/postgres";
import { User } from "../../entities/user.entity";
import { DataSource, ObjectType } from 'typeorm';


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
  await Postgres.connect();
  const datasource = Postgres.datasource;

  const userRepository = datasource.getRepository(User);
  const users = userRepository.create(userData);
  await userRepository.save(users);

  console.log("DB populated successfully")
}



export const clearDatabase = async () => {
  const entityMetadatas = Postgres.datasource.entityMetadatas;
  const orderOfDeletion = ['WaitList', 'Booking', 'Event', 'User'];
  for (const entityName of orderOfDeletion) {
    const metadata = entityMetadatas.find(metadata => metadata.name === entityName);
    if (metadata) {
      const repository = Postgres.datasource.getRepository(metadata.target as ObjectType<any>);
      await repository.delete({});
    }
  }
};

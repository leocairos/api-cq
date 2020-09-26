import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

interface IListReturn {
  users: User[];
  count: number;
}

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async list(skip: number, take: number): Promise<IListReturn> {
    const count = await this.ormRepository.count();

    const users = await this.ormRepository.find({
      select: ['id', 'name', 'email', 'role'],
      order: {
        id: 'ASC',
      },
      skip,
      take,
      cache: false,
    });
    return { users, count };
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });
    return findUser;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { document },
    });
    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;

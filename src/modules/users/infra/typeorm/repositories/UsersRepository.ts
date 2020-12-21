import { getRepository, Repository } from 'typeorm';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

interface IListReturn {
  users: User[];
  total: number;
}

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async list(page: number, pageSize: number): Promise<IListReturn> {
    const total = await this.ormRepository.count();

    const users = await this.ormRepository.find({
      // select: ['id', 'name', 'email', 'role', 'avatar_url'],
      order: { id: 'ASC' },
      take: Number(pageSize),
      skip: Number(pageSize) * (Number(page) - 1),
    });
    return { users: classToClass(users), total };
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

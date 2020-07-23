import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IResponse {
  users: User[];
  count: number;
}

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(skip: number, take: number): Promise<IResponse> {
    const { users, count } = await this.usersRepository.list(
      skip,
      take > 50 ? 50 : take,
    );

    return { users, count };
  }
}

export default ListUserService;

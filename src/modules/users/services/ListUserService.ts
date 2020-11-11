import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IResponse {
  users: User[];
  total: number;
  pageSizeV: number;
}

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(page: number, pageSize: number): Promise<IResponse> {
    const { users, total } = await this.usersRepository.list(
      page,
      pageSize > 50 ? 50 : pageSize,
    );

    return { users, total, pageSizeV: pageSize };
  }
}

export default ListUserService;

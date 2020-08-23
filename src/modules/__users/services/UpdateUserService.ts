import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, name, email, role }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.');
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const roles = ['admin', 'member'];
    if (role && roles.indexOf(role) >= 0) {
      user.role = role;
    }

    return this.usersRepository.save(user);
  }
}
export default UpdateUserService;

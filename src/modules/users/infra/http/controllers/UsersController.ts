import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUserService from '@modules/users/services/ListUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, role } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({   name,
      email,
      password,
      role,
    });

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { skip = 0, take = 20 } = request.query;

    const listUsers = container.resolve(ListUserService);
    const { users, count } = await listUsers.execute(
      skip as number,
      take as number,
    );

    response.header('x-total-count', count.toString());
    response.header('Access-Control-Expose-Headers', 'x-total-count');

    return response.json(users);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, email, role } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      id,
      name,
      email,
      role,
    });

    return response.json(user);
  }
}

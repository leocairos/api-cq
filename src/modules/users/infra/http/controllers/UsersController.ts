import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUserService from '@modules/users/services/ListUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import logger from '@config/logger';
import { remoteIp } from '@shared/services/util';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, role } = request.body;

    // console.log(request.body);
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      role,
    });

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    logger.info(`GET users (from ${remoteIp(request)})...`);
    const { page = 1, pageSize = 10 } = request.query;

    const listUsers = container.resolve(ListUserService);

    const { users, total, pageSizeV } = await listUsers.execute(
      Number(page),
      Number(pageSize),
    );

    return response.json({
      total,
      page: Number(page),
      pageSize: Number(pageSizeV),
      users,
    });
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

    return response.json(classToClass(user));
  }
}

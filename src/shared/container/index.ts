import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import ISamplesRepository from '@modules/samples/repositories/ISamplesRepository';
import SamplesRepository from '@modules/samples/infra/typeorm/repositories/SamplesRepository';

import IAuxiliariesRepository from '@modules/samples/repositories/IAuxiliariesRepository';
import AuxiliariesRepository from '@modules/samples/infra/typeorm/repositories/AuxiliariesRepository';

import ISampleInfosRepository from '@modules/samples/repositories/ISampleInfosRepository';
import SampleInfosRepository from '@modules/samples/infra/typeorm/repositories/SampleInfosRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ISamplesRepository>(
  'SamplesRepository',
  SamplesRepository,
);

container.registerSingleton<IAuxiliariesRepository>(
  'AuxiliariesRepository',
  AuxiliariesRepository,
);

container.registerSingleton<ISampleInfosRepository>(
  'SampleInfosRepository',
  SampleInfosRepository,
);

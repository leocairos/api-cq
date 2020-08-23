import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IAuxiliariesRepository from '../repositories/IAuxiliariesRepository';

import ServiceCenter from '../infra/typeorm/entities/ServiceCenter';
import SampleConclusion from '../infra/typeorm/entities/SampleConclusion';
import SampleReason from '../infra/typeorm/entities/SampleReason';
import SampleStatus from '../infra/typeorm/entities/SampleStatus';
import SampleType from '../infra/typeorm/entities/SampleType';
import MyLIMSUser from '../infra/typeorm/entities/MyLIMSUser';
import CollectionPoint from '../infra/typeorm/entities/CollectionPoint';
import Info from '../infra/typeorm/entities/Info';
import ServiceArea from '../infra/typeorm/entities/ServiceArea';
import MethodType from '../infra/typeorm/entities/MethodType';
import MethodStatus from '../infra/typeorm/entities/MethodStatus';
import Method from '../infra/typeorm/entities/Method';
import AnalysisGroup from '../infra/typeorm/entities/AnalysisGroup';
import { IServiceCenterDTO, IMethodTypeDTO } from '../dtos/IAuxiliariesDTO';

interface IRequest {
  id: number;
  identification: string;
  serviceCenter?: IServiceCenterDTO;
  methodType?: IMethodTypeDTO;
}

@injectable()
class UpdateAuxiliariesService {
  constructor(
    @inject('AuxiliariesRepository')
    private auxiliariesRepository: IAuxiliariesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async executeServiceCenter({
    id,
    identification,
  }: IRequest): Promise<ServiceCenter> {
    const auxiliar = await this.auxiliariesRepository.saveServiceCenter({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeSampleConclusion({
    id,
    identification,
  }: IRequest): Promise<SampleConclusion> {
    const auxiliar = await this.auxiliariesRepository.saveSampleConclusion({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeSampleReason({
    id,
    identification,
  }: IRequest): Promise<SampleReason> {
    const auxiliar = await this.auxiliariesRepository.saveSampleReason({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeSampleStatus({
    id,
    identification,
  }: IRequest): Promise<SampleStatus> {
    const auxiliar = await this.auxiliariesRepository.saveSampleStatus({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeSampleType({
    id,
    identification,
  }: IRequest): Promise<SampleType> {
    const auxiliar = await this.auxiliariesRepository.saveSampleType({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeMyLIMSUser({
    id,
    identification,
  }: IRequest): Promise<MyLIMSUser> {
    const auxiliar = await this.auxiliariesRepository.saveMyLIMSUser({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeCollectionPoint({
    id,
    identification,
  }: IRequest): Promise<CollectionPoint> {
    const auxiliar = await this.auxiliariesRepository.saveCollectionPoint({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeInfo({ id, identification }: IRequest): Promise<Info> {
    const auxiliar = await this.auxiliariesRepository.saveInfo({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeServiceArea({
    id,
    identification,
    serviceCenter,
  }: IRequest): Promise<ServiceArea> {
    const auxiliar = await this.auxiliariesRepository.saveServiceArea({
      id,
      identification,
      serviceCenter,
    });

    return auxiliar;
  }

  public async executeMethodType({
    id,
    identification,
  }: IRequest): Promise<MethodType> {
    const auxiliar = await this.auxiliariesRepository.saveMethodType({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeMethodStatus({
    id,
    identification,
  }: IRequest): Promise<MethodStatus> {
    const auxiliar = await this.auxiliariesRepository.saveMethodStatus({
      id,
      identification,
    });

    return auxiliar;
  }

  public async executeMethod({
    id,
    identification,
    methodType,
  }: IRequest): Promise<Method> {
    const auxiliar = await this.auxiliariesRepository.saveMethod({
      id,
      identification,
      methodType,
    });

    return auxiliar;
  }

  public async executeAnalysisGroup({
    id,
    identification,
  }: IRequest): Promise<AnalysisGroup> {
    const auxiliar = await this.auxiliariesRepository.saveAnalysisGroup({
      id,
      identification,
    });

    return auxiliar;
  }
}

export default UpdateAuxiliariesService;

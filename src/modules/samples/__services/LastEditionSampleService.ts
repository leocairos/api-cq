import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISamplesRepository from '../repositories/ISamplesRepository';

@injectable()
class LastEditionSampleService {
  constructor(
    @inject('SamplesRepository')
    private samplesRepository: ISamplesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<Date> {
    const lastEdition = await this.samplesRepository.findLastEdition();

    return lastEdition;
  }
}

export default LastEditionSampleService;

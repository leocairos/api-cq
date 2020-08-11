/* eslint-disable no-await-in-loop */
import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleService from '@modules/samples/services/CreateSampleService';

import logger from '@config/logger';
import LastEditionSampleService from '@modules/samples/services/LastEditionSampleService';
import sampleInfos from './SampleInfosController';
import sampleMethods from './SampleMethodsController';
import sampleAnalyses from './SampleAnalysesController';

import { ISample } from '../../dtos/ISampleMYLIMSDTO';

export default class Samples {
  public async list(
    skip: number,
    top: number,
    filter: string,
  ): Promise<number> {
    logger.info(
      `starting synchronization with myLIMs (records at time: ${process.env.COUNT_SINC_AT_TIME})`,
    );

    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    const samplesData = samples.data.Result as ISample[];

    const createSample = container.resolve(CreateSampleService);

    const samplesPromises: number[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const sample of samplesData) {
      const sampleSaved = await createSample.execute({
        id: sample.Id,
        identification: sample.Identification,
        controlNumber: sample.ControlNumber,
        number: sample.Number,
        year: sample.Year,
        subNumber: sample.SubNumber,
        revision: sample.Revision,
        active: sample.Active,
        syncPortal: sample.SyncPortal,
        received: sample.Received,
        finalized: sample.Finalized,
        published: sample.Published,
        reviewed: sample.Reviewed,
        takenDateTime: sample.TakenDateTime,
        receivedTime: sample.ReceivedTime,
        finalizedTime: sample.FinalizedTime,
        publishedTime: sample.PublishedTime,
        reviewedTime: sample.ReviewedTime,

        sampleStatus: {
          id: sample.CurrentStatus?.SampleStatus?.Id,
          identification: sample.CurrentStatus?.SampleStatus?.Identification,
        },
        currentStatusUser: {
          id: sample.CurrentStatus?.EditionUser?.Id,
          identification: sample.CurrentStatus?.EditionUser?.Identification,
        },
        currentStatusEditionDateTime: sample.CurrentStatus?.EditionDateTime,

        sampleServiceCenter: {
          id: sample.ServiceCenter?.Id,
          identification: sample.ServiceCenter?.Identification,
        },

        sampleConclusion: {
          id: sample.SampleConclusion?.Id,
          identification: sample.SampleConclusion?.Identification,
        },

        sampleReason: {
          id: sample.SampleReason?.Id,
          identification: sample.SampleReason?.Identification,
        },

        sampleType: {
          id: sample.SampleType?.Id,
          identification: sample.SampleType?.Identification,
        },

        sampleCollectionPoint: {
          id: sample.CollectionPoint?.Id,
          identification: sample.CollectionPoint?.Identification,
        },
      });

      const countInfo = await sampleInfos(sampleSaved.id);
      const countMethod = await sampleMethods(sampleSaved.id);
      const countAnalyses = await sampleAnalyses(sampleSaved.id);

      logger.info(
        `sampleSaved: ${sampleSaved.id} with ${countInfo.length} Infos, ${countMethod.length} Methods and ${countAnalyses.length} Analyses.`,
      );

      samplesPromises.push(sampleSaved.id);
    }

    logger.info(`Total Samples found:  ${samplesData.length}`);
    const samplesCQ = await Promise.all(samplesPromises);
    logger.info('end of synchronization with myLIMs');

    return samplesCQ.length;
  }

  public async getLastEditionStored(): Promise<Date> {
    logger.info(`getting last edition date stored`);
    const lastEditionService = container.resolve(LastEditionSampleService);

    const lastEditionDate = await lastEditionService.execute();

    return lastEditionDate;
  }
}

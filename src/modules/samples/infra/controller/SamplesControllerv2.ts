import apiMYLIMS from '@shared/services/apiMYLIMS';

import logger from '@config/logger';
// import LastEditionSampleService from '@modules/samples/services/LastEditionSampleService';
import { getRepository, createConnection } from 'typeorm';
import sampleInfosv2 from './SampleInfosControllerv2';
import sampleMethodsv2 from './SampleMethodsControllerv2';
import sampleAnalysesv2 from './SampleAnalysesControllerv2';

import { ISample } from '../../dtos/ISampleMYLIMSDTO';
import Sample from '../typeorm/entities/Sample';

export default class Samples {
  public async update(
    skip: number,
    top: number,
    filter: string,
  ): Promise<number> {
    logger.info(
      `starting synchronization with myLIMs (records at time: ${process.env.COUNT_SINC_AT_TIME})`,
    );
    try {
      await createConnection();
    } catch {
      //
    }
    const ormRepository = getRepository(Sample);
    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=CurrentStatus/EditionDateTime`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    const samplesData = samples.data.Result as ISample[];

    logger.info(`Total Samples found:  ${samplesData.length}`);

    const samplesToSave = samplesData.map(sample => {
      const sampleCreated = ormRepository.create({
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

        sampleStatus: sample.CurrentStatus?.SampleStatus?.Id
          ? {
              id: sample.CurrentStatus?.SampleStatus?.Id,
              identification:
                sample.CurrentStatus?.SampleStatus?.Identification,
            }
          : undefined,
        currentStatusUser: sample.CurrentStatus?.EditionUser?.Id
          ? {
              id: sample.CurrentStatus?.EditionUser?.Id,
              identification: sample.CurrentStatus?.EditionUser?.Identification,
            }
          : undefined,
        currentStatusEditionDateTime: sample.CurrentStatus?.EditionDateTime,

        sampleServiceCenter: sample.ServiceCenter?.Id
          ? {
              id: sample.ServiceCenter?.Id,
              identification: sample.ServiceCenter?.Identification,
            }
          : undefined,

        sampleConclusion: sample.SampleConclusion?.Id
          ? {
              id: sample.SampleConclusion?.Id,
              identification: sample.SampleConclusion?.Identification,
            }
          : undefined,

        sampleReason: sample.SampleReason?.Id
          ? {
              id: sample.SampleReason?.Id,
              identification: sample.SampleReason?.Identification,
            }
          : undefined,

        sampleType: sample.SampleType?.Id
          ? {
              id: sample.SampleType?.Id,
              identification: sample.SampleType?.Identification,
            }
          : undefined,

        sampleCollectionPoint: sample.CollectionPoint?.Id
          ? {
              id: sample.CollectionPoint?.Id,
              identification: sample.CollectionPoint?.Identification,
            }
          : undefined,
      });
      return sampleCreated;
    });

    const toSave = await Promise.all(samplesToSave);
    logger.info(`Total Samples avaliable to save: ${toSave.length}`);

    const samplesSaved = await ormRepository.save(toSave);

    logger.info(`samples Saved: ${samplesSaved.length} `);
    const samplesDataSaved = samplesSaved.map(async sample => {
      logger.info(
        `Sample: ${sample.id} last edition in ${sample.currentStatusEditionDateTime}`,
      );

      const sampleInfoSaved = await sampleInfosv2(sample.id);
      const sampleMethodSaved = await sampleMethodsv2(sample.id);
      const sampleAnalysesSaved = await sampleAnalysesv2(sample.id);

      return {
        infosCount: sampleInfoSaved,
        methodsCount: sampleMethodSaved,
        analysesCount: sampleAnalysesSaved,
      };
    });

    logger.info(`Getting samples details (infos, methods and amalysis)... `);
    const countData = await Promise.all(samplesDataSaved);

    const totalInfo = countData.reduce((ac, info) => {
      return ac + info.infosCount;
    }, 0);
    logger.info(`Total SamplesInfos saved: ${totalInfo}`);

    const totalMethods = countData.reduce((ac, method) => {
      return ac + method.methodsCount;
    }, 0);
    logger.info(`Total SamplesMethods saved: ${totalMethods}`);

    const totalAnalyses = countData.reduce((ac, method) => {
      return ac + method.analysesCount;
    }, 0);
    logger.info(`Total SamplesAnalyses saved: ${totalAnalyses}`);

    logger.info(
      `End step (${skip + 1} to ${skip + top}) of synchronization with myLIMs`,
    );

    return samplesSaved.length;
  }

  public async getLastEditionStored(): Promise<Date> {
    logger.info(`getting last edition date stored`);
    try {
      await createConnection();
    } catch {
      //
    }
    const ormRepository = getRepository(Sample);

    const findLastDate = await ormRepository.findOne({
      order: { currentStatusEditionDateTime: 'DESC' },
    });
    return findLastDate
      ? findLastDate.currentStatusEditionDateTime
      : new Date();
  }
}

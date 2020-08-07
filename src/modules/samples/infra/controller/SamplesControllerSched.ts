import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleService from '@modules/samples/services/CreateSampleService';

import sampleInfos from './SampleInfosController';
import sampleMethods from './SampleMethodsController';
import sampleAnalyses from './SampleAnalysesController';

import { ISample } from '../../dtos/ISampleMYLIMSDTO';

import updAuxiliaries from './AuxiliariesController';

interface ISampleSummary {
  idSample: number;
  countInfo: number;
  countMethod: number;
  countAnalyses: number;
}

export default class Samples {
  public async list(
    skip: number,
    top: number,
    filter: string,
  ): Promise<number> {
    console.log(new Date(), 'starting synchronization with myLIMs');

    await updAuxiliaries();

    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    const samplesData = samples.data.Result as ISample[];
    const sampleSummary: ISampleSummary[] = [];
    const createSample = container.resolve(CreateSampleService);

    const samplesPromises = samplesData.map(async sample => {
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

      // console.log('sampleSaved:', sampleSaved.id);
      console.log('   ', '|- ', 'savedSample:', sampleSaved.id);
      const infoInSample = await sampleInfos(sampleSaved.id);
      /* console.log(
        '     ',
        '|- ',
        'savedInfos:',
        infoInSample.length,
        'bySample:',
        sampleSaved.id,
      ); */
      const methodInSample = await sampleMethods(sampleSaved.id);
      /* console.log(
        '     ',
        '|- ',
        'savedMethods:',
        methodInSample.length,
        'bySample:',
        sampleSaved.id,
      ); */
      const analysesInSample = await sampleAnalyses(sampleSaved.id);
      /* console.log(
        '     ',
        '|- ',
        'savedAnalyses:',
        analysesInSample.length,
        'bySample:',
        sampleSaved.id,
      ); */

      const sumaryAux = {
        idSample: sampleSaved.id,
        countInfo: infoInSample.length,
        countMethod: methodInSample.length,
        countAnalyses: analysesInSample.length,
      };
      sampleSummary.push(sumaryAux);
      console.log('   ', '|- ', sumaryAux);
      return sampleSaved;
    });

    console.log('  ', '>> Total Samples find: ', samplesData.length);
    const samplesCQ = await Promise.all(samplesPromises);
    console.log(new Date(), 'end of synchronization with myLIMs');

    return samplesCQ.length;
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleService from '@modules/samples/services/CreateSampleService';

import sampleInfos from './SampleInfosController';
import sampleMethods from './SampleMethodsController';
import sampleAnalyses from './SampleAnalysesController';

import { ISample } from '../../dtos/ISampleMYLIMSDTO';

import updAuxiliaries from './AuxiliariesController';

export default class Samples {
  public async list(request: Request, response: Response): Promise<Response> {
    const { skip = 0, top = 50, filter = '' } = request.query;

    await updAuxiliaries();

    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    const samplesData = samples.data.Result as ISample[];
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

      console.log('sampleSaved:', sampleSaved.id);
      await sampleInfos(sampleSaved.id);
      await sampleMethods(sampleSaved.id);
      await sampleAnalyses(sampleSaved.id);
      return sampleSaved;
    });

    const samplesCQ = await Promise.all(samplesPromises);
    return response.status(200).json({ samplesSaved: samplesCQ.length });
  }
}

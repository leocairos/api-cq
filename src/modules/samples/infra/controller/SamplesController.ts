import { Request, Response } from 'express';
import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleService from '@modules/samples/services/CreateSampleService';

import sampleInfos from './SampleInfosController';
import sampleMethods from './SampleMethodsController';

import { ISample } from '../../dtos/ISampleMYLIMSDTO';

import updAuxiliaries from './AuxiliariesController';

/*
const getAnalyses = async (sampleId: number): Promise<IAnalysesCQ[]> => {
  const analyses = await apiMYLIMS.get(`/samples/${sampleId}/analyses`);

  const analysesSample = analyses.data.Result as IAnalysesMyLIMS[];

  const analysesData = analysesSample.map(analyse => {
    return {
      Id: analyse.Id,
      Method: analyse.Method?.Id,
      AnalysisGroup: analyse.AnalysisGroup?.Identification,
      Info: analyse.Info.Identification,
      MeasurementUnit: analyse.MeasurementUnit?.Identification,
      Conclusion: analyse.Conclusion?.Identification,
      MethodAnalysisType: analyse.MethodAnalysisType.Identification,
      DisplayValue: analyse.DisplayValue,
      ForceScale: analyse.ForceScale,
      ValueFloat: analyse.ValueFloat,
      Order: analyse.Order,
      K: analyse.K,
      Veff: analyse.Veff,
    };
  });

  return analysesData;
};
*/

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

      // console.log(sampleSaved);
      await sampleInfos(sampleSaved.id);
      await sampleMethods(sampleSaved.id);
      return sampleSaved;
    });

    const samplesCQ = await Promise.all(samplesPromises);
    return response.status(200).json(samplesCQ);
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import CreateSampleService from '@modules/samples/services/CreateSampleService';

import sampleInfos from './SampleInfosController';

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

const getMethods = async (sampleId: number): Promise<IMethodCQ[]> => {
  const methods = await apiMYLIMS.get(`/samples/${sampleId}/methods`);

  const methodsSample = methods.data.Result as IMethodMyLIMS[];

  const methodsData = methodsSample.map(method => {
    return {
      Id: method.Id,
      MethodId: method.Method.Id,
      MethodType: method.Method.MethodType.Identification,
      MethodIdentification: method.Method.Identification,
      ServiceArea: method.ServiceArea.Identification,
      CurrentMethodStatus: method.CurrentStatus.MethodStatus.Identification,
      CurrentEditionUser: method.CurrentStatus.EditionUser.Identification,
      CurrentEditionDateTime: method.CurrentStatus.EditionDateTime,
      CurrentExecuteUser: method.CurrentStatus.ExecuteUser?.Identification,
      CurrentExecuteDateTime: method.CurrentStatus.ExecuteDateTime,
      CurrentStartUser: method.CurrentStatus.StartUser?.Identification,
      CurrentStartDateTime: method.CurrentStatus.StartDateTime,
    };
  });

  return methodsData;
};

const getInfos = async (sampleId: number): Promise<IInfosCQ[]> => {
  const infos = await apiMYLIMS.get(`/samples/${sampleId}/infos`);

  const infosSample = infos.data.Result as IInfosMyLIS[];

  const infosData = infosSample.map(info => {
    return {
      SampleId: sampleId,
      Id: info.Id,
      Order: info.Order,
      Info: info.Info.Identification,
      Value: info.DisplayValue,
    };
  });

  return infosData;
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
      return sampleSaved;
    });

    const samplesCQ = await Promise.all(samplesPromises);
    return response.status(200).json(samplesCQ);
    /* return {

        CurrentStatus: {
          Id: sample.CurrentStatus?.Id,
          SampleStatus: {
            Id: sample.CurrentStatus?.SampleStatus?.Id,
            Identification: sample.CurrentStatus?.SampleStatus?.Identification,
          },
          EditionUser: {
            Id: sample.CurrentStatus?.EditionUser?.Id,
            Identification: sample.CurrentStatus?.EditionUser?.Identification.trim(),
          },
          EditionDate: sample.CurrentStatus?.EditionDateTime,
        },
        Infos: [],
        Methods: [],
        Analyses: [],
      }; */

    /* for (let s = 0; s < samplesCQ.length; s += 1) {
      const infos = await getInfos(samplesCQ[s].Id);
      samplesCQ[s].Infos = infos;

      const analyses = await getAnalyses(samplesCQ[s].Id);
      samplesCQ[s].Analyses = analyses;

      const methods = await getMethods(samplesCQ[s].Id);
      samplesCQ[s].Methods = methods;
    } */
  }
}

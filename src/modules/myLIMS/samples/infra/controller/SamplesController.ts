import { Request, Response } from 'express';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import { ISample } from '../../ISampleDTO';

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

export default class Samples {
  public async list(request: Request, response: Response): Promise<Response> {
    const { skip = 0, top = 50, filter = '' } = request.query;

    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    const samplesData = samples.data.Result as ISample[];

    const samplesCQ = samplesData.map(sample => {
      return {
        Id: sample.Id,
        Identification: sample.Identification,
        ControlNumber: sample.ControlNumber,
        Number: sample.Number,
        Year: sample.Year,
        SubNumber: sample.SubNumber,
        Revision: sample.Revision,
        Active: sample.Active,
        SyncPortal: sample.SyncPortal,
        Received: sample.Received,
        Finalized: sample.Finalized,
        Published: sample.Published,
        Reviewed: sample.Reviewed,
        TakenDateTime: sample.TakenDateTime,
        ReceivedTime: sample.ReceivedTime,
        FinalizedTime: sample.FinalizedTime,
        PublishedTime: sample.PublishedTime,
        ReviewedTime: sample.ReviewedTime,
        ServiceCenter: {
          Id: sample.ServiceCenter?.Id,
          Identification: sample.ServiceCenter?.Identification,
        },
        SampleConclusion: {
          Id: sample.SampleConclusion?.Id,
          Identification: sample.SampleConclusion?.Identification,
        },
        SampleReason: {
          Id: sample.SampleReason?.Id,
          Identification: sample.SampleReason?.Identification,
        },
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
        SampleType: {
          Id: sample.SampleType?.Id,
          Identification: sample.SampleType?.Identification,
        },
        CollectionPoint: {
          Id: sample.CollectionPoint?.Id,
          Identification: sample.CollectionPoint?.Identification,
        },
        /* Infos: [],
        Methods: [],
        Analyses: [], */
      };
    });

    /* for (let s = 0; s < samplesCQ.length; s += 1) {
      const infos = await getInfos(samplesCQ[s].Id);
      samplesCQ[s].Infos = infos;

      const analyses = await getAnalyses(samplesCQ[s].Id);
      samplesCQ[s].Analyses = analyses;

      const methods = await getMethods(samplesCQ[s].Id);
      samplesCQ[s].Methods = methods;
    } */

    return response.status(200).json(samplesCQ);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const sampleResponse = await apiMYLIMS.get(`/samples/${id}`);

    const sample = sampleResponse.data as ISample;

    const samplesCQ = {
      Id: sample.Id,
      Identificatio: sample.Identification,
      ControlNumber: sample.ControlNumber,
      Number: sample.Number,
      Year: sample.Year,
      SubNumber: sample.SubNumber,
      Revision: sample.Revision,
      Active: sample.Active,
      Received: sample.Received,
      Finalized: sample.Finalized,
      Published: sample.Published,
      Reviewed: sample.Reviewed,
      TakenDateTime: sample.TakenDateTime,
      ReceivedTime: sample.ReceivedTime,
      FinalizedTime: sample.FinalizedTime,
      PublishedTime: sample.PublishedTime,
      ReviewedTime: sample.ReviewedTime,
      ServiceCenter: sample.ServiceCenter.Identification,
      SampleConclusion:
        sample.SampleConclusion && sample.SampleConclusion.Identification,
      SampleReason: sample.SampleReason.Identification,
      CurrentSampleStatus: sample.CurrentStatus.SampleStatus.Identification,
      CurrentSampleEditionUser: sample.CurrentStatus.EditionUser.Identification,
      CurrentSampleEditionDate: sample.CurrentStatus.EditionDateTime,
      SampleType: sample.SampleType.Identification,
      CollectionPoint: sample.CollectionPoint.Identification,
    };

    return response.status(200).json(samplesCQ);
  }
}

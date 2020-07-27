import { Request, Response } from 'express';

import apiMYLIMS from '../services/api';

interface ISample {
  EditionUser: {
    Id: number;
    Identification: string;
  };
  EditionDateTime: Date;
  Id: number;
  Identification: string;
  ControlNumber: string;
  Number: number;
  Year: number;
  SubNumber: number;
  Revision: number;
  Active: boolean;
  SyncPortal: boolean;
  Received: boolean;
  Finalized: boolean;
  Published: boolean;
  Reviewed: boolean;
  TakenDateTime: Date;
  ReceivedTime: Date;
  FinalizedTime: Date;
  PublishedTime: Date;
  ReviewedTime: Date;
  ReferenceSample: null;
  ServiceCenter: {
    Identification: string;
  };
  SampleConclusion: {
    Identification: string;
  };
  SampleReason: {
    Identification: string;
  };
  CurrentStatus: {
    Id: number;
    SampleStatus: {
      Id: number;
      Identification: string;
      BeforeReceive: boolean;
      AfterPublish: boolean;
    };
    EditionUser: {
      Id: number;
      Identification: string;
    };
    EditionDateTime: Date;
  };
  SampleType: {
    Id: number;
    Identification: string;
  };
  CollectionPoint: {
    Id: number;
    Identification: string;
  };
}

interface IInfosMyLIS {
  Order: number;
  Info: {
    Identification: string;
  };
  DisplayValue: string;
}

interface IInfosCQ {
  // SampleId: number;
  Order: number;
  Info: string;
  Value: string;
}

interface IMethodMyLIMS {
  Id: number;
  Method: {
    MasterId: number;
    Version: number;
    Id: number;
    MethodType: {
      Identification: string;
    };
    Identification: string;
  };
  ServiceArea: {
    Identification: string;
  };
  CurrentStatus: {
    MethodStatus: {
      Identification: string;
    };
    EditionUser: {
      Identification: string;
    };
    EditionDateTime: Date;
    ExecuteUser: {
      Identification: string;
    };
    ExecuteDateTime: Date;
    StartUser: {
      Identification: string;
    };
    StartDateTime: Date;
  };
}

interface IMethodCQ {
  Id: number;
  
  MethodMasterId: number;
  MethodVersion: number;
  MethodId: number;
  MethodType: string;
  MethodIdentification: string;
  
  ServiceArea: string;
  
  CurrentMethodStatus: string;
  
  CurrentEditionUser: string;
  CurrentEditionDateTime: Date;
  
  CurrentExecuteUser: string;
  CurrentExecuteDateTime: Date;
  
  CurrentStartUser: string;
  CurrentStartDateTime: Date;
}

interface IAnalysesMyLIMS {
  Id: number;
  EditionUser: null;
  EditionDateTime: null;
  Method: {
    MasterId: number;
    Id: number;
    Identification: string;
  };
  AnalysisGroup: {
    Identification: string;
  };
  Info: {
    Identification: string;
  };
  MeasurementUnit: {
    Identification: string;
  };
  Conclusion: {
    Identification: string;
  };
  MethodAnalysisType: {
    Identification: string;
  };
  DisplayValue: string;
  ForceScale: number;
  ValueFloat: number;
  Order: number;
  K: string;
  Veff: string;
  ReferenceMethod: string;
}

interface IAnalysesCQ {
  Id: number;
  EditionUser: null;
  EditionDateTime: null;
  Method: {
    MasterId: number;
    Id: number;
    Identification: string;
  };
  AnalysisGroup: string;
  Info: string;
  MeasurementUnit: string;
  Conclusion: string;
  MethodAnalysisType: string;
  DisplayValue: string;
  ForceScale: number;
  ValueFloat: number;
  Order: number;
  K: string;
  Veff: string;
  ReferenceMethod: string;
}

const getAnalyses = async (sampleId: number): Promise<IAnalysesCQ[]> => {
  const analyses = await apiMYLIMS.get(`/samples/${sampleId}/analyses`);

  const analysesSample = analyses.data.Result as IAnalysesMyLIMS[];

  const analysesData = analysesSample.map(analyse => {
    return {
      Id: analyse.Id,
      EditionUser: analyse.EditionUser,
      EditionDateTime: analyse.EditionDateTime,
      Method: {
        MasterId: analyse.Method.MasterId,
        Id: analyse.Method.Id,
        Identification: analyse.Method.Identification,
      },
      AnalysisGroup:
        analyse.AnalysisGroup && analyse.AnalysisGroup.Identification,
      Info: analyse.Info.Identification,
      MeasurementUnit:
        analyse.MeasurementUnit && analyse.MeasurementUnit.Identification,
      Conclusion: analyse.Conclusion && analyse.Conclusion.Identification,
      MethodAnalysisType: analyse.MethodAnalysisType.Identification,
      DisplayValue: analyse.DisplayValue,
      ForceScale: analyse.ForceScale,
      ValueFloat: analyse.ValueFloat,
      Order: analyse.Order,
      K: analyse.K,
      Veff: analyse.Veff,
      ReferenceMethod: analyse.ReferenceMethod,
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
      MethdoMasterId: method.Method.MasterId,
      MethodVersion: method.Method.Version,
      MethodId: method.Method.Id,
      MethodType: method.Method.MethodType.Identification,
      MethodIdentification: method.Method.Identification,
      ServiceArea: method.ServiceArea.Identification,
      CurrentMethodStatus: method.CurrentStatus.MethodStatus.Identification,
      CurrentEditionUser: method.CurrentStatus.EditionUser.Identification,
      CurrentEditionDateTime: method.CurrentStatus.EditionDateTime,
      CurrentExecuteUser:
        method.CurrentStatus.ExecuteUser &&
        method.CurrentStatus.ExecuteUser.Identification,
      CurrentExecuteDateTime: method.CurrentStatus.ExecuteDateTime,
      CurrentStartUser:
        method.CurrentStatus.StartUser &&
        method.CurrentStatus.StartUser.Identification,
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
      // SampleId: sampleId,
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
        ReferenceSample: sample.ReferenceSample,
        ServiceCenter: sample.ServiceCenter.Identification,
        SampleConclusion:
          sample.SampleConclusion && sample.SampleConclusion.Identification,
        SampleReason: sample.SampleReason.Identification,
        CurrentSampleStatus: sample.CurrentStatus.SampleStatus.Identification,
        CurrentSampleEditionUser:
          sample.CurrentStatus.EditionUser.Identification,
        CurrentSampleEditionDate: sample.CurrentStatus.EditionDateTime,
        SampleType: sample.SampleType.Identification,
        CollectionPoint: sample.CollectionPoint.Identification,
        Infos: [],
        Methods: [],
        Analyses: [],
      };
    });

    for (let s = 0; s < samplesCQ.length; s += 1) {
      const infos = await getInfos(samplesCQ[s].Id);
      samplesCQ[s].Infos = infos;

      const methods = await getMethods(samplesCQ[s].Id);
      samplesCQ[s].Methods = methods;

      const analyses = await getAnalyses(samplesCQ[s].Id);
      samplesCQ[s].Analyses = analyses;
    }

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
      ReferenceSample: sample.ReferenceSample,
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

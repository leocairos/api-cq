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
      };
    });

    for (let s = 0; s < samplesCQ.length; s += 1) {
      const infos = await getInfos(samplesCQ[s].Id);
      samplesCQ[s].Infos = infos;
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

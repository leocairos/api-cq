export interface IAnalysis {
  analyse: string;
  value?: string;
  unit?: string;
  conclusion?: string;
}

export interface ISampleDetail {
  id: number;
  takenDateTime?: Date | string;
  collectionPoint?: string;
  type?: string;
  status?: string;
  conclusion?: string;
  observation?: string;
  lote?: string;
  analysis?: IAnalysis[];
  hashMail?: string;
  lastUpdated_at?: Date | string;
}

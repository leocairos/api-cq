import { Request, Response } from 'express';

import apiMYLIMS from '../services/api';

export default class Samples {
  public async getSamples(
    request: Request,
    response: Response,
  ): Promise<Response> {
    // const { skip = 0, top = 50 } = request.query;

    const samples = await apiMYLIMS.get(
      // `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`,
      '/samples?$inlinecount=allpages&$top=500&$skip=0&$orderby=Id desc',
    );

    return response.status(200).json(samples.data);
  }
}

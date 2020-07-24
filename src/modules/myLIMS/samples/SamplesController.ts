import { Request, Response } from 'express';

import apiMYLIMS from '../services/api';

export default class Samples {
  public async getSamples(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { skip = 0, top = 50, filter = '' } = request.query;

    const defaultRoute = `/samples?$inlinecount=allpages&$top=${top}&$skip=${skip}&$orderby=Id desc`;

    const samples = await apiMYLIMS.get(
      filter === '' ? defaultRoute : `${defaultRoute}&$filter=${filter}`,
    );

    return response.status(200).json(samples.data);
  }
}

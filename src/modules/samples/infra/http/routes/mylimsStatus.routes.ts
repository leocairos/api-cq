import { Router, Request, Response } from 'express';

import apiMYLIMS from '@shared/services/apiMYLIMS';
import logger from '@config/logger';
import { remoteIp } from '@shared/services/util';
import ensureKeyAuthorization from '@modules/users/infra/http/middlewares/ensureKeyAuthorization';

const mylimsStatusRouter = Router();

/* const serviceStatus = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in serviceStatus (from ${remoteIp(request)})...`);
  const myLIMsResponse = await apiMYLIMS.get('/checkConnection');
  const connectedMyLIMS = myLIMsResponse.data === true;
  return response.status(200).json({ connectedMyLIMS });
};

const checkTasks = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in checkTasks (from ${remoteIp(request)})...`);
  let tasksUrl = '/tasks/9/Histories?$inlinecount=allpages&$top=50&';
  tasksUrl += '$filter=Success eq false&$orderby=CreateDateTime';
  const myLIMsResponse = await apiMYLIMS.get(tasksUrl);
  const tasksWithError = myLIMsResponse.data.TotalCount;
  return response.status(200).json({ tasksWithError });
}; */

const serviceStatus = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.info(`GET in serviceStatus (from ${remoteIp(request)})...`);

  const myLIMsResponseConn = await apiMYLIMS.get('/checkConnection');
  const connectedMyLIMS = myLIMsResponseConn.data === true;

  let tasksUrl = '/tasks/9/Histories?$inlinecount=allpages&$top=50&';
  tasksUrl += '$filter=Success eq false&$orderby=CreateDateTime';

  const myLIMsResponseTsk = await apiMYLIMS.get(tasksUrl);
  const tasksWithError = myLIMsResponseTsk.data.TotalCount;

  return response.status(200).json({ connectedMyLIMS, tasksWithError });
};

mylimsStatusRouter.get('/', ensureKeyAuthorization, serviceStatus);

export default mylimsStatusRouter;

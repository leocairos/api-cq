import handlebars from 'handlebars';
import fs from 'fs';

import logger from '@config/logger';
import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
    sample,
  }: IParseMailTemplateDTO): Promise<string> {
    try {
      const templateFileContent = await fs.promises.readFile(file, {
        encoding: 'utf-8',
      });
      const parseTemplate = handlebars.compile(templateFileContent);
      const html = parseTemplate(variables || sample);
      // console.log('HandlebarsMailTemplateProvider HTML:\n', html);
      return html;
    } catch (e) {
      logger.error(`HandlebarsMailTemplateProvider ERROR: ${e.message}`);
      return e;
    }
  }
}

export default HandlebarsMailTemplateProvider;

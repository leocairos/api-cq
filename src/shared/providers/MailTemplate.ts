import { format } from 'date-fns';

interface IAnalysis {
  analyse: string;
  value?: string;
  unit?: string;
  conclusion?: string;
}

interface ISampleDetail {
  id: number;
  takenDateTime?: Date;
  collectionPoint?: string;
  type?: string;
  status?: string;
  conclusion?: string;
  observation?: string;
  lote?: string;
  analysis?: IAnalysis[];
}

const msgSampleUpdated = (sample: ISampleDetail): string => {
  const takenDateFormatted = sample.takenDateTime
    ? format(sample.takenDateTime, "dd/MM/yyyy 'às' HH:mm'h'")
    : '';

  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          th, td {
            text-align: left;
            padding: 4px;
          }
        </style>
      </head>
    <body>
      <table style="border: 0px;  padding: 0px; background-color: #fff">
        <tr>
          <td><strong>Id Amostra: </strong> ${sample.id}</td>
          <td><strong>Data da Coleta: </strong>${takenDateFormatted}</td>
        </tr>
        <tr>
          <td><strong>Situação da Amostra: </strong>${sample.status}</td>
          <td><strong>Parecer da Amostra: </strong>${sample.conclusion}</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Ponto de Coleta: </strong>${
            sample.collectionPoint || ''
          }</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Tipo de Amostra: </strong>${sample.type}</td>
        </tr>`;
  if (sample.observation) {
    html += `
            <tr>
              <td colspan="2"><strong>Observação: </strong>${sample.observation}</td>
            </tr>`;
  }
  if (sample.lote) {
    html += `
        <tr>
          <td colspan="2"><strong>Lote: </strong> ${sample.lote}</td>
        </tr>`;
  }
  html += `
        </table>

      <div style="overflow-x:auto;">
        <table style="border: 1px solid #ddd; border-spacing: 0; width: 100%;">
          <thead>
            <tr style="background-color: #e1e1e1">
              <th style="border: 1px solid #ddd;">Método Análise</th>
              <th style="border: 1px solid #ddd;">Valor</th>
              <th style="border: 1px solid #ddd;">Parecer da Análise</th>
            </tr>
          </thead>
          <tbody>`;
  if (sample.analysis) {
    // eslint-disable-next-line no-restricted-syntax
    for (const analyse of sample.analysis) {
      html += `
            <tr style="border: 1px solid #ddd;">
              <td style="border: 1px solid #ddd;" >${analyse.analyse}</td>
              <td style="border: 1px solid #ddd;">${analyse.value || ''} ${
        analyse.unit || ''
      }</td>
              <td style="border: 1px solid #ddd;">${
                analyse.conclusion || ''
              }</td>
            </tr>`;
    }
  }

  html += `
          </tbody>
        </table>
      </div>
    </body>
    </html>`;

  return html;
};

export default msgSampleUpdated;

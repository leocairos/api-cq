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

  let html = ` <strong>Id Amostra: </strong> ${sample.id}</br>
  <strong>Data da Coleta: </strong>${takenDateFormatted}</br>
  <strong>Ponto de Coleta: </strong>${sample.collectionPoint} </br>
  <strong>Tipo de Amostra: </strong>${sample.type}</br>
  <strong>Situação da Amostra: </strong>${sample.status}</br>
  <strong>Parecer da Amostra: </strong>${sample.conclusion}</br>
  <strong>Observação: </strong>${sample.observation || ''}</br>
  <strong>Lote: </strong> ${sample.lote || ''} </br></br>

  <strong>Análises</strong></br></br>

  <table style="text-align:left; border: 1px solid black">
  <thead>
    <tr style="text-align:left; border: 1px solid black">
      <th style="text-align:left; border: 1px solid black">Método Análise</th>
      <th style="text-align:left; border: 1px solid black">Valor</th>
      <th style="text-align:left; border: 1px solid black">Parecer da Análise</th>
    </tr>
  </thead>
  <tbody>`;

  if (sample.analysis) {
    // eslint-disable-next-line no-restricted-syntax
    for (const analyse of sample.analysis) {
      html += `
        <tr style="text-align:left; border: 1px solid black">
          <td style="text-align:left; border: 1px solid black">${
            analyse.analyse
          }</td>
          <td style="text-align:right; border: 1px solid black">${
            analyse.value || '-'
          } ${analyse.unit}</td>
          <td style="text-align:left; border: 1px solid black">${
            analyse.conclusion
          }</td>
        </tr>`;
    }
  }

  html += `</tbody>
    </table>`;

  return html;
};

export default msgSampleUpdated;

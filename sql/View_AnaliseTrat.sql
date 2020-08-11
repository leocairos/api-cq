-- `amostras-cq`.analisetrat source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `analisetrat` AS
select
    id, idAmostra, numero, ano, sub, revisao, identificacao, ativo, tipoConta, conta, contaRelacionada, centroServico, 
	classeAmostra, tipoAmostraHeranca, tipoAmostra, pontoColeta, motivoAmostra, situacaoAmostra, parecerAmostra, prazoFixo, 
	prazoConclusao, dataConclusao, tabelaPreco, precoAmostra, dataRegistro, dataColeta, dataRecebimento, dataEmAnalise, dataFinalizacao, 
	dataPublicacao, tipoDado, analise, valor, unidadeMedida, parecerAnalise, tipoMetodo, metodoAnalise, grupoAnalise, centroServicoMetodo, 
	areaServicoMetodo, prazoMetodo, dataConclusaoMetodo, dataDistribuicao, responsavelDistribuicao, observacoesDistribuicao, dataInicioMetodo, 
	dataFinalizacaoMetodo, responsavelFinalizacao, dataFinalizacaoMetodo_dataConclusaoMetodo, limiteDeteccao, limiteQuantificacao, 
	responsavelPublicacao, incerteza, k, veff, info01, info02, info03, info04, info05, info06, info07, info08, info09, info10, atributo, 
	primeiraDataExecucaoMetodo, observacao, lote, ph, quantidade, condutividade,
	GREATEST(dataRegistro, dataColeta, dataRecebimento, dataEmAnalise, dataFinalizacao, dataPublicacao, dataInicioMetodo,
		dataConclusaoMetodo, dataDistribuicao, dataFinalizacaoMetodo) as maxDate,
	CASE situacaoAmostra WHEN 'Registrada' THEN '0' WHEN 'Recebida' THEN '1' WHEN 'Em Análise' THEN '2' WHEN 'Finalizada' THEN '3'
		WHEN 'Publicada' THEN '4' WHEN 'Revisada' THEN '5' ELSE '9' END as seqSituacao
from
    `analise`;
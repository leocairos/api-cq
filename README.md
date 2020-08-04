# Xilolite SA - Quality Control API

API (Backend) for myLIMs integration and share analisys result.


## TypeORM - Migration

* $ yarn typeorm migration:create -n CreateNAME_MIGRATION
* $ yarn typeorm migration:run
* $ yarn typeorm migration:revert


## ToDo

[X] Migrations Samples
[X] Migrations Infos
[ ] Migrations Methods
[ ] Migrations Analyses

[ ] Criterio/Logica para importação inicial
  [ ] Importar pela rota do myLIMS /samples por ordem de Id
    [ ] samples >> infos >> methods >> analyses

[ ] Criterio/Logica para importação incremental
  [ ] Como identificar registros atualizados (novos, alterados ou excluidos)?
  [ ] Como garantir a equidade entre a base local(xilolite) e a base remota(Labsoft)?

[ ] Para o BI 2 tipos de consulta
  [ ] Armazenada com atualização agendada (8x por dia)
    [ ] Dados completos para analise historica
  [ ] Direta com atualização a cada 10min
    [ ] Ultimos 7 dias para acompanhamento em tempo real

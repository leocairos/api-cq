# Xilolite SA - Quality Control API

API (Backend) for myLIMs integration and share analisys result.


## TypeORM - Migration

* $ yarn typeorm migration:create -n CreateNAME_MIGRATION
* $ yarn typeorm migration:run
* $ yarn typeorm migration:revertc


## ToDo

[ ] Migrations Samples

[ ] Migrations Infos

[ ] Migrations Methods

[ ] Migrations Analyses


[ ] Criterio/Logica para importação inicial

  [ ] Importar pela rota do myLIMS /samples por ordem de Id

    [ ] samples >> infos >> methods >> analyses


[ ] Criterio/Logica para importação incremental

  [ ] Como identificar registros atualizados (novos, alterados ou excluidos)?

  [ ] Como

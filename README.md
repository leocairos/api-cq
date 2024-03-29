# Xilolite SA - Quality Control API

API (Backend) for myLIMs integration and share analisys result.


## TypeORM - Migration

* $ yarn typeorm migration:create -n CreateNAME_MIGRATION
* $ yarn typeorm migration:run
* $ yarn typeorm migration:revert


## ToDo

[X] Migrations Samples
[X] Migrations Infos
[X] Migrations Methods
[X] Migrations Analyses

[X] Criterio/Logica para importação inicial
  [X] Importar pela rota do myLIMS /samples por ordem de Id
    [X] samples >> infos >> methods >> analyses

[X] Criterio/Logica para importação incremental
  [X] Como identificar registros atualizados (novos, alterados ou excluidos)?
    * Data de coleta e recebimento são editaveis
    * Data de finalização, publicação e revisão são automáticas (não editaveis)
  [X] Como garantir a equidade entre a base local(xilolite) e a base remota(Labsoft)?
    * Sem acesso a CurrentStatus.EditionDateTime não é possivel. No entanto
      não pe necessário, pois a informação util está nas datas registradas de
      forma automática. Ou seja, no momento em que a amostra gera informação
      relevante (resultado disponivel)
    {{ baseURLmyLIMS }}/samples?$inlinecount=allpages&$top=10&$skip=0&$filter=CurrentStatus/EditionDateTime ge DATETIME'2020-08-07'

  Importar todos os os Ids maiores que a base atual +
    todos os ids não publicados +
      todos os ids com datas (finalizado/publicado/revisado) ultimos 15 dias

[X] Para o BI 2 tipos de consulta
  [X] Armazenada com atualização agendada (8x por dia)
    [X] Dados completos para analise historica
  [X] Direta com atualização a cada 15min
    [X] Ultimos 7 dias para acompanhamento em tempo real

[X] App como serviço
  * by pm2
[X] App como serviço com execução automatica de sincronização a cada X segundos


## Deploy Backend

* Instalar node
  * $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  * $ sudo apt-get install -y nodejs
  * $ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  * $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  * $ sudo apt update && sudo apt install --no-install-recommends yarn

* Postgres
  * $ docker run -d --name postgresql -e POSTGRESQL_PASSWORD=SecretPSpsswrd@2020c -e POSTGRESQL_USERNAME=postgres -e POSTGRESQL_DATABASE=xilolite-api-cq -p 45432:5432 bitnami/postgresql:latest

* clonar repositorio do git dentro do servidor
  * criar certificado: $ ssh-keygen
  * $ cat ~/.ssh/id_rsa.pub
  * Copia a chave publica (txt) e informa no github
    - profile >> settings >> SSH and GPG Keys >> new SSH Keys
    - informa title e cola a key
  * $ mkdir app (in /home)
  * $ cd app
  * $ git clone git@github.com:leocairos/api-cq.git
  * $ cd api-cq
  * $ yarn
  * $ yarn build

* ajustar ormconfig.json
  * $ cp ormconfig.example ormconfig.json
  * $ vim ormconfig.json
  * alterar port, username, database, entities, migrations, cli
    * dist ao inves de src
    * js ao inves de ts
* executar as migrations: $ ./node_modules/.bin/typeorm migrations:run

* Testar build
  * $ node dist/shared/infra/http/server.js

* Mantendo aplicação no ar
  * Ajustar cada container para inicializar automaticamente
    * $ docker ps
    * $ docker update --restart=unless-stopped IDCONTAINER
    * $ docker update --restart=unless-stopped 6c180aaac545
    * $ docker update --restart=unless-stopped a53e967ddc4d


  * instalar pm2: $ sudo npm install -g pm2
  * executar API-CQ com PM2
    * $ pm2 start dist/shared/infra/http/server.js --name api-cq

    *  pm2 start pm2-config.json
    *  pm2 delete pm2-config.json

    * comandos pm2
      * pm2 list
      * pm2 monit
      * pm2 log NAMEAPP
      * pm2 stop NAMEAPP
      * pm2 delete NAMEAPP

  * automatizar start do PM2:
    * $ pm2 startup systemd
    * $ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/leonardo.sampaio

  * Save Processes for Restart on Boot
    * $ pm2 save

## git flow

###	Branches principais

* O branch **master** é o branch principal
*	O branch **develop**
  -> Criar a branch develop a partir da master
  - $ git checkout -b develop master
*	O branch **release/X.X.X**
  -> Criar a branch release/X.X.X a partir da develop
  - $ git checkout -b release/X.X.X develop

### Trabalhando com branch de release

* **Criando um branch de lançamento**
  - $ git checkout -b release/X.X.X develop
  - Atualiza versão no package.json
  - $ git commit -a -m “Bumped version number to X.X.X”

* **Finalizando um branch de lançamento**
  - $ git checkout master
  - $ git merge --no-ff release/X.X.X
    - Necessário salvar o arquivo MERGE

  Em seguida este commit deve ser tageado para referência futura para esta versão:

  - $ git tag -a X.X.X
  - $ git push --follow-tags origin master

  Finalmente, as mudanças feitas no branch de lançamento precisam mescladas de volta no branch develop, para que as versões futuras também possuam as correções feitas neste branch:

  - $ git checkout develop
  - $ git merge — no-ff release/X.X.X
    - Necessário salvar o arquivo MERGE

  Feitos os merges podemos excluir o branch de lançamento, já que não precisamos mais dele:
  - $ git branch -d release/X.X.X

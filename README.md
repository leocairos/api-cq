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

[ ] Criterio/Logica para importação inicial
  [ ] Importar pela rota do myLIMS /samples por ordem de Id
    [ ] samples >> infos >> methods >> analyses

[ ] Criterio/Logica para importação incremental
  [ ] Como identificar registros atualizados (novos, alterados ou excluidos)?
  [ ] Como garantir a equidade entre a base local(xilolite) e a base remota(Labsoft)?

[ ] Para o BI 2 tipos de consulta
  [ ] Armazenada com atualização agendada (8x por dia)
    [ ] Dados completos para analise historica
  [ ] Direta com atualização a cada 15min
    [ ] Ultimos 7 dias para acompanhamento em tempo real

[ ] App como serviço
[ ] App como serviço com execução automatica de sincronização a cada X segundos


## Deploy Backend

* Instalar node
  * $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  * $ sudo apt-get install -y nodejs
  * $ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  * $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  * $ sudo apt update && sudo apt install --no-install-recommends yarn

* Postgres
  * $ docker run -d --name postgresql -e POSTGRESQL_PASSWORD=SecretPSpsswrd@2020c -e POSTGRESQL_USERNAME=postgres -e POSTGRESQL_DATABASE=xilolite-api-cq -p 45432:5432 bitnami/postgresql:latest

* Redis
 * $ docker run -d --name redis -e REDIS_PASSWORD=PsswrdRedis2020 -p 56379:6379 bitnami/redis:latest

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
    * comandos pm2
      * pm2 list
      * pm2 monit
      * pm2 log NAMEAPP
      * pm2 stop NAMEAPP
      * pm2 delete NAMEAPP

  * automatizar start do PM2:
    * $ pm2 startup systemd
    * $ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/leonardo.sampaio


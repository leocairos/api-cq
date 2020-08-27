-- public.vw_size_databases source

CREATE OR REPLACE VIEW public.vw_size_databases
AS SELECT pg_database.datname AS banco,
    pg_database_size(pg_database.datname) AS tamanho,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS tamanho_pretty
   FROM pg_database
  WHERE pg_database.datname <> ALL (ARRAY['template0'::name, 'template1'::name, 'postgres'::name])
  ORDER BY (pg_database_size(pg_database.datname)) DESC, pg_database.datname;

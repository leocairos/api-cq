SELECT
	datname                                   AS banco,
	pg_database_size(datname)                 AS tamanho,
	pg_size_pretty(pg_database_size(datname)) AS tamanho_pretty
FROM pg_database
WHERE datname NOT IN ('template0', 'template1', 'postgres')
ORDER BY tamanho DESC, banco ASC

fetch_istsWindDay_sql = '''SELECT
	date_key,
	sum(day_energy_actual) AS wind
FROM
	reporting_uat.regional_entities_generation
WHERE
	date_key =:date_key
	AND CLASSIFICATION_NAME IN ('RENEWABLE')
	AND STATION_TYPE_NAME IN ('WIND')
GROUP BY
	DATE_KEY
ORDER BY
	DATE_KEY'''

fetch_istsSolarDay_sql = '''SELECT
	date_key,
	sum(day_energy_actual) AS solar
FROM
	reporting_uat.regional_entities_generation
WHERE
	date_key =:date_key
	AND CLASSIFICATION_NAME IN ('RENEWABLE')
	AND STATION_TYPE_NAME IN ('SOLAR')
GROUP BY
	DATE_KEY
ORDER BY
	DATE_KEY'''

fetch_istsMaxWind_sql ='''WITH ists_wind(date_key,
wind) AS (SELECT
	date_key,
	sum(day_energy_actual) AS value
FROM
	reporting_uat.regional_entities_generation
WHERE
	date_key BETWEEN 20210101 AND :end_date
	AND CLASSIFICATION_NAME IN ('RENEWABLE')
	AND STATION_TYPE_NAME IN ('WIND')
GROUP BY
	DATE_KEY
ORDER BY
	DATE_KEY) SELECT date_key, wind FROM ists_wind WHERE wind= (SELECT max(wind) FROM ists_wind)'''

fetch_istsMaxSolar_sql= '''WITH ists_solar(date_key,
solar) AS (SELECT
	date_key,
	sum(day_energy_actual) AS value
FROM
	reporting_uat.regional_entities_generation
WHERE
	date_key BETWEEN 20210101 AND :end_date
	AND CLASSIFICATION_NAME IN ('RENEWABLE')
	AND STATION_TYPE_NAME IN ('SOLAR')
GROUP BY
	DATE_KEY
ORDER BY
	DATE_KEY) SELECT date_key, solar FROM ists_solar WHERE solar= (SELECT max(solar) FROM ists_solar)'''
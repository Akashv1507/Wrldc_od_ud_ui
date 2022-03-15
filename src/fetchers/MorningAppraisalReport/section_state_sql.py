fetch_WRDate_sql = '''
	
WITH wr_wind(date_key,wind) AS (SELECT
	wind_central_tbl.date_key,
	(wind_central_tbl.wind_central + wind_states_tbl.wind_states) AS wr_wind_comb
FROM
	(
	SELECT
		date_key,
		sum(day_energy_actual) AS wind_central
	FROM
		reporting_uat.regional_entities_generation
	WHERE
		DATE_KEY = : date_key
		AND CLASSIFICATION_NAME IN ('RENEWABLE')
		AND STATION_TYPE_NAME IN ('WIND')
	GROUP BY
		DATE_KEY
	ORDER BY
		DATE_KEY) wind_central_tbl
INNER JOIN (
	SELECT
		date_key,
		sum(wind) AS wind_states
	FROM
		REPORTING_UAT.state_load_details
	WHERE
		state_name IN('MADHYA PRADESH', 'MAHARASHTRA', 'CHHATTISGARH', 'GUJARAT')
			AND date_key = : date_key
		GROUP BY
			DATE_KEY
		ORDER BY
			DATE_KEY) wind_states_tbl ON
	wind_central_tbl.DATE_KEY = wind_states_tbl.DATE_KEY),

	wr_solar(date_key,solar) AS (SELECT
	solar_central_tbl.date_key,
	(solar_central_tbl.solar_central + solar_states_tbl.solar_states) AS wr_solar_comb
FROM
	(
	SELECT
		date_key,
		sum(day_energy_actual) AS solar_central
	FROM
		reporting_uat.regional_entities_generation
	WHERE
		DATE_KEY = : date_key
		AND CLASSIFICATION_NAME IN ('RENEWABLE')
		AND STATION_TYPE_NAME IN ('SOLAR')
	GROUP BY
		DATE_KEY
	ORDER BY
		DATE_KEY) solar_central_tbl
INNER JOIN (
	SELECT
		date_key,
		sum(solar) AS solar_states
	FROM
		REPORTING_UAT.state_load_details
	WHERE
		state_name IN('MADHYA PRADESH', 'MAHARASHTRA', 'CHHATTISGARH', 'GUJARAT')
			AND date_key = : date_key
		GROUP BY
			DATE_KEY
		ORDER BY
			DATE_KEY) solar_states_tbl ON
	solar_central_tbl.DATE_KEY = solar_states_tbl.DATE_KEY),

	wr_consumption(date_key,
consumption) AS (
SELECT
	DATE_KEY ,
	sum(consumption) AS CONSUMPTION
FROM
	REPORTING_UAT.state_load_details
WHERE
	date_key= : date_key
GROUP BY
	DATE_KEY)
	SELECT wr_solar.date_key, wr_consumption.consumption, wr_wind.wind, wr_solar.solar FROM wr_solar, wr_wind, wr_consumption'''


fetchWrMaxWind_Sql = '''WITH wr_wind(date_key,wind) AS (SELECT
	wind_central_tbl.date_key,
	(wind_central_tbl.wind_central + wind_states_tbl.wind_states) AS wr_wind_comb
FROM
	(
	SELECT
		date_key,
		sum(day_energy_actual) AS wind_central
	FROM
		reporting_uat.regional_entities_generation
	WHERE
		DATE_KEY BETWEEN 20190101 and :end_date
		AND CLASSIFICATION_NAME IN ('RENEWABLE')
		AND STATION_TYPE_NAME IN ('WIND')
	GROUP BY
		DATE_KEY
	ORDER BY
		DATE_KEY) wind_central_tbl
INNER JOIN (
	SELECT
		date_key,
		sum(wind) AS wind_states
	FROM
		REPORTING_UAT.state_load_details
	WHERE
		state_name IN('MADHYA PRADESH', 'MAHARASHTRA', 'CHHATTISGARH', 'GUJARAT')
			AND date_key BETWEEN 20190101 and :end_date
		GROUP BY
			DATE_KEY
		ORDER BY
			DATE_KEY) wind_states_tbl ON
	wind_central_tbl.DATE_KEY = wind_states_tbl.DATE_KEY) SELECT date_key, wind FROM wr_wind WHERE wind = (SELECT max(wind) FROM wr_wind)'''

fetchWrMaxSolar_Sql = '''WITH wr_solar(date_key,solar) AS (SELECT
	solar_central_tbl.date_key,
	(solar_central_tbl.solar_central + solar_states_tbl.solar_states) AS wr_solar_comb
FROM
	(
	SELECT
		date_key,
		sum(day_energy_actual) AS solar_central
	FROM
		reporting_uat.regional_entities_generation
	WHERE
		DATE_KEY BETWEEN 20210101 AND :end_date
		AND CLASSIFICATION_NAME IN ('RENEWABLE')
		AND STATION_TYPE_NAME IN ('SOLAR')
	GROUP BY
		DATE_KEY
	ORDER BY
		DATE_KEY) solar_central_tbl
INNER JOIN (
	SELECT
		date_key,
		sum(solar) AS solar_states
	FROM
		REPORTING_UAT.state_load_details
	WHERE
		state_name IN('MADHYA PRADESH', 'MAHARASHTRA', 'CHHATTISGARH', 'GUJARAT')
			AND date_key BETWEEN 20210101 AND :end_date
		GROUP BY
			DATE_KEY
		ORDER BY
			DATE_KEY) solar_states_tbl ON
	solar_central_tbl.DATE_KEY = solar_states_tbl.DATE_KEY)  SELECT date_key, solar FROM wr_solar WHERE solar = (SELECT max(solar) FROM wr_solar)'''
	
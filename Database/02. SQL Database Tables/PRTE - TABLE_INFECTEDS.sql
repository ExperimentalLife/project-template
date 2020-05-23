IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[PRTE_INFECTEDS]') AND type in (N'U'))
   DROP TABLE PRTE_INFECTEDS
go

CREATE TABLE PRTE_INFECTEDS(
   INFE_dateRep                 VARCHAR(10) 
  ,INFE_day                     INTEGER 
  ,INFE_month                   INTEGER 
  ,INFE_year                    INTEGER 
  ,INFE_cases                   INTEGER 
  ,INFE_deaths                  INTEGER 
  ,INFE_countriesAndTerritories VARCHAR(30)
  ,INFE_geoId                   VARCHAR(30)
  ,INFE_countryterritoryCode    VARCHAR(30)
  ,INFE_popData2018             INTEGER 
  ,INFE_continentExp            VARCHAR(30)
);


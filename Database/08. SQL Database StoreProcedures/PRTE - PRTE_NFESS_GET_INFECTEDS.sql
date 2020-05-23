IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PRTE_NFESS_GET_INFECTEDS]') AND type in (N'P', N'PC'))
   DROP PROCEDURE [dbo].[PRTE_NFESS_GET_INFECTEDS]
 GO

 CREATE PROCEDURE PRTE_NFESS_GET_INFECTEDS
 AS
 BEGIN
	SELECT  
		INFE_dateRep
	  ,INFE_day                    
	  ,INFE_month                  
	  ,INFE_year                   
	  ,INFE_cases                  
	  ,INFE_deaths                 
	  ,INFE_countriesAndTerritories
	  ,INFE_geoId                  
	  ,INFE_countryterritoryCode   
	  ,INFE_popData2018            
	  ,INFE_continentExp   
  FROM PRTE_INFECTEDS        
 END
 GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PRTE_USESS_AUTH]') AND type in (N'P', N'PC'))
   DROP PROCEDURE [dbo].[PRTE_USESS_AUTH]
 GO

 CREATE PROCEDURE PRTE_USESS_AUTH
 @P_username VARCHAR(20),
 @P_password VARCHAR(MAX)
 AS
 BEGIN
	SELECT  
		USER_id
		,USER_username
		,USER_password
		,USER_firstName
		,USER_lastName
		,USER_name
		,USER_photoUrl
	FROM PRTE_USERS
    WHERE USER_username = @P_username AND
		USER_password = @P_password
 END
 GO


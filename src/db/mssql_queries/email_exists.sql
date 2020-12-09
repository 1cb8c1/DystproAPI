SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[email_exists](@searched_email VARCHAR(64))
RETURNS BIT AS
BEGIN
    DECLARE @count INT
    SELECT @count=COUNT(email)
    FROM users
    WHERE email=@searched_email
    IF(@count > 0)
        RETURN 1
    RETURN 0
END
GO

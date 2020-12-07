SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[user_exists](@id INT)
RETURNS BIT AS
BEGIN
    DECLARE @count INT
    SELECT @count=COUNT(email)
    FROM users
    WHERE user_id = @id
    IF(@count > 0)
        RETURN 1
    RETURN 0
END
GO

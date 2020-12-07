SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[user_authorized](@id INT, @role VARCHAR(32))
RETURNS BIT AS
BEGIN
    DECLARE @count INT
    SELECT @count=COUNT(*)
    FROM users_roles
    WHERE user_id=@id AND role_name=@role
    IF(@count > 0)
        RETURN 1
    RETURN 0
END
GO

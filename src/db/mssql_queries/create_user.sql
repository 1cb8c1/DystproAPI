SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[create_user](@user_email VARCHAR(64),
    @user_password CHAR(60))
AS
BEGIN
    DECLARE @does_email_exist BIT
    SELECT @does_email_exist=dbo.email_exists(@user_email)
    IF(@does_email_exist = 1)
        THROW 51000, 'USER ALREADY EXISTS', 1
    IF(@user_email NOT LIKE '%@%')
        THROW 51001, 'EMAIL DOESN"T CONTAIN @', 1
    INSERT INTO users
        (password, password_creation_date, distributor, email)
    VALUES(@user_password, GETDATE(), NULL, @user_email)
END
GO

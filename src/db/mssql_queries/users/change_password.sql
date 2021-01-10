CREATE PROCEDURE change_password
    @user_id INT,
    @password CHAR(60)
AS
BEGIN
    /*CHECKS IF user EXISTS*/
    IF((SELECT COUNT(user_id)
    FROM users
    WHERE user_id = @user_id) != 1)
        THROW 50045, 'User doesnt exist', 1

    /*UPDATES passsword*/
    DECLARE @my_table TABLE(user_id INT)

    UPDATE users SET password = @password, password_creation_date = GETDATE() 
    OUTPUT INSERTED.user_id INTO @my_table 
    WHERE user_id = @user_id

    /*CHECKS IF user WAS UPDATED*/
    IF((SELECT COUNT(user_id)
    FROM @my_table) != 1)
        THROW 50046, 'Failed to update password', 1

END
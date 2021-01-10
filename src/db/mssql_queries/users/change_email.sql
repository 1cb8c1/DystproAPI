CREATE PROCEDURE change_email
    @user_id INT,
    @email VARCHAR(64)
AS
BEGIN
    /*CHECKS IF user EXISTS*/
    IF((SELECT COUNT(user_id)
    FROM users
    WHERE user_id = @user_id) != 1)
        THROW 50045, 'User doesnt exist', 1

    /*UPDATES passsword*/
    DECLARE @my_table TABLE(user_id INT)

    UPDATE users SET email = @email  
    OUTPUT INSERTED.user_id INTO @my_table 
    WHERE user_id = @user_id

    /*CHECKS IF user WAS UPDATED*/
    IF((SELECT COUNT(user_id)
    FROM @my_table) != 1)
        THROW 50047, 'Failed to update email', 1

END
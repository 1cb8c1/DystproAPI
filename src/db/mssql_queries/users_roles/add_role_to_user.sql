CREATE PROCEDURE add_role_to_user
    @user_id INT,
    @role_name VARCHAR(32)
AS
BEGIN

    IF((SELECT COUNT(name)
    FROM roles
    WHERE name = @role_name) != 1)
        THROW 50032, 'Role with such name doesnt exist', 1

    IF((SELECT COUNT(user_id)
    FROM users_roles
    WHERE role_name = @role_name AND user_id = @user_id) != 0)
        THROW 50033, 'User already has such role', 1

    DECLARE @my_table table(user_id INT)

    INSERT users_roles
        (user_id, role_name)
    OUTPUT INSERTED.user_id
            INTO @my_table
    VALUES(@user_id, @role_name)

    IF((SELECT COUNT(user_id)
    FROM @my_table) != 0)
        THROW 50034, 'Failed to add such role to an user', 1

END
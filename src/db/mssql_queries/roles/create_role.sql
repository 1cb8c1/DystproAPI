CREATE PROCEDURE create_role
    @name VARCHAR(32)
AS
BEGIN

    IF((SELECT COUNT(name)
    FROM roles
    WHERE name = @name) != 0)
        THROW 50031, 'Role with such name already exists', 1

    DECLARE @my_table table(name VARCHAR(32))

    INSERT roles
        (name)
    OUTPUT INSERTED.name
            INTO @my_table
    VALUES(@name)

    IF((SELECT COUNT(name)
    FROM @my_table) != 0)
        THROW 50030, 'Failed to create a role', 1

END
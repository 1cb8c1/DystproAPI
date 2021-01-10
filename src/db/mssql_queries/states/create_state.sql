CREATE PROCEDURE create_state
    @name VARCHAR(16)
AS
BEGIN

    IF((SELECT COUNT(name)
    FROM states
    WHERE name = @name) != 0)
        THROW 50035, 'State with such name already exists', 1

    DECLARE @my_table table(name VARCHAR(16))

    INSERT states
        (name)
    OUTPUT INSERTED.name
            INTO @my_table
    VALUES(@name)

    IF((SELECT COUNT(name)
    FROM @my_table) != 0)
        THROW 50036, 'Failed to create a state', 1

END
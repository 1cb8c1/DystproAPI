CREATE PROCEDURE create_warehouse
    @name NVARCHAR(32),
    @city NVARCHAR(32),
    @street NVARCHAR(32)
AS
BEGIN
    DECLARE @warehousesCount INT
    SELECT @warehousesCount = COUNT(name)
    FROM warehouses
    WHERE name = @name

    IF(@warehousesCount > 0)
        THROW 50023, 'Warehouse already exists', 1

    DECLARE @my_table table(name NVARCHAR(32))

    INSERT warehouses
        (name, city, street)
    OUTPUT INSERTED.name
            INTO @my_table
    VALUES(@name, @city, @street)

    IF((SELECT COUNT(name)
    FROM @my_table) != 1)
        THROW 50024, 'Failed to create warehouse', 1

END
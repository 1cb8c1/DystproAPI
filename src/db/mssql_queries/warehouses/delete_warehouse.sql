CREATE PROCEDURE delete_warehouse
    @name NVARCHAR(32)
AS
BEGIN
    DECLARE @warehousesCount INT
    SELECT @warehousesCount = COUNT(name)
    FROM warehouses
    WHERE name = @name AND archived = 0

    IF(@warehousesCount != 1)
        THROW 50025, 'Warehouse doesnt exist or is already deleted', 1

    DECLARE @my_table table(name NVARCHAR(32))

    DELETE warehouses
    OUTPUT DELETED.name
            INTO @my_table
    WHERE name = @name

    IF((SELECT COUNT(name)
    FROM @my_table) != 1)
        THROW 50026, 'Failed to delete warehouse', 1

END
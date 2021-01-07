CREATE PROCEDURE reopen_warehouse
    @name NVARCHAR(32)
AS
BEGIN
    DECLARE @warehousesCount INT
    SELECT @warehousesCount = COUNT(name)
    FROM warehouses
    WHERE archived = 1 AND name = @name

    IF(@warehousesCount != 1)
        THROW 50027, 'Warehouse doesnt exist or is not archived', 1

    DECLARE @my_table table(name NVARCHAR(32))

    UPDATE warehouses
    SET archived = 0
    OUTPUT INSERTED.name
    INTO @my_table
    WHERE name = @name


    IF((SELECT COUNT(name)
    FROM @my_table) != 1)
        THROW 50028, 'Failed to reopen warehouse', 1

END
CREATE PROCEDURE remove_vechicle_by_id
    @vechicle_id INT,
    @distributor_id INT
AS
BEGIN
    DECLARE @vechiclesCount INT
    SELECT @vechiclesCount = COUNT(vechicle_id)
    FROM vechicles
    WHERE vechicle_id = @vechicle_id AND distributor_id = @distributor_id AND archived = 0

    IF(@vechiclesCount < 1)
        THROW 50005, 'Trying to delete vechicle that doesnt exist for this distributor', 1

    DELETE vechicles WHERE vechicle_id = @vechicle_id
END
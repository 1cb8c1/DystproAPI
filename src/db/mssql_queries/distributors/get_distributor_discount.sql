
CREATE FUNCTION get_distributor_discount(@distributor_id INT)
RETURNS FLOAT AS
BEGIN
    DECLARE @discount FLOAT
    SELECT @discount = discount
    FROM distributors
    WHERE distributor_id = @distributor_id
    RETURN @discount
END
GO

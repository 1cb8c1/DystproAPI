CREATE FUNCTION get_requests_by_user_id(@user_id INT)
RETURNS TABLE
AS 
RETURN 
SELECT request_id, info
FROM requests
WHERE user_id = @user_id
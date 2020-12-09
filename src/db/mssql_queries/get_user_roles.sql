CREATE FUNCTION get_user_roles(@user_id INT)
RETURNS TABLE
AS
RETURN SELECT role_name
FROM users_roles
WHERE user_id = @user_id
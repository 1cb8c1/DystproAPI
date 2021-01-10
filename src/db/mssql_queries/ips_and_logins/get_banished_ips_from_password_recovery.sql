CREATE FUNCTION get_basnished_ips_from_password_recovery()
RETURNS TABLE
AS
RETURN
SELECT ip
FROM password_recovery_attempts
WHERE DATEDIFF(HOUR, date, GETDATE()) < 24
GROUP BY ip
HAVING COUNT(attempt_id) >= 100
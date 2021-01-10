CREATE FUNCTION get_basnished_emails_from_password_recovery()
RETURNS TABLE
AS
RETURN
SELECT email
FROM password_recovery_attempts
WHERE DATEDIFF(HOUR, date, GETDATE()) < 24
GROUP BY email
HAVING COUNT(attempt_id) >= 100
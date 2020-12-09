CREATE FUNCTION get_basnished_ips_from_login()
RETURNS TABLE
AS
RETURN
SELECT ip
FROM failed_logins
WHERE DATEDIFF(HOUR, date, GETDATE()) < 24
GROUP BY ip
HAVING COUNT(failed_id) >= 100
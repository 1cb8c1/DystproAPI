
CREATE FUNCTION get_distributor_statistics(@distributor_id INT)
RETURNS TABLE
AS
RETURN
SELECT
    COUNT(DISTINCT drivers.driver_id) AS drivers_count,
    COUNT(DISTINCT vehicles.vehicle_id) AS vehicles_count,
    COUNT(DISTINCT realized_dispatches.dispatch_id) AS dispatches_count,
    COUNT(DISTINCT users.user_id) AS users_count
FROM distributors
    LEFT OUTER JOIN vehicles ON vehicles.distributor_id = distributors.distributor_id AND distributors.distributor_id = @distributor_id AND vehicles.archived = 0
    LEFT OUTER JOIN drivers ON drivers.distributor_id = distributors.distributor_id AND drivers.archived = 0
    LEFT OUTER JOIN users ON users.distributor = distributors.distributor_id
    LEFT OUTER JOIN (
        SELECT dispatches.dispatch_id, dispatches.distributor_id
    FROM dispatches
        INNER JOIN dispatches_states
        ON dispatches.dispatch_id = dispatches_states.dispatch_id AND dispatches_states.state = 'REALIZED'
    WHERE dispatches.distributor_id = @distributor_id
        ) AS realized_dispatches ON realized_dispatches.distributor_id = @distributor_id
WHERE distributors.distributor_id = @distributor_id
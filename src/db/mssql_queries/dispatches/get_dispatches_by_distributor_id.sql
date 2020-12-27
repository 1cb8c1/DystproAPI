
CREATE FUNCTION get_dispatches_by_distributor_id(@distributor_id INT)
RETURNS TABLE AS
RETURN
SELECT newest.dispatch_id, states.state, states.date, dispatches.pickup_planned_date
FROM dispatches_states AS states
    INNER JOIN (
SELECT dispatch_id, MAX(date) AS date
    FROM dispatches_states
    GROUP BY dispatch_id) AS newest ON newest.date = states.date
    INNER JOIN dispatches ON newest.dispatch_id = dispatches.dispatch_id
CREATE TABLE dispatches_states
(
    dispatch_id INT NOT NULL,
    state VARCHAR(16),
    date DATETIME,

    PRIMARY KEY(dispatch_id, state),
    FOREIGN KEY(dispatch_id) REFERENCES dispatches(dispatch_id),
    FOREIGN KEY(state) REFERENCES states(name)
)
CREATE TABLE requests
(
    request_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,
    info VARCHAR(512),
    PRIMARY KEY(request_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)
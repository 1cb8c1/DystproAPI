CREATE TABLE users
(
    user_id INT IDENTITY(1,1) NOT NULL,
    password CHAR(60) NOT NULL,
    password_creation_date DATETIME NOT NULL,
    distributor INT DEFAULT NULL,
    email varchar(64) NOT NULL UNIQUE,
    PRIMARY KEY(user_id)
)
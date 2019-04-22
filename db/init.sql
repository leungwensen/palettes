/* init db */
DROP DATABASE IF EXISTS palette_forms;
CREATE DATABASE palette_forms;
USE palette_forms;

/* create tables */
CREATE TABLE distance (
  id           INT        NOT NULL AUTO_INCREMENT,
  riddle       TEXT       NOT NULL,
  answer       TEXT       NOT NULL,
  distance     FLOAT      NOT NULL DEFAULT 0.0,
  created_at   TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
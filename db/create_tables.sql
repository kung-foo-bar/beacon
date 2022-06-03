DROP TABLE IF EXISTS Users, Issues CASCADE;

CREATE TABLE Users(
   user_id TEXT PRIMARY KEY,
   ph_number TEXT NOT NULL
);

CREATE TABLE Issues(
   msg TEXT NOT NULL,
   log_time TIMESTAMP NOT NULL,
   issue_type TEXT NOT NULL,
   creator_id TEXT NOT NULL,
   asignee_id TEXT NOT NULL,
   CONSTRAINT fk_creator_id
      FOREIGN KEY(creator_id)
         REFERENCES Users(user_id)
         ON DELETE CASCADE,
   /* TODO replace with trigger function */
   CONSTRAINT fk_asignee_id
      FOREIGN KEY(asignee_id)
         REFERENCES Users(user_id)
         ON DELETE SET NULL

);

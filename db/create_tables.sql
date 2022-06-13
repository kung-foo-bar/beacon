DROP TABLE IF EXISTS Users,Votes, Issues CASCADE;

CREATE TABLE Users(
   user_id TEXT PRIMARY KEY,
   ph_number TEXT NOT NULL
);

CREATE TABLE Issues(
   title TEXT NOT NULL,
   msg TEXT NOT NULL,
   log_time TIMESTAMP NOT NULL,
   issue_type TEXT NOT NULL,
   creator_id TEXT NOT NULL,
   asignee_id TEXT NOT NULL,
   PRIMARY KEY (title,creator_id,asignee_id),
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

CREATE TABLE Votes(
   post_title TEXT NOT NULL,
   post_creator_id TEXT NOT NULL,
   post_asignee_id TEXT NOT NULL,
   voter_id   TEXT NOT NULL, 
   
   UNIQUE(post_title,post_creator_id,post_asignee_id,voter_id),

   FOREIGN KEY (post_title,post_creator_id,post_asignee_id)
      REFERENCES Issues(title,creator_id,asignee_id)
      ON DELETE CASCADE,
   
   FOREIGN KEY (voter_id)
      REFERENCES Users(user_id)
      ON DELETE CASCADE
);



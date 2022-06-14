INSERT INTO Users(user_id,ph_number)
   VALUES ('SupaVilan','23089402'),
          ('Paigen'   ,'807979472'),
          ('Aira'     ,'089778830'),
          ('LE BOSS'  ,'111392092'),
          ('MF DOOM'  ,'489027239');

INSERT INTO Issues(title,msg,log_time,issue_type,creator_id,asignee_id)
   VALUES ('help','coke machine broke','2021-4-4 01:00:00','INFRASTRUCTURE','SupaVilan','MF DOOM');


INSERT INTO Votes(post_title,post_creator_id,post_asignee_id,voter_id)
   VALUES ('help','SupaVilan','MF DOOM','LE BOSS');

## Assignment -- School Managgement System
- This add school info into database and show availabe schools near to you.
- It is a epress backednd that has 2 end point :-
  
- ## /listSchools (get) :
- -- It takes two parameters i) latitude & ii) longitude
- --- It returns the list of schools **sorted nearest to you.**

  
-  ## /addSchool (post) :
- -- It takes two body parameters as json i)name  ii)address  iii) latitude & iv) longitude
- --- It add the school  to the database.
- -- It checks some validation line not null and number only fields.

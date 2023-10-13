var dbconnection = mysql.createPool({
    host:"localhost",  
    user:"admin_aw",  
    password:"",  
    database:"viajes" });
  
  
  module.exports=dbconnection;
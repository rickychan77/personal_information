var UserSQL = {  
    insert:'INSERT INTO user(name,sex,age,tel) VALUES(?,?,?,?)', 
    queryAll:'SELECT * FROM user',  
    checkLogin:'SELECT password FROM myuser WHERE username = ?',  
    getUserById:'SELECT * FROM user WHERE id = ? ',
    upDated:'UPDATE user SET name = ?,sex = ?,age = ?,tel = ? WHERE id = ?',
    delete:'DELETE FROM user WHERE id = ?'
  };
module.exports = UserSQL;
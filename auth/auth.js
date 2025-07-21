const bcrypt = require('bcrypt');
const saltRound = 10 ;

//تشفير كلمة المرور
const hashedPassword = async (password)=>{
    try {
 await bcrypt.hash(password,saltRound);
return hashedPassword;    
    } catch (Error) {
throw new Error('failed hashingpassword')   
    }
};

//التحقق من كلمة المرور
const comparePassword = async (password,hashedPassword)=>{
    try {
const isMatch = await bcrypt.compare(password,hashedPassword);
return isMatch;     
    } catch (Error) {
    throw new Error('faield comparePassword'); 
    }
}

module.exports = hashedPassword,comparePassword;
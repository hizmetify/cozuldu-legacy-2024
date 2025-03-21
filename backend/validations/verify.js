const jwt = require('jsonwebtoken');  
const verify = (req,res,next) => {
//   try {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Çerezin içinden "token" değerini al
    const token = cookies.split('; ').find(row => row.startsWith('token='));
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Found" });
    }

    // "token=" kısmını kaldır
    const jwtToken = token.split('=')[1];

    // Token doğrulama işlemi
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgisini req içine ekle 
    next();
//   } catch (error) {
//     return res.send('Access Denied: No Token Provided');
    
//   }
};


module.exports=verify
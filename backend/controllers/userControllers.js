const User = require("../models/user"); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const decodedId=async(req)=>{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return decoded.id
    
}
const userInfoUpdate=async(req,res)=>{
    // try{
        let {email,name,lastname,phone,city,profilePic,portfolioLink}=req.body
        let decoded=await decodedId(req)
        const user = await User.findById(decoded).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
        }
        letUpdateData={
            email:email!=""?email:user?.email,
            name:name!=""?name:user?.name,
            lastname:lastname!=""?lastname:user?.lastname,
            phone:phone!=""?phone:user?.phone,
            city:city!=""?city:user?.city,
            profilePic:profilePic!=""?profilePic:user?.profilePic,
            portfolioLink:portfolioLink!=""?portfolioLink:user?.portfolioLink
        }
        let response=await User.findByIdAndUpdate(user?._id,{$set:letUpdateData},{new:true})
        if(!response){
            return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
        }
        return res.status(200).json({ message: 'success' });
    // }catch(error){
    //     return res.json(error)
    // }
    
}

const userPasswordUpdate=async(req,res)=>{
    // try{
        
        
        let {nowPassword,newPassword}=req.body
        let decoded=await decodedId(req)
        const user = await User.findById(decoded)  
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
        } 
        const isMatch=await bcrypt.compare(nowPassword,user?.password)
        if (isMatch){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            let response=await User.findByIdAndUpdate(user?._id,{password:hashedPassword},{new:true})
            
            console.log(response);
            if(!response){
                return res.status(500).json({message:'Şifre Güncellenmedi. Tekrar deneyin'})
            }
            return res.status(200).json({message:'güncelleme işlemi başarılı'})
        }else{
            return res.status(401).json({message:'Şifre doğru değil.'})
        }
    // }catch(error){
    //     return res.json(error)
    // }
}
module.exports={
    userInfoUpdate,
    userPasswordUpdate
}
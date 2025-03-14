const Ad = require("../models/ad");
const Logs = require("../models/logs");
const User = require("../models/user");
const jwt = require('jsonwebtoken'); 
const decodedId = async (req) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const logAction=async(req,res)=>{
    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }

    const date = new Date(Date.now());
    let {adId,category}=req.body
    let adids =await Ad.findById(adId) 
    
    let value={

    }
    if(category=='whatsapp'){
        value={
            category,
            text:`belirtilen id'bilgisine sahip kişi ${date.toLocaleString('tr-TR', { year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit'})} zamanında ${adids?.user?._id} sine sahip kişi ile whatsapptan etkileşime girdi `,
            user:user?._id
        }
    }
    else if(category=='phone'){
        value={
            category,
            text:`belirtilen id'bilgisine sahip kişi ${date.toLocaleString('tr-TR', { year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit'})} zamanında ${adids?.user?._id} sine sahip kişi ile telefon numarasından etkileşime girdi `,
            user:user?._id
        }
    }
    else if(category=='email'){
        value={
            category,
            text:`belirtilen id'bilgisine sahip kişi ${date.toLocaleString('tr-TR', { year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit'})} zamanında ${adids?.user?._id} sine sahip kişi ile emailden etkileşime girdi `,
            user:user?._id
        }
    }
    const newLogs=await Logs.create(value)  
}
const logGet=async(req,res)=>{
    let result=await Logs.find()
    return res.json(result)
}
module.exports={
    logAction,
    logGet
}
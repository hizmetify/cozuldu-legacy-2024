const express = require("express");
const { 
} = require("../controllers/adControllers"); 
const { PostAdmin, GetAdmin, DeleteAdmin, PutAdmin } = require("../controllers/adminControllers");
const verify = require("../validations/verify");
const { Admin } = require("../models/admin");
const generateToken = require("../utils/generateToken");  
const bcrypt = require('bcryptjs');
const SSS = require("../models/sss");
const router = express.Router();
router.get("/allSSS",async(req,res)=>{
    return res.json(await SSS.find(req.query))
})
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const admin=await Admin.findOne({email})
    console.log(admin);
    if(!admin )
        return res.json({message:'Admin Bulunamadı!'})
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) 
        return res.status(401).json({ message: 'Hatalı email veya password'});
    const token = generateToken(admin._id);
    res.cookie('token', token, {
         httpOnly: true,
         secure: false,
         sameSite: 'Lax', 
        });
    res.status(201).json({ message: 'Başarıyla giriş yapıldı.', token, admin: admin });
    return
})
router.post("/:action",verify,PostAdmin)
router.get("/:action",verify, GetAdmin);
router.delete("/:action",verify,DeleteAdmin)
router.put("/:action",verify,PutAdmin) 

module.exports = router;

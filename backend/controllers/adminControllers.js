const { Admin } = require("../models/admin");
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken"); 

const User = require("../models/user");
const SSS = require("../models/sss");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory"); 
const Ad = require('../models/ad');
const { errorMessages } = require("../middlewares/errorMessageMiddleware");

const GetAdmin=async(req,res)=>{
    const {action}=req.params  
    let result
    switch(action){
        case 'getAdmins':
            result=await Admin.find(req.query)
            break
        case 'allUsers':
            result=await User.find(req.query)
            break
        case 'allSSS':
            result=await SSS.find(req.query)
            break
        case 'allCategory':
            result=await Category.find(req.query)
            break
        case 'allSubCategory':
            result=await SubCategory.find(req.query)
        default:
            break
        
    }
    return res.json(result)
}
const PostAdmin=async(req,res)=>{
    try{
        const {action}=req.params  
        switch(action){
            case 'createAdmin':
                if ( !req.body.email || !req.body.password ) {
                    return res.json({ message: errorMessages.MISSING_FIELDS });
                } 
                const admins=await Admin.findOne({email:req.body.email})
                if(admins)
                    return res.json({message:'Bu email zaten mevcut'})
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                const result=new Admin({email:req.body.email,password:hashedPassword})
                const savedUser = await result.save();
                const tokens = generateToken(savedUser._id);
                
                res.cookie('token', tokens, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            
                res.status(201).json({ message: 'Başarıyla kayıt oldunuz.', tokens,data:result });
                if(!result)
                    return res.json({message:'Kayıt işlemi başarısız!'})
                return res.json(result)
            case 'createSSS': 
                if(!req.body.title || !req.body.text){
                    return res.json({message:'Validation error'})
                }
                const sss=await SSS({title:req.body.title,text:req.body.text})
                const savedSSS=await sss.save()
                return res.json(sss)
            case 'createCategory':
                const isNameAvailable=await Category.findOne({name:req.body.name})
                if(!req.body.name || isNameAvailable)
                    return res.json({message:'Validation error or Name available'})
                const category=await Category({name:req.body.name})
                const savedCategory=await category.save()
                return res.json(category)
            case 'createSubCategory':
                console.log(req.body.category);
                
                const isSubNameAvailable=await SubCategory.findOne({category:req.body.category,name:req.body.name})
                if(!req.body.name || !req.body.category || isSubNameAvailable)
                    return res.json({message:'Validation error or Name available'})
                const subCategory=await SubCategory({name:req.body.name,category:req.body.category})
                const savedSubCategory=await subCategory.save()
                return res.json(subCategory)
            default:
                return res.json({message: errorMessages.INVALID_REQUEST})
        }
    }catch(error){
        return res.json({message: errorMessages.SERVER_ERROR})
    }
}
const PutAdmin=async(req,res)=>{
    const {action}=req.params
    switch(action){
        case 'updateSSS':
            const sss=await SSS.findById(req.body.ssId)
            if(!req.body.ssId || !sss)
                return res.json({message:'Validation error SSS not found'})
            const updateSSS=await SSS.findByIdAndUpdate(sss._id,{title:req.body.title,text:req.body.text},{new:true})
            await updateSSS.save()
            return res.json(updateSSS)
        case 'updateAddStatus':
             const adId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(adId)) {
            return res.json({ message: errorMessages.POST_NOT_FOUND});
            }
            const { status } = req.body;
            const existingAd = await Ad.findById(adId);
            if (!existingAd) {
              return res.json({ message: errorMessages.POST_NOT_FOUND});
            }
            existingAd.status = status;
                
            await existingAd.save();
                
            return res.status(200).json({
              message: 'İlan başarıyla güncellendi',
              data: existingAd
            });
        case 'updateCategory':
            const cateogryId=req.params
            if(!cateogryId)
                return res.json({message:'Validation error'})
            const updateCateogry=await Category.findByIdAndDelete(cateogryId,{name:req.body.name},{new:true})
            updateCateogry.save()
            return res.json(updateCateogry) 
        case 'updateSubCategory':
            const subCateogryId=req.params
            if(!subCateogryId)
                return res.json({message:'Validation error'})
            const updateSubCateogry=await Category.findByIdAndDelete(subCateogryId,{name:req.body.name,category:req.body.category},{new:true})
            updateSubCateogry.save()
            return res.json(updateSubCateogry) 
    }
}
const DeleteAdmin=async(req,res)=>{
    const {action}=req.params 
    switch(action){
        case 'allDeleteAdmin':
            const deleteAdmins = await Admin.deleteMany()
            return res.json(deleteAdmins)
        case 'deleteCategory':
            const category=await Category.findOne({name:req.body.name})
            const otherCategory=await Category.findOne({name:'Diğer'})
            if(!category || !otherCategory)
                return res.json({ message: errorMessages.CATEGORY_NOT_FOUND});
            const subCategory=await SubCategory.updateMany({category:category._id},{category:otherCategory._id})
            await subCategory.save()
            const deleteCateogry = await Category.deleteOne({ name: req.body.name });
            console.log(deleteCateogry); // Silinen kayıt sayısını kontrol et

            if (deleteCateogry.deletedCount === 0) {
                 return res.json({ message: errorMessages.CATEGORY_NOT_FOUND});
            } 
            return res.json({ message: "Category deleted successfully" });
        case 'deleteSubCategory':
            const subsCategory=await SubCategory.deleteOne({_id:req.body.id})
            if (subsCategory.deletedCount === 0) {
                 return res.json({ message: errorMessages.CATEGORY_NOT_FOUND});
            } 
            return res.json({ message: "Category deleted successfully" });
        case 'deleteSSS':
            const sss=await SSS.deleteOne({_id:req.body.id})
            if(sss.deletedCount===0){
                return res.json({message: errorMessages.SSS_NOT_FOUND})
            }
            return res.json({message:"SSS deleted successfully"})
    }
}
module.exports={
    GetAdmin,
    PostAdmin,
    PutAdmin,
    DeleteAdmin
}
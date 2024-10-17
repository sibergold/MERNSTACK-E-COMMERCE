import Coupon from '../models/couponModel.js'

export const getCoupon = async(req,res)=>{
    try {
        const coupon = await Coupon.find({userId:req.user._id,isActive:true})
        res.json(coupon || null)
    } catch (error) {
        console.log("Error in getCoupon controller",error.message)
        res.status(500).json({message:"Server error",error:error.message})
    }
}

export const validateCoupon = async (req,res)=>{
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code,userId:req.user._id,isActive:true})
        if(!coupon)
        {
            return res.status(404).json({message:"Coupon not found"})
        }
        if(coupon.expirationDate < new Date())
        {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message:"Coupon expired"})
        }
        res.json({message:"Coupon is valid",code:coupon.code,discountPercentage:coupon.discountPercentage})
    } catch (error) {
        console.log("Error in validateCoupon",error.message)
        res.status(500).json({message:"Server error",error:error.message})
    }
}
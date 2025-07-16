import jwt from 'jsonwebtoken'

// Hardcoded admin credentials
const ADMIN_EMAIL = 'thetee545@gmail.com';
const ADMIN_PASSWORD = 'Thetee@123#';

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if (token_decode !== ADMIN_EMAIL + ADMIN_PASSWORD) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth
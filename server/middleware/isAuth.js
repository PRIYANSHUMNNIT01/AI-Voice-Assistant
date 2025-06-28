import jwt from 'jsonwebtoken'
const isAuth =async (req,res,next)=>{
    try {
        const token = req.cookies.token
        // console.log(req.cookies)
        if(!token){
            return res.status(200).json(null);
        }
        const verifyToken =await jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifyToken.userId;
        next()
    } catch (error) {
        console.log(error);
    }
}
export default isAuth

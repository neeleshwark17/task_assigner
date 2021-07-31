require("dotenv").config();

const jwt=require("jsonwebtoken")
const requireAuth=function(req,res,next){
    const token=req.cookies.jwtLogin;

    if(!token || token==null) res.redirect('/');
    else{
        jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
            if(err) throw err;
            else{
                console.log(decodedToken)
                next()
            }
        })
    }
}

module.exports={requireAuth};
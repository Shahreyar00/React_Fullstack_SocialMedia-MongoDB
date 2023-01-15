import jwt from "jsonwebtoken";

// export const verifyToken = async (req, res, next) => {
//     try {
//         let token = req.header("Authorization");

//         if (!token) {
//             return res.status(403).send("Access Denied");
//         }

//         if (token.startsWith("Bearer ")) {
//             token = token.slice(7, token.length).trimLeft();
//         }

//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

export const verifyToken = async(req, res, next) => {
    try{
        const authHeader = req.header("Authorization");
        if(authHeader){
            const token = authHeader.split(" ")[1];
            jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
                if(err) return res.status(403).json("Token is not valid!");
                req.user = user;
                next();
            });
        } else{
            return res.status(401).json("You are not authenticated!");
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};
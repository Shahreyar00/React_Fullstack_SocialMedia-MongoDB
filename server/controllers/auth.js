import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register User
export const register = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;    

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation, 
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};

// Login 
// export const login = async(req, res) => {
//     try{
//         const userCheck = await User.findOne({ email: req.body.email });
//         if(!userCheck) return res.status(404).json({ msg: "User does not exist." });

//         const isPasswordCorrect = await bcrypt.compare(req.body.password, userCheck.password);
//         if(!isPasswordCorrect) return res.status(400).json({ msg: "Invalid credentials." });

//         const token = jwt.sign(
//             { id: userCheck._id },
//             process.env.JWT_SECRET
//         );

//         const { password, ...user } = userCheck._doc;
//         res.status(200).json({ token, user });
//     }catch(err){
//         res.status(500).json({ error: err.message });
//     }
// };

// You should remove the password and then send the data to the frontend as
// it can be a security risk if exposed. Here I have shown two ways to remove password
// before sending them to the frontend.

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
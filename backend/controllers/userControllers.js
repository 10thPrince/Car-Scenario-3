import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @desc register a new user
// route POST /user/
// @access Public
export const register = async(req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "Please fill in all required Fields(Name, Email, Password)"});
        }

        //Check user existance
        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(400).json({success: false, message: "User Already Exist please LogIn Instead!"})
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name, 
            email, 
            password: hashedPassword
        }

        const createdUser = await User.create(newUser);

        if(createdUser){
            res.status(201).json({
                success: true, 
                message: "User Created Successfull", 
                name: createdUser.name,
                email: createdUser.email
            })
        }else{
            res.status(400).json({success: false, message: "Invalid data"})
        }

    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "System Error Please check the Console!"})
    }
}
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// @desc register a new user
// route POST /user/
// @access Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all required Fields(Name, Email, Password)" });
        }

        //Check user existance
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ success: false, message: "User Already Exist please LogIn Instead!" })
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            password: hashedPassword
        }

        const createdUser = await User.create(newUser);

        if (createdUser) {
            res.status(201).json({
                success: true,
                message: "User Created Successfull",
                name: createdUser.name,
                email: createdUser.email
            })
        } else {
            res.status(400).json({ success: false, message: "Invalid data" })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}

// @desc login a user
// route POST /user/login
// @access Public
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success: false, message: "Please fill in all required Fields(Email, Password)"})
        }

        //check user existance

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success: false, message: "User Do not Exist. Please Register"});
        }

        if(user && (await bcrypt.compare(password, user.password))){
            res.status(200).json({
                success: true, 
                message: "User Logged In Successfully",
                name: user.name,
                email: user.email
            })
        }else(
            res.status(400).json({
                success: false,
                message: "Invalid Inputs(Password)"
            })
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}
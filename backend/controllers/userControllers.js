import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import RevokedToken from "../models/revokedTokenModel.js";

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
            const token = generateToken(createdUser._id);
            res.status(201).json({
                success: true,
                message: "User Created Successfull",
                name: createdUser.name,
                email: createdUser.email,
                token
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all required Fields(Email, Password)" })
        }

        //check user existance

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User Do not Exist. Please Register" });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.status(200).json({
                success: true,
                message: "User Logged In Successfully",
                name: user.name,
                email: user.email,
                token
            })
        } else (
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

// @desc logout a user
// route POST /user/logout
// @access Private
export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const revoke = await RevokedToken.create({ token })


        res.status(200).json({ success: true, message: "User Logged Out Successful", revoke });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}

// @desc get all users
// route GET /user/all
// @access Private
export const getAll = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({success: true, message: "Users Retrived Successful", user: req.user.name, data: users});
    } catch (error) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}

// @desc get current  user's profile
// route GET /user/
// @access Private
export const getMe = async (req, res) => {
    try{
        const id = req.user._id

        const user = await User.findById(id).select('-password');
        res.status(200).json({success: true, message: "User Retrived Successfull", data: user})
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })
    }
}
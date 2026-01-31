import e from "express";
import { register } from "../controllers/userControllers.js";

const router = e.Router();

router.post('/', register)

export default router
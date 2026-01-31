import e from "express";
import { login, register } from "../controllers/userControllers.js";

const router = e.Router();

router.post('/', register);
router.post('/login', login);

export default router
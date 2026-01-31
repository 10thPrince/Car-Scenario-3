import e from "express";
import { getAll, getMe, login, logout, register } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = e.Router();

router.post('/', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/all', protect, getAll);
router.get('/', protect, getMe)

export default router
import express from "express";
import { refreshToken } from "../controllers/refreshToken.js";
import { getUsers, addUser, getUserById, login, logout } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.get('/users/:id_user', verifyToken, getUserById)
router.post('/users', verifyToken, addUser)
router.post('/login', login)
router.get('/token', refreshToken)
router.delete('/logout', logout)
export default router
import { Router } from "express";
import { loginUser, logoutUser, refreshToken, registerUser, changePassword, updateAvatar ,updateCoverImage, currentUser,getUserChannelProfile} from "../controllers/user.controller.js";
const router= Router();
import {upload} from '../middlewares/multer.middlewares.js';
import multer from 'multer'
import { verifyJWT } from "../middlewares/auth.middlewares.js";

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser,
    
    )

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshToken);
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/currentUser").get(currentUser)
router.route("/update-avatar").post(verifyJWT,
    upload.single('avatar'),
    updateAvatar);
router.route("/update-coverImage").post(verifyJWT,
    upload.fields("coverImage"),
    updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
export default router;
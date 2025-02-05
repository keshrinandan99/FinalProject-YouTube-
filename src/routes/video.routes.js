import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { getAllVideo, publishAVideo } from "../controllers/video.controller.js";
//import videoRouter from "../routes/video"
const router=Router();
router.use(verifyJWT);

router
.route("/")
.get(getAllVideo)
.post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:'thumbnail',
            maxCount:1
        }
    ]),
    publishAVideo,
);

export default router;
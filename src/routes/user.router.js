import {Router} from "express"
import { registeruser, loginuser, logoutuser } from "../controllers/user.controller.js" 
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registeruser
)

router.route("/login").post(upload.none(), loginuser)


//secured routes

router.route("/logout").post(verifyJWT, logoutuser)


export default router

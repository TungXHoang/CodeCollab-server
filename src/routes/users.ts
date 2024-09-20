
import express, { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { getAllUser, getSingleUser, registerUser, loginUser, logoutUser, authenticateUser,updateUserInfo,updateUserAvatar } from "../controllers/users";
import { uploadImage } from "../aws-s3"


const router: Router = express.Router();
 
router
	.route("/register")
	.post(
		//validateRegister, // JOI valiation later
		registerUser as unknown as RequestHandler
);


router.route("/login").post(loginUser as RequestHandler);
router.route("/logout").post(logoutUser as RequestHandler);
router.route("/auth").post(authenticateUser as RequestHandler);
router.route("/getall").get(getAllUser);
router.route("/single/:userEmail").get(getSingleUser)
router.route("/update").post(updateUserInfo);
router.route("/update-avatar").post(uploadImage.single("image"), updateUserAvatar as unknown as RequestHandler);
export = router;

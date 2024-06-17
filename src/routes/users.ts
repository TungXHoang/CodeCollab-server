
import express, { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { registerUser, loginUser, logoutUser } from "../controllers/users";

// multer for multipart/formdata
import multer from "multer";

const router: Router = express.Router();
 
router
	.route("/api/users/register")
	.post(
		multer().none(),
		registerUser as RequestHandler
	);

router.route("/api/users/login").post(loginUser as RequestHandler);
router.route("/api/users/logout").post(logoutUser as RequestHandler);
// router.route("/api/users/auth").post(authenticateUser as RequestHandler);
// router.route("/api/users/:userId/:thumbnailDim").get(fetchUser as RequestHandler);

export = router;

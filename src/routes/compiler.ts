import express, { Router } from "express";
import { handleCompile } from "../controllers/compiler"

const router: Router = express.Router();

router.route("/submit").post(handleCompile);

export = router;
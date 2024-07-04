import express, { Router } from "express";
import { handleCompile, checkStatus } from "../controllers/compiler"

const router: Router = express.Router();

router.route("/submit").post(handleCompile);
router.route("/status").post(checkStatus);

export = router;
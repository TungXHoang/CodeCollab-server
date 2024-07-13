import express, { Router } from "express";
import { updateDoc, getDoc} from "../controllers/docs"

const router: Router = express.Router();

router.route("/save").post(updateDoc)
router.route("/get").get(getDoc);
export = router;
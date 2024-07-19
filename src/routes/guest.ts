import express, { Router } from "express";
import {  getGuestList } from "../controllers/guests"

const router: Router = express.Router();


router.route("/:projectId").get(getGuestList)
export = router;
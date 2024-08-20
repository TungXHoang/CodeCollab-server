import express, { Router } from "express";
import {  getGuestList,deleteGuest } from "../controllers/guests"

const router: Router = express.Router();

router.route("/:projectId").get(getGuestList).delete(deleteGuest);
export = router;
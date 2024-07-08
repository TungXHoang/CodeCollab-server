import express, { Router } from "express";
import { getProjects, createProject } from "../controllers/projects"

const router: Router = express.Router();

router.route("/").get(getProjects).post(createProject);

export = router;
import express, { Router } from "express";
import { getProjects, createProject, deleteProject } from "../controllers/projects"

const router: Router = express.Router();

router.route("/").get(getProjects).post(createProject).delete(deleteProject);

export = router;
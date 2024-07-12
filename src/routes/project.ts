import express, { Router } from "express";
import { getUserProjects, getProject, createProject, deleteProject } from "../controllers/projects"

const router: Router = express.Router();

router.route("/").get(getUserProjects).post(createProject).delete(deleteProject);
router.route("/:projectId").get(getProject)
export = router;
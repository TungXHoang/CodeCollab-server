import express, { Router } from "express";
import { getUserProjects, getProject, createProject, deleteProject, shareProject } from "../controllers/projects"

const router: Router = express.Router();

router.route("/").post(createProject).delete(deleteProject);
router.route("/share").post(shareProject);
router.route("/:userId").get(getUserProjects)
router.route("/single/:projectId").get(getProject)

export = router;
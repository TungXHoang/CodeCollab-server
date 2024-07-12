import {Project} from "../models/projects";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/users";

export const getUserProjects = async (req: Request, res: Response) => {
	try {
		const loggedInUser = req.user as IUser;
		const filteredProject = await Project.find({ owner: loggedInUser._id })
		res.status(200).json(filteredProject);
	} catch (error) {
		console.error("Error in getUserProjects ", (error as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getProject = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId
		const returnProject = await Project.findById(projectId)
		res.status(200).json(returnProject);
	}
	catch (err) {
		console.error("Error in getProjects ", (err as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
	
}

export const createProject = async (req: Request, res: Response) => {
  try {
    let project = new Project(req.body);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the project.' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
	try {
		const { userId, projectId } = req.body
		const deleteProject = await Project.findById(projectId);
		if (userId == deleteProject.owner.toString()) {
			await deleteProject.deleteOne();
			res.status(200).json({message:"Delete Successfully"})
		}
		else {
			res.status(500).json({message:"Must be owner in order to delete"})
		}
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while deleting the project.' });
	}
}
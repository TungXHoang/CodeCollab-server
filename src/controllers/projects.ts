import {Project} from "../models/projects";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/users";

export const getProjects = async (req: Request, res: Response) => {
	try {
		const loggedInUser = req.user as IUser;
		const filteredProject = await Project.find({ owner: loggedInUser._id })
		// console.log(filteredProject);
		res.status(200).json(filteredProject);
	} catch (error) {
		console.error("Error in getProjects ", (error as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
};

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
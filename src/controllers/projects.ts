import { Project, GuestList } from "../models/projects";
import { User } from "../models/users";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/users";
import { codeSnippets } from "../constants";
import { MongoError } from 'mongodb';

export const getUserProjects = async (req: Request, res: Response) => {
	try {
		const loggedInUser = req.user as IUser; //fix this
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
		const returnProject = await Project.findById(projectId).populate("owner");
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
		if (project.language in codeSnippets) {
			// add default code.
			project.code = codeSnippets[project.language]
		}
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
			res.status(404).json({message:"Must be owner in order to delete"})
		}
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ error: 'An error occurred while deleting the project.' });
	}
}

export const shareProject = async (req: Request, res: Response) => {
	try {
		const { ownerId, guestEmail, projectId } = req.body;
		const shareProject = await Project.findById(projectId);

		if (shareProject.owner.toString() == ownerId) {
			const guestUser = await User.findOne({ email: guestEmail });
			if (!guestUser) {
				res.status(404).json({ error: "The user does not exist" })
			}
			else {
				let guest = new GuestList({ guestId: guestUser._id, projectId: projectId });
				const newGuest = await guest.save();
				res.status(200).json({});
			}
		}
		else {
			res.status(401).json({error: "You are not authorized to share"})
		}
		
	}
	catch (err) {
		// dup key 
		if ((err as MongoError).code === 11000) {
			res.status(405).json({ error: 'The users is already a guest of the project' });
		}
		console.log(err);
		res.status(500).json({ error: 'An error occurred while sharing the project.' });
	}
}
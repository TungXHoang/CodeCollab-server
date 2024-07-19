import {Project} from "../models/projects";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/users";

export const updateDoc =  async (req: Request, res: Response)=> {
	const { doc, projectId } = req.body;
	const project = await Project.findOneAndUpdate({_id: projectId}, {code: doc}, { new: true });
	return res.status(201).json(project);
} 

export const getDoc = async (req: Request, res: Response) => {
	const { projectId } = req.body;
	const doc = await Project.findById(projectId)
	res.status(200).json(doc.code);
}
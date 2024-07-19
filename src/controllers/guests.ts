import {  GuestList } from "../models/projects";
import { Request, Response, NextFunction } from "express";
import { MongoError } from 'mongodb';

export const getGuestList = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId
		const GuestsList = await GuestList.find({ projectId: projectId })
		res.status(200).json(GuestsList);
	}
	catch (err) {
		console.error("Error in getProjects ", (err as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
	
}
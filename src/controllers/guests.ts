import {  GuestList } from "../models/projects";
import { Request, Response, NextFunction } from "express";
import { MongoError } from 'mongodb';

export const getGuestList = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId
		const GuestsList = await GuestList.find({ project: projectId }).populate("guest")
		return res.status(200).json(GuestsList);
	}
	catch (err) {
		console.error("Error in getGuests ", (err as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
	
}

export const deleteGuest = async (req: Request, res: Response) => {
	const {projectId, guestId} = req.body;
	try {
		const guest = await GuestList.findOneAndDelete({ project: projectId, guest: guestId })
		console.log(guest);
		return res.status(200).json(guest);
	}
	catch (err) {
		console.error("Error in deleteGuest ", (err as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
}
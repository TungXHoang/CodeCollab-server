import axios, {AxiosError} from "axios";
import { Request, Response, NextFunction } from "express";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		return res.sendStatus(403);
	}
	
}
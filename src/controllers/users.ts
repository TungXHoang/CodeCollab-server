import { Request, Response, NextFunction,RequestHandler } from "express";

import { User, IUser } from "../models/users";
import { MongoError } from 'mongodb';
import passport from "passport";
import dotenv from "dotenv"
dotenv.config();

interface ExtendedFile {
	location: string;
	key: string;
}

interface AuthenticatedRequest extends Request { //for TS
	// isAuthenticated(): boolean;
	login(user: IUser, done: (err: any) => void): void;
	login(
		user: IUser,
		options: passport.AuthenticateOptions,
		done: (err: any) => void
	): void;
	logout(callback: (err: any) => void): void;
	logout(options: passport.LogOutOptions, done: (err: any) => void): void;
	user?: IUser;
	
}


export const authenticateUser = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		if (req.user) { // req.user create by pasportJS 
			const userObj = req.user.toObject();
			return res.json({
				...userObj,
				auth: true
			});
		}
		console.log("user has been change")
		return res.json({ auth: false, _id: "", lastName: "", firstName : "", email:"" });
	} catch (e) {
		console.log(e);
	}
};

export const logoutUser = ( req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    req.session.destroy(err => {
      if (err) {
        return console.log(err);
    }
    });
    if (err) {
      return next(err);
    }
  });
    return res.json({ auth: true, msg: "Logout success" });
};


export const registerUser = async ( 
	req: AuthenticatedRequest, res: Response
) => { 
  try {
		const { email, lastName, firstName, password } = req.body;
		// const uploadedFile = req.file as unknown as ExtendedFile;
		const avatar =
			{ //default image
				url: process.env.AWS_DEFAULT_URL,
				filename: process.env.AWS_DEFAULT_FILENAME,
			};
		const thumbnailUrl = process.env.ImageKit_Endpoint! + avatar.filename + `?tr=w-${100},h-${100},f-png,lo-true` || "";
		const user = new User({ email, lastName, firstName, avatar, thumbnailUrl});
    await User.register(user, password, function (err, registeredUser) {
			if (err) {
				return res.send({err });
			} else {
					// proceed with login
				req.login(registeredUser, (err) => {
					if (err) {
						return res.send(err);
					}
					return res.status(200).send({
						auth: true,
						msg: "Register successfully",
					});
				});
			}
    });
	} catch (e) {
		res.send(e);
	}
}

export const loginUser = (
    req: Request, res: Response, next: NextFunction
) => {
	passport.authenticate("local", (_err: Error, user: IUser) => {
		try {
			if (!user)
				return res.status(200).json({
					//req.isAuthenticated() is to check if the users is ALREADY log in
					auth: req.isAuthenticated(),
					msg: "Username or Password is incorrect",
				});
			else {
				req.login(user, (err) => {			
					if (err) throw err;
					return res.status(200).json({
						auth: req.isAuthenticated(),
						msg: "login success",
					});
				});
			}
			} catch (err) {
				console.log(err);
			}
	})(req, res, next);
};

export const getAllUser = async (req: Request, res: Response) => {
	try {
		const allUsers = await User.find({});
		return res.status(200).json(allUsers);
	}
	catch (err) {
		console.log(err)
		return res.status(500).json({ msg: "Internal server erorr" });
	}
	
}

export const getSingleUser = async (req: Request, res: Response) => {
	try {
		const userEmail = req.params.userEmail;
		const user = await User.findOne({ email: new RegExp(`^${userEmail}@`, 'i') });
		if (!user) {
			return res.status(404).json({message:"User not found"})
		}
		return res.status(200).json(user)
	}
	catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Internal server erorr" });
	}
}

export const updateUserInfo: RequestHandler = async (req: Request, res: Response) => {
	try {
		const { requestId, changeId, newEmail, newFirstName, newLastName } = req.body;
		if (requestId !== changeId){
			return res.status(404).json({ message: "Unauthorized action" });
		}

		const updatedUser =  await User.findOneAndUpdate(
			{ _id: changeId },
			{ email: newEmail, firstName: newFirstName, lastName: newLastName });
		
		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		req.session.passport.user = newEmail; //update session to prevent auto logouts
		return res.status(201).json({updatedUser:updatedUser, message:"Updated successfully"})


	} catch(err){
		if ((err as MongoError).code === 11000) {
      return res.status(405).json({ message:'A user with the given email is already registered'});
    }
		return res.status(500).json({ msg: "Internal server erorr" });
	}
}
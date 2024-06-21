import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/users";
import passport from "passport";


import dotenv from "dotenv"
import { disposeEmitNodes } from "typescript";

// dotenv.config();

// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/mernStack";


// interface ExtendedFile {
//     location: string;
//     key: string; // Make 'key' optional
// }

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
        if (req.isAuthenticated()) {
            return res.json({
                auth: true,
                user: req.user.email,
                id: req.user._id,
            });
        }
        return res.json({ auth: false, message: "cannot authenticate" });
    } catch (e) {
        console.log(e);
    }
};

export const logoutUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  req.logout(function (err) {
    req.session.destroy(msg => {
      if (msg) {
        return console.log(msg);
    }
    });
    if (err) {
      return next(err);
    }
  });
    res.json({ auth: true, msg: "Logout success" });
};

// export const fetchUser = async (req: Request, res: Response) => {
//     const { userId, thumbnailDim } = req.params;
//     const user = await User.findById(userId);
//     if (!user) {
//         return res.json({ msg: "User does not exist" });
//     }
//     const dim = parseInt(thumbnailDim, 10); //convert thumbnailDim to int
//     user._thumbnailSize = { width: dim, height: dim };
//     const foundUser = Object.assign({ thumbnail: user.thumbnail }, user._doc);
//     return res.json({ msg: "User found", user: foundUser });
// };

export const registerUser = async ( 
	req: AuthenticatedRequest, res: Response
) => { 
  try {
    const { email, lastName, firstName, password } = req.body;
    const user = new User({email, lastName, firstName });
    await User.register(user, password, function (err, registeredUser) {
        if (err) {
            return res.send({err });
        } else {
            // Registration successful, proceed with login
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
                res.json({
										//req.isAuthenticated() is to check if the users is ALREADY log in
                    auth: req.isAuthenticated(),
                    msg: "Username or Password is incorrect",
                });
            else {
                req.login(user, (err) => {
                    if (err) throw err;
                    res.json({
											auth: req.isAuthenticated(),
											msg: "login success",
                        // username: req.user.username,
                        // id: req.user._id,
                    });
                    console.log("login sucess");
                });
            }
        } catch (err) {
            console.log(err);
        }
    })(req, res, next);
};

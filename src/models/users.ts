
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

import mongoose, { Schema, PassportLocalDocument, } from "mongoose"
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

interface IUser extends PassportLocalDocument {
  _doc?: any;
  username: string; //?
  email: string;
  // avatar: {
  //     url: string;
  //     filename: string;
  // };
  // _thumbnailSize?: ThumbnailSize; // Optional as it's set virtually
  // thumbnail?: string; // This is the result of the virtual "thumbnail" property
}

UserSchema.plugin(passportLocalMongoose,{
	usernameField: 'email'
});

const User = mongoose.model('user', UserSchema);

export {User, IUser}
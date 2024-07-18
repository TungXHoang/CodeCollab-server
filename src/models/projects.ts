import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
	languageId: {
		type: Number,
		required: true
	},
	language: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	code: {
		type: String,
	},
	// collaborators: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: "User",
	// 	},
	// ],
}, { timestamps: true })


const guestListSchema = new mongoose.Schema({
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	guestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	})

// guestListSchema.set('autoIndex', false);
guestListSchema.index({ projectId: 1, guestId: 1 }, { unique: true});

const Project = mongoose.model("Project", projectSchema);
const GuestList = mongoose.model("GuestList", guestListSchema);

// GuestList.ensureIndexes(function(err) {
// 	if (err)
// 			console.log(err);
// 	else
// 			console.log('create profile index successfully');
// });


export {Project, GuestList};
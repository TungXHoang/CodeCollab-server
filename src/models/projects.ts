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
	description: {
		type: String,
		required: true,
	}
}, { timestamps: true })


const guestListSchema = new mongoose.Schema({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	guest: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
})

	
// virtual 

// guestListSchema.virtual('project',{
// 	ref: 'Project',
// 	localField: 'projectId',
// 	foreignField: '_id',
// 	justOne: true
// });

// guestListSchema.set('toObject', { virtuals: true });
// guestListSchema.set('toJSON', { virtuals: true });

const Project = mongoose.model("Project", projectSchema);
const GuestList = mongoose.model("GuestList", guestListSchema);
guestListSchema.index({ "project": 1, "guest": 1 }, { unique: true });

export {Project, GuestList};
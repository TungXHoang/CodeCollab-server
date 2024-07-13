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
		// required: true,
	},
	collaborators: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema);

export {Project};
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Snippet",
			default: []
		}
	]
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema);

export {Project};
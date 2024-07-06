import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
	owner: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}
	],
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Snippet",
			default: []
		}
	]
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema);

export default Project;
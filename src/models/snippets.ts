import mongoose from "mongoose"

const snippetSchema = new mongoose.Schema({
	message: {
		type: String,
		default: ""
	},
	language: {
		type: String,
		required: true
	}
}, { timestamps: true })

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;

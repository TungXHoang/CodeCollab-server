import axios, {AxiosError} from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config()

interface IRequestBody {
	language: {
		id: number,
		name: string,
		label: string,
		value: string
	}
	code: string
}

export const handleCompile = async(req: Request, res: Response) => {
	const { language, code }: IRequestBody = req.body;
	const formData = {
		language_id: language.id,
		source_code: btoa(code),
	};
	const options = {
		method: 'POST',
		url: process.env.RAPID_API_URL,
		params: { base64_encoded: 'true', fields: '*' },
		headers: {
			"content-type": "application/json",
			'Content-Type': 'application/json',
			'X-RapidAPI-Host': process.env.RAPID_API_HOST,
			'X-RapidAPI-Key': process.env.RAPID_API_KEY,
		},
		data: formData,
	};

	try {
		const response = await axios.request(options);
		console.log('res.data', response.data);
		const token = response.data.token;
		res.json({ token });
			// You can call checkStatus(token) here if needed
	} catch (err) {
		if (err instanceof AxiosError) {
			let error = err.response ? err.response.data : err;
			console.log(err);
			res.status(500).json({ err });
		}
		else {
			console.log('Unexpected error', err)
		}
	}
};

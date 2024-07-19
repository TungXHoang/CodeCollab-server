import axios, {AxiosError} from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config()

interface IRequestBody {
	languageId: number
	code: string
}

export const handleCompile = async(req: Request, res: Response) => {
	const { languageId, code }: IRequestBody = req.body;
	const formData = {
		language_id: languageId,
		source_code: btoa(code),
	};
	// console.log(formData);
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
		const token = response.data.token;
		res.json({ token });
		return response;
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

export const checkStatus = async (req:Request, res: Response) => {
	const {token} = req.body
	const options = {
		method: "GET",
		url: process.env.RAPID_API_URL + "/" + token,
		params: { base64_encoded: "true", fields: "*" },
		headers: {
			"X-RapidAPI-Host": process.env.RAPID_API_HOST,
			"X-RapidAPI-Key": process.env.RAPID_API_KEY,
		},
	};
	const pollStatus = async (): Promise<any> => {
		try {
			const response = await axios.request(options);
			const statusId = response.data.status?.id;

			if (statusId === 1 || statusId === 2) {
				// still processing, wait and then check again
				await new Promise(resolve => setTimeout(resolve, 2000));
				return await pollStatus();
			} else {
				// Processed - we have a result
				return response.data;
			}
		} catch (err) {
			console.log("err", err);
			throw new Error("An error occurred while checking the status.");
		}
	};

	try {
		const result = await pollStatus();
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
};

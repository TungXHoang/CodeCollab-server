import { Project, GuestList } from "../models/projects";
import { User } from "../models/users";
import { Request, Response, NextFunction } from "express";
import { codeSnippets } from "../constants";
import { MongoError } from 'mongodb';
import { mdb,db } from "../index"
import { formatDistanceToNow } from 'date-fns';
import * as Y from 'yjs'
const yUtils = require("y-websocket/bin/utils");

export const getUserProjects = async (req: Request, res: Response) => {
	// get all projects that the user own or is a guest of
	try {
		const userId = req.params.userId;
		let OwnedProjects = await Project.find({ owner: userId }).populate("owner")

		//clean up guest project, populate both guest info and project info
		let GuestProjects = await GuestList.
			find({ guest: userId })
			.populate({
				path: 'project',
				populate: {
					path: 'owner',
					model: 'User'
				}
			});

		OwnedProjects = OwnedProjects.map(project => {
			return {
				...project.toObject(),
				updatedAt: formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
			};
		});
	
		GuestProjects = GuestProjects.map(guestItem => {
			const project = guestItem.projectId;
			return {
				...project.toObject(),
				updatedAt: formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
			};
		});

		return res.status(200).json({owner: OwnedProjects, guest:GuestProjects});
	} catch (error) {
		console.error("Error in getUserProjects ", (error as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getProject = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.projectId
		const returnProject = await Project.findById(projectId).populate("owner");
		return res.status(200).json(returnProject);
	}
	catch (err) {
		console.error("Error in getProjects ", (err as Error).message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const createProject = async (req: Request, res: Response) => {
  try {
		let project = new Project(req.body);
		project.description = `${project.title} program run on CodeCollab`
		let newProject = await project.save();
		await newProject.populate("owner");
		
		newProject = {
			...newProject.toObject(),
			updatedAt: formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })
		}
		if (project.language in codeSnippets) {
			//load default code via YJS 
			const persistenceDoc = await mdb.getYDoc(newProject._id.toString());
			const ytext = persistenceDoc.getText("monaco")
			ytext.insert(0, codeSnippets[project.language]);
			const newUpdates = Y.encodeStateAsUpdate(ytext.doc!);
			mdb.storeUpdate(newProject._id.toString(), newUpdates);
		}

		return res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the project.' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
	try {
		const { userId, projectsId } = req.body

		if (!Array.isArray(projectsId) || projectsId.length === 0) {
			return res.status(400).json({ message: "No projects provided for deletion." });
		}

		for (const projectId of projectsId) {
			const deleteProject = await Project.findById(projectId)
			if (!deleteProject) {
				return res.status(404).json({ message: `Project with ID ${projectId} not found.` });
			}
			if (userId == deleteProject.owner.toString()) {
				await GuestList.deleteMany({ project: projectId })
				await deleteProject.deleteOne();
				// delete YJS persistence doc
				await mdb.clearDocument(projectId);
			}
			else {
				return res.status(404).json({message:"Must be owner in order to delete"})
			}
		}
		
		return res.status(200).json({ message: "Delete Successfully" })
	}
	catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'An error occurred while deleting the project.' });
	}
}

export const shareProject = async (req: Request, res: Response) => {
  try {
    const { ownerId, guestEmail, projectId } = req.body;
		const shareProject = await Project.findById(projectId).populate("owner");

    if (!shareProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

		// Only owner can share 
    if (shareProject.owner._id.toString() !== ownerId) {
      return res.status(401).json({ message: 'You are not authorized to share' });
		}
		
		// Cannot add yourself to the guest lists
		if (shareProject.owner.email === guestEmail) {
			return res.status(404).json({ message: "Please enter appropriate user's email" });
		}

		// User does not exist
    const guestUser = await User.findOne({ email: guestEmail });
    if (!guestUser) {
      return res.status(404).json({ message: 'The user does not exist!' });
    }

    const guest = new GuestList({ guest: guestUser._id, project: projectId });
    await guest.save();

    return res.status(201).json({ message: 'Shared successfully', guest: guestUser });
  } catch (err) {
    if ((err as MongoError).code === 11000) {
      return res.status(405).json({ message: 'The user is already a guest of the project' });
    }

    console.error('Error sharing project:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
	//Only for updating title and description
	try {
		const { userId, projectId, newTitle, newDescription } = req.body;
		const updatedProject = await Project.findOneAndUpdate(
			{ _id: projectId, owner: userId },
			{ title: newTitle, description: newDescription },
			{ new: true }
		);

		if (!updatedProject) {
			return res.status(404).json({message:"Project not found or unauthorized action"})
		}

		return res.status(200).json({message:"Project updated successfully", project:updatedProject})
	}
	catch (e) {
		console.error('Error updating project:', e);
    return res.status(500).json({ message: 'Internal server error.' });
	}
}

// const validateObjectId = (value:string) => {
//   const regex = new RegExp(/^[a-fA-F0-9]{24}$/);

//   if (value !== "" && typeof value === "string") {
// 		const result = value.match(regex);
// 		if (result){
// 			return (result?.length > 0);
// 		}
//   }
//   return false 
// };

// export const deleteCollectionsNotInProject = async (req: Request, res: Response) => {
//   try {
//     // Connect to your MongoDB database
//     // List all collections
//     const collections = await db.listCollections()

//     // Fetch all project _id values
// 		const projectIds = await Project.find({}, { _id: 1 });
//     const projectIdSet = new Set(projectIds.map((doc: { _id: { toString: () => any; }; }) => doc._id.toString()));

//     // Loop through each collection
//     for (const collection of collections) {
//       const collectionName = collection.name;
//       // Check if the collection name is a valid ObjectId
//       if (validateObjectId(collectionName)) {
//         // If the collection name (valid ObjectId) is NOT found in the project _id set
//         if (!projectIdSet.has(collectionName)) {
//           // Drop the collection
//           await db.collection(collectionName).drop();
//           console.log(`Deleted collection: ${collectionName}`);
//         }
//       }
// 		}

// 		return res.status(200).json({message:"Delete YJS doc successfully"})
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };


export const saveProject = async (req: Request, res: Response) => {
	try {
		const { docName } = req.body
		const ydoc = new Y.Doc()
		const persistedYdoc = await mdb.getYDoc(docName);
		// get the state vector so we can just store the diffs between client and server
		const persistedStateVector = Y.encodeStateVector(persistedYdoc);
		const diff = Y.encodeStateAsUpdate(ydoc, persistedStateVector);

		// store the new data in db (if there is any: empty update is an array of 0s)
		if (diff.reduce((previousValue, currentValue) => previousValue + currentValue, 0) > 0)
			mdb.storeUpdate(docName, diff);

		// send the persisted data to clients
		Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

		// store updates of the document in db
		ydoc.on('update', async (update) => {
			mdb.storeUpdate(docName, update);
		});

		// cleanup some memory
		persistedYdoc.destroy();

		return res.status(200).json({message:"Project updated successfully"})
		}
	catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal server error.' });
	}
}
	
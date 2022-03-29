import { MongoClient } from "mongodb";
require("dotenv").config();
const authKey = process.env.AUTH_KEY;

async function handler(req, res) {
	if (req.method === "POST") {
		const data = req.body;
		const { title, image, address, description } = data;
		const client = await MongoClient.connect(
			`mongodb+srv://${authKey}@cluster0.seh7p.mongodb.net/meetups?retryWrites=true&w=majority`
		);
		const db = client.db();

		const meetupsCollections = db.collection("meetups");
		const result = await meetupsCollections.insertOne(data);
		console.log(result);
		client.close();
		res.status(201).json({ message: "Meetup Inserted" });
	}
}

export default handler;

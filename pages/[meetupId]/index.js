import { MongoClient, ObjectId } from "mongodb";
import React from "react";
import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from "next/head";

const MeetupDetails = (props) => {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content={props.meetupData.description}></meta>
			</Head>
			<MeetupDetail
				img={props.meetupData.image}
				title={props.meetupData.titel}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
};

export async function getStaticPaths() {
	require("dotenv").config();
	const authKey = process.env.AUTH_KEY;
	const client = await MongoClient.connect(
		`mongodb+srv://${authKey}@cluster0.seh7p.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupsCollections = db.collection("meetups");
	const meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();
	client.close();

	return {
		paths: meetups.map((meetup) => {
			return { params: { meetupId: meetup._id.toString() } };
		}),
		fallback: false,
	};
}

export async function getStaticProps(context) {
	require("dotenv").config();
	const authKey = process.env.AUTH_KEY;
	const meetupId = context.params.meetupId;
	const client = await MongoClient.connect(
		`mongodb+srv://${authKey}@cluster0.seh7p.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupsCollections = db.collection("meetups");
	const selectedMeetup = await meetupsCollections.findOne({ _id: ObjectId(meetupId) });
	client.close();
	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;

import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import React from "react";
import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				></meta>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
};

// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;
// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }

export async function getStaticProps() {
	require("dotenv").config();
	const authKey = process.env.AUTH_KEY;
	const client = await MongoClient.connect(
		`mongodb+srv://admin-Yuki:yuki1116@cluster0.seh7p.mongodb.net/meetups?retryWrites=true&w=majority`
	);
	const db = client.db();
	const meetupsCollections = db.collection("meetups");
	const meetups = await meetupsCollections.find().toArray();
	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => {
				const { title, address, image } = meetup;
				return {
					title,
					address,
					image,
					id: meetup._id.toString(),
				};
			}),
		},
		revalidate: 10,
	};
}

export default HomePage;

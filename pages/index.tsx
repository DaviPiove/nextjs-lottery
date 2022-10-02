import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "../components/header";
import { LotteryEntrance } from "../components/lotteryentrance";
//import { ManualHeader } from "../components/manualheader";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Smart Contract Lottery</title>
				<meta name="description" content="Smart Contract Lottery" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<LotteryEntrance />
		</div>
	);
};

export default Home;

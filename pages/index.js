import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
	const [Loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	useEffect(() => {
		const getAllReportCategories = async () => {
			const response = await fetch("http://localhost:5000/api/v1/reports");
			const data = await response.json();

			setLoading(true);
			setData(data.reports);
		};
		getAllReportCategories();
		setLoading(false);
	}, []);

	const categories = data.map((report) => {
		return {
			category: report.category,
			imgUrl: report.imgUrl,
		};
	});
	// add unique categories  to an array
	const uniqueCategories = [
		...new Set(categories.map((category) => category.category)),
	];

	// finds all unique imgUrl's in the report data
	const uniqueImgUrls = [
		...new Set(categories.map((category) => category.imgUrl)),
	];
	// create an array of objects with the category name and imgUrl
	const categoryImgUrls = uniqueCategories.map((category, index) => {
		return {
			category,
			imgUrl: uniqueImgUrls[index],
		};
	});

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="shopify node and nextjs app" />
			</Head>

			<main className={styles.main}>
				<div className={styles.grid}>
					{/* loops through all categories and imgUrls and creates a card component for each cat and adds the matching image */}
					{categoryImgUrls.map((category) => {
						return (
							<Link
								href={`/category/${category.category}`}
								key={category.category}>
								<a className={styles.card}>
									<h3>{category.category}</h3>
									<img src={category.imgUrl} alt={category.category} />
								</a>
							</Link>
						);
					})}
				</div>
			</main>
		</div>
	);
}

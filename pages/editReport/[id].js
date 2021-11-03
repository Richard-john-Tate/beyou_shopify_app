import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Home.module.css";

const SingleReport = () => {
	const [report, setReport] = useState({});
	const batchIdRef = useRef();
	const certificateRef = useRef();
	const linksRef = useRef();
	const router = useRouter();
	const id = router.query.id;

	// fetch all the data from database
	useEffect(() => {
		const fetchReport = async () => {
			const response = await fetch(
				`http://localhost:5000/api/v1/reports/${id}`,
			);
			const data = await response.json();
			setReport(data.report);
		};
		fetchReport();
	}, [id]);

	const handleChange = (e) => {
		setReport({ ...report, [e.target.id]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const enteredData = {
			category: report.category,
			imgUrl: report.imgUrl,
			batchId: batchIdRef.current.value,
			certificates: certificateRef.current.value,
			links: linksRef.current.value,
		};
		console.log(JSON.stringify(enteredData));
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<form
					className="form-control"
					onSubmit={handleSubmit}
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-evenly",
						alignItems: "flex-start",
						minHeight: "50vh",
						minWidth: "30vw",
					}}>
					<label htmlFor="bacthId">Batch ID</label>
					<input
						type="text"
						value={report?.batchId}
						className={styles.input}
						id="batchId"
						onChange={handleChange}
						ref={batchIdRef}
					/>
					<label htmlFor="certificates">Certificate</label>
					<input
						type="text"
						value={report?.certificates}
						className={styles.input}
						id="certificates"
						onChange={handleChange}
						ref={certificateRef}
					/>
					<label htmlFor="links">Links</label>
					{/*  out a input tag for each link in the links array */}

					<input
						type="text"
						className={styles.input}
						id="links"
						value={report?.links}
						onChange={handleChange}
						ref={linksRef}
					/>

					<div className={styles.btn_control}>
						<button type="submit" className={styles.btnAdd}>
							Submit
						</button>
						<Link href={report.category ? `/category/${report.category}` : "/"}>
							<button type="button" className={styles.btnEdit}>
								Cancel
							</button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SingleReport;

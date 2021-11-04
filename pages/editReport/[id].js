import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import LoadingPage from "../../components/LoadingPage";

const SingleReport = () => {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  const batchIdRef = useRef();
  const certificateRef = useRef();
  const linksRef = useRef();
  const cannabinoidRef = useRef();
  const cbdPercentageRef = useRef();
  const cbdMGRef = useRef();
  const router = useRouter();
  const id = router.query.id;

  // fetch all the data from database
  useEffect(() => {
    setLoading(true);
    const fetchReport = async () => {
      const response = await fetch(`/api/v1/reports/${id}`);
      const data = await response.json();
      setReport(data);
    };
    setLoading(false);
    fetchReport();
  }, [id]);

  const handleChange = (e) => {
    setReport({ ...report, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      batchId: batchIdRef.current.value,
      certificates: certificateRef.current.value,
      links: linksRef.current.value,
      cannabinoid: cannabinoidRef.current.value,
      cbdPercentage: cbdPercentageRef.current.value,
      cbdMG_ML: cbdMGRef.current.value,
      imgUrl: report.imgUrl,
      category: report.category,
    };

    await fetch(`/api/v1/reports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data);

    router.push(`/category/${report.category}`);
  };

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && (
        <div className="container">
          <div className="card">
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
              }}
            >
              <label htmlFor="bacthId">Batch ID</label>
              <input
                type="text"
                value={report?.batchId}
                id="batchId"
                onChange={handleChange}
                ref={batchIdRef}
              />
              <label htmlFor="certificates">Certificate</label>
              <input
                type="text"
                value={report?.certificates}
                id="certificates"
                onChange={handleChange}
                ref={certificateRef}
              />
              <label htmlFor="links">Links</label>
              <input
                type="text"
                id="links"
                value={report?.links}
                onChange={handleChange}
                ref={linksRef}
              />
              <label htmlFor="cannbinoid">Cannabinoid</label>
              <input
                type="text"
                id="cannabinoid"
                onChange={handleChange}
                ref={cannabinoidRef}
                value={report?.cannabinoid}
              />
              <label htmlFor="cbdPercentage">% (W/W)</label>
              <input
                type="text"
                id="cbdPercentage"
                onChange={handleChange}
                ref={cbdPercentageRef}
                value={report?.cbdPercentage}
              />
              <label htmlFor="mgPerBottle">mg/30ml bottle</label>
              <input
                type="text"
                id="mgPerBottle"
                onChange={handleChange}
                ref={cbdMGRef}
                value={report?.cbdMG_ML}
              />
              <div className="btn_control">
                <button type="submit" className={styles.btnAdd}>
                  Submit
                </button>
                <Link
                  href={report.category ? `/category/${report.category}` : "/"}
                >
                  <button type="button" className="btnEdit">
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleReport;

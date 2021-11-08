import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import EditForm from "../../components/EditForm";
import LoadingPage from "../../components/LoadingPage";

const SingleReport = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchId: "",
    category: "",
    certificates: "",
    links: "",
    cbdPercentage: "",
    cbdMG_ML: "",
    imgUrl: "",
  });

  const router = useRouter();
  const id = router.query.id;

  // fetch all the data from database
  useEffect(() => {
    setLoading(true);
    const fetchReport = async () => {
      const response = await fetch(`/api/v1/reports/${id}`);
      const data = await response.json();
      setFormData(data);
    };
    setLoading(false);
    fetchReport();
  }, [id]);

  return (
    <Fragment>
      {loading && <LoadingPage />}
      {!loading && <EditForm formData={formData} setFormData={setFormData} />}
    </Fragment>
  );
};

export default SingleReport;

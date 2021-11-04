import React, { useRef, useState } from "react";
import Link from "next/link";

const AddNew = ({ catData, handleShow }) => {
  const batchIdRef = useRef();
  const certificateRef = useRef();
  const linksRef = useRef();
  const cannabinoidRef = useRef();
  const cbdPercentageRef = useRef();
  const cbdMGRef = useRef();

  const CatName = catData.map((cat) => cat.category);
  const CatImg = catData.map((cat) => cat.imgUrl);

  const [formData, setFormData] = useState({
    category: "",
    imgUrl: "",
    batchId: "",
    certificate: "",
    links: "",
    cannabinoid: "",
    cbdPercentage: "",
    cbdMG_ML: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/v1/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: CatName,
        imgUrl: CatImg,
        batchId: formData.batchId,
        certificates: formData.certificate,
        links: formData.links,
        cannabinoid: formData.cannabinoid,
        cbdPercentage: formData.cbdPercentage,
        cbdMG_ML: formData.cbdMG_ML,
      }),
    });
    // redirect to home page
    handleShow();
  };

  const handleChangeBatchId = (e) => {
    setFormData({ ...formData, batchId: e.target.value });
  };
  const handleChangeCertificate = (e) => {
    setFormData({ ...formData, certificate: e.target.value });
  };
  const handleChangeLinks = (e) => {
    setFormData({ ...formData, links: e.target.value });
  };
  const handleChangeCannabinoid = (e) => {
    setFormData({ ...formData, cannabinoid: e.target.value });
  };
  const handleChangeCBDPercentage = (e) => {
    setFormData({ ...formData, cbdPercentage: e.target.value });
  };
  const handleChangeCBDMG_ML = (e) => {
    setFormData({ ...formData, cbdMG_ML: e.target.value });
  };

  return (
    <div className="container">
      <h1>Add New {CatName}</h1>
      <div className="card">
        <form className="form-control" onSubmit={handleSubmit}>
          <label htmlFor="bacthId">Batch ID</label>
          <input
            type="text"
            className="input"
            id="batchId"
            onChange={handleChangeBatchId}
            ref={batchIdRef}
            value={formData.batchId}
          />
          <label htmlFor="certificates">Certificate</label>
          <input
            type="text"
            className="input"
            id="certificates"
            onChange={handleChangeCertificate}
            ref={certificateRef}
            value={formData.certificate}
          />
          <label htmlFor="links">Links</label>
          {/*  out a input tag for each link in the links array */}

          <input
            type="text"
            id="links"
            onChange={handleChangeLinks}
            ref={linksRef}
            value={formData.links}
          />
          <label htmlFor="cannbinoid">Cannabinoid</label>
          <input
            type="text"
            id="cannabinoid"
            onChange={handleChangeCannabinoid}
            ref={cannabinoidRef}
            value={formData.cannabinoid}
          />
          <label htmlFor="cbdPercentage">% (W/W)</label>
          <input
            type="text"
            id="cbdPercentage"
            onChange={handleChangeCBDPercentage}
            ref={cbdPercentageRef}
            value={formData.cbdPercentage}
          />
          <label htmlFor="mgPerBottle">mg/30ml bottle</label>
          <input
            type="text"
            id="mgPerBottle"
            onChange={handleChangeCBDMG_ML}
            ref={cbdMGRef}
            value={formData.cbdMG_ML}
          />
          <div className="btn_control">
            <button type="submit" className="btnAdd">
              Submit
            </button>
            <Link href={`/`}>
              <button type="button" className="btnEdit">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNew;

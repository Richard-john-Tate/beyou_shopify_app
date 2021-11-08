import React, { useState, useRef } from "react";
import { Page, Card, Form, FormLayout, Button } from "@shopify/polaris";
import router from "next/router";

const EditForm = ({ formData, setFormData }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      batchId: e.target.batchID.value,
      certificates: e.target.certificates.value,
      cbdMG_ML: e.target.cbdMG_ML.value,
      cannabinoid: e.target.cannabinoid.value,
      cbdPercentage: e.target.cbdPercentage.value,
      links: e.target.links.value,
      category: formData.category,
      imgUrl: formData.imgUrl,
    });

    // make a post request to the server
    await fetch(`/api/v1/reports/${formData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log("formData", formData);
    router.push("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Page
      narrowWidth
      breadcrumbs={[
        {
          content: "Back",
          onAction: () => router.push(`/category/${formData.category}`),
        },
      ]}
    >
      <Card>
        <Card.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <label htmlFor="batchID">Batch ID</label>
              <input
                name="batchID"
                type="text"
                id="batchID"
                value={formData.batchId}
                onChange={handleChange}
              />
              <label htmlFor="certificates">Certificates</label>
              <input
                name="cerificates"
                id="certificates"
                type="text"
                value={formData.certificates}
                onChange={handleChange}
              />
              <label htmlFor="cbdMG_ML">CBD mg/ml</label>
              <input
                name="cbdMG_ML"
                type="text"
                value={formData.cbdMG_ML}
                id="cbdMG_ML"
                onChange={handleChange}
              />
              <label htmlFor="cannabinoid">Cannabinoid</label>
              <input
                name="cannabinoid"
                type="text"
                value={formData.cannabinoid}
                id="cannabinoid"
                onChange={handleChange}
              />
              <label htmlFor="cbdpercentage">CBD Percentage</label>
              <input
                id="cbdPercentage"
                name="cbdPercentage"
                value={formData.cbdPercentage}
                type="text"
                onChange={handleChange}
              />
              <label htmlFor="links">Links</label>
              <input
                id="links"
                name="links"
                value={formData.links}
                type="text"
                onChange={handleChange}
              />
            </FormLayout>
            <div className="btn_control">
              <Button submit primary>
                Submit
              </Button>
              <Button
                onClick={() => router.push("/category/" + formData.category)}
              >
                Cancel
              </Button>
            </div>
          </Form>{" "}
        </Card.Section>
      </Card>
    </Page>
  );
};

export default EditForm;

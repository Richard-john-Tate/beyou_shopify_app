import React, { useState } from "react";
import {
  Form,
  Button,
  FormLayout,
  TextField,
  Card,
  Page,
} from "@shopify/polaris";

const AddNew = ({ catData, handleShow }) => {
  const CatName = catData.map((cat) => cat.category);
  const CatImg = catData.map((cat) => cat.imgUrl);

  const [formData, setFormData] = useState({
    category: CatName[0],
    imgUrl: CatImg[0],
    batchId: "",
    certificate: "",
    links: "",
    cannabinoid: "",
    cbdPercentage: "",
    cbdMG_ML: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/v1/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: formData.category,
        imgUrl: formData.imgUrl,
        batchId: formData.batchId,
        certificates: formData.certificate,
        links: formData.links,
        cannabinoid: formData.cannabinoid,
        cbdPercentage: formData.cbdPercentage,
        cbdMG_ML: formData.cbdMG_ML,
      }),
    });
    console.log(formData);
    // redirect to home page
    handleShow();
  };

  const handleChangeBatchId = (value) => {
    setFormData({ ...formData, batchId: value });
  };
  const handleChangeCertificate = (value) => {
    setFormData({ ...formData, certificate: value });
  };
  const handleChangeLinks = (value) => {
    setFormData({ ...formData, links: value });
  };
  const handleChangeCannabinoid = (value) => {
    setFormData({ ...formData, cannabinoid: value });
  };
  const handleChangeCBDPercentage = (value) => {
    setFormData({ ...formData, cbdPercentage: value });
  };
  const handleChangeCBDMG_ML = (value) => {
    setFormData({ ...formData, cbdMG_ML: value });
  };

  return (
    <Page
      title={`Add New ${CatName}`}
      narrowWidth
      breadcrumbs={[{ content: "Back", onAction: () => handleShow() }]}
    >
      <Card>
        <Card.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                type="text"
                label="Batch ID"
                value={formData.batchId}
                onChange={handleChangeBatchId}
              />
              <TextField
                type="text"
                label="Certificate"
                value={formData.certificate}
                onChange={handleChangeCertificate}
              />

              <TextField
                type="text"
                label="Links"
                value={formData.links}
                onChange={handleChangeLinks}
              />
              <TextField
                type="text"
                label="Cannabinoid"
                value={formData.cannabinoid}
                onChange={handleChangeCannabinoid}
              />
              <TextField
                type="text"
                label="CBD Percentage"
                value={formData.cbdPercentage}
                onChange={handleChangeCBDPercentage}
              />
              <TextField
                type="text"
                label="MG/ML"
                value={formData.cbdMG_ML}
                onChange={handleChangeCBDMG_ML}
              />
            </FormLayout>
            <div className="btn_control">
              <Button submit primary>
                Submit
              </Button>
              <Button onClick={() => handleShow()}>Cancel</Button>
            </div>
          </Form>{" "}
        </Card.Section>
      </Card>
    </Page>
  );
};

export default AddNew;

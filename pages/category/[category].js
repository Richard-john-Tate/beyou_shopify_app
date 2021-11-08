import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AddNew from "../../components/AddNew";
import LoadingPage from "../../components/LoadingPage";
import {
  ResourceList,
  Card,
  ResourceItem,
  TextStyle,
  Layout,
  Page,
} from "@shopify/polaris";

const ShowAllByCat = () => {
  const router = useRouter();
  const { category } = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getAllreportbyCat = async () => {
      const res = await fetch("/api/v1/reports");
      const data = await res.json();
      const filteredData = data.filter((item) => item.category === category);
      setData(filteredData);
    };

    getAllreportbyCat();
    setLoading(false);
  }, [category, setData, setLoading, setShowAddNew]);

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

  const handleAddNew = () => {
    setShowAddNew((showAddNew) => !showAddNew);
  };

  return (
    <Layout sectioned>
      {loading && <LoadingPage />}
      {!loading && !showAddNew ? (
        <Page
          breadcrumbs={[{ content: "Home", onAction: () => router.push("/") }]}
          title={`${category}`}
          primaryAction={{ content: "Add New", onAction: handleAddNew }}
        >
          <Layout.Section>
            <Card>
              <ResourceList
                showHeader={true}
                resourceName={{
                  singular: `${category}`,
                  plural: `${category}'s`,
                }}
                items={data}
                renderItem={(report) => {
                  const {
                    batchId,
                    category,
                    imgUrl,
                    certificates,
                    _id,
                  } = report;
                  const shortcutActions = [
                    {
                      content: "Edit",
                      onAction: () => router.push(`/editReport/${_id}`),
                    },
                  ];

                  return (
                    <ResourceItem
                      id={_id}
                      accessibilityLabel={`View details for ${batchId}`}
                      media={
                        <img
                          src={imgUrl}
                          alt={category}
                          style={{ width: "100px" }}
                        />
                      }
                      shortcutActions={shortcutActions}
                      accessibilityLabel={`View details for ${category}`}
                    >
                      <h3 style={{ marginTop: "1rem" }}>
                        <TextStyle variation="strong">
                          Batch No: {batchId}
                        </TextStyle>
                      </h3>
                      <div style={{ marginTop: "1rem", padding: "1rem 0" }}>
                        <p>{certificates}</p>
                      </div>
                    </ResourceItem>
                  );
                }}
              ></ResourceList>
            </Card>
          </Layout.Section>
        </Page>
      ) : (
        <AddNew handleShow={handleAddNew} catData={categoryImgUrls} />
      )}
    </Layout>
  );
};

export default ShowAllByCat;

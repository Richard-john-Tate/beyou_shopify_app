import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import AddNew from "../../components/AddNew";
import LoadingPage from "../../components/LoadingPage";

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
    <>
      {loading && <LoadingPage />}
      {!loading && (
        <div className="container">
          {!showAddNew ? (
            <main className="main">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <h1>{category}</h1>

                <button className="btnAdd" onClick={handleAddNew}>
                  Add New
                </button>

                <Link href="/">
                  <button className="btnEdit">Back</button>
                </Link>
              </div>
              <div className="gridList">
                {data.map((item, index) => {
                  return (
                    <div className={styles.card} key={index}>
                      <img src={item.imgUrl} alt={item.category} />
                      <div className="card_content">
                        <h3>{item.batchId}</h3>
                        <p>{item.certificates}</p>
                        {item.cannabinoid ? <p>{item.cannabinoid}</p> : null}
                        <Link href={`/editReport/${item._id}`}>
                          <button className="btnEdit">Edit</button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          ) : (
            <AddNew handleShow={handleAddNew} catData={categoryImgUrls} />
          )}
        </div>
      )}
    </>
  );
};

export default ShowAllByCat;

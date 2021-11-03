import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import AddNew from "../../components/AddNew";

const ShowAllByCat = () => {
  const router = useRouter();
  const { category } = router.query;
  const [data, setData] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getAllreportbyCat = async () => {
      const res = await fetch("http://localhost:5000/api/v1/reports");
      const data = await res.json();
      const filteredData = data.reports.filter(
        (item) => item.category === category
      );
      setData(filteredData);
    };
    getAllreportbyCat();
  }, [category]);

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
    <div className={styles.container}>
      {!showAddNew ? (
        <main className={styles.main}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <h1>{category}</h1>

            <button className={styles.btnAdd} onClick={handleAddNew}>
              Add New
            </button>

            <Link href="/">
              <button className={styles.btnEdit}>Back</button>
            </Link>
          </div>
          <div className={styles.gridList}>
            {data.map((item, index) => {
              return (
                <div className={styles.card} key={index}>
                  <img src={item.imgUrl} alt={item.category} />
                  <div className={styles.card_content}>
                    <h3>{item.batchId}</h3>
                    <p>{item.certificates}</p>
                    <Link href={`/editReport/${item._id}`}>
                      <button className={styles.btnEdit}>Edit</button>
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
  );
};

export default ShowAllByCat;

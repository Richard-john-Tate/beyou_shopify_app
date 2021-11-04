import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingPage from "../components/LoadingPage";

export default function Home() {
  const [Loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    const getAllReportCategories = async () => {
      const response = await fetch("/api/v1/reports");
      const data = await response.json();

      setData(data);
      setLoading(false);
    };
    getAllReportCategories();
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
    <>
      {Loading && <LoadingPage />}

      {!Loading && (
        <div className="container">
          <main className="main">
            <div className="grid">
              {/* loops through all categories and imgUrls and creates a card component for each cat and adds the matching image */}
              {categoryImgUrls.map((category, index) => {
                return (
                  <Link href={`/category/${category.category}`} key={index}>
                    <a className="card">
                      <h3>{category.category}</h3>
                      <img src={category.imgUrl} alt={category.category} />
                    </a>
                  </Link>
                );
              })}
            </div>
          </main>{" "}
        </div>
      )}
    </>
  );
}

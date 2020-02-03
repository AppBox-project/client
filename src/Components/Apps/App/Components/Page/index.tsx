import React, { useEffect, useState } from "react";
import { AppType } from "../../../../../Utils/Types";
import styles from "./styles.module.scss";
import ObjectPage from "./ObjectPage";
const Page: React.FC<{
  match: { params: { pageId } };
  setCurrentPage;
  app: AppType;
}> = ({
  match: {
    params: { pageId }
  },
  setCurrentPage,
  app
}) => {
  const page = app.data.pages ? app.data.pages[pageId] : undefined;

  // Lifecycle
  useEffect(() => {
    setCurrentPage(pageId);
    return () => {
      setCurrentPage(null);
    };
  }, [pageId]);

  // UI
  if (!page) {
    // Object page
    return (
      <div className={styles.root}>
        <ObjectPage />
      </div>
    );
  } else {
    // Defined page
    return <div className={styles.root}>To-do</div>;
  }
};

export default Page;

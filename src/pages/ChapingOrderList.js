import React from "react";
import url from "url";
import { useState, useEffect, useCallback } from "react";
import { Progress } from "antd";

const ChapingOrderList = ({ targetUrl, onCancel }) => {
  const [inProgress, setInProgress] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderIDs, setOrderIDs] = useState([]);

  const fetchOrderList = page => {
    targetUrl.query.page = page;
    console.log("requesting page: ", url.format(targetUrl));
    return fetch(url.format(targetUrl), {});
  };

  useEffect(async () => {
    setInProgress(true);
    setPercentage(0);
    setCurrentPage(0);
    const resultPromise = await fetchOrderList(0);
    const result = await resultPromise.json();
    setOrderIDs(["fo", "bar"]);
  }, [setInProgress, setPercentage, setCurrentPage]);

  const showProgressBar = useCallback(() => {
    return <Progress percent={percentage} steps={1} />;
  }, [percentage]);

  const showResultField = useCallback(() => {
    return (
      <input type="textarea" value={{ orderIDs }} onChange={() => {}}></input>
    );
  }, []);

  return inProgress ? showProgressBar() : showResultField();
};

export default ChapingOrderList;

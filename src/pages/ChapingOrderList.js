import React from "react";
import  url from 'url';
import { useState, useEffect, useCallback } from "react";
import { Progress } from "antd";

const ChapingOrderList = ({ targetUrl, onCancel }) => {
  const [inProgress, setInProgress] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderIDs, setOrderIDs] = useState([]);

  const fetchOrderList = async (page) => {
      console.log(targetUrl);
      targetUrl.query.page = page;
      const resp = await fetch(url.format(targetUrl), {});
      return await resp.json();
  }

  useEffect(() => {
    setInProgress(true);
    setPercentage(0);
    setCurrentPage(0);
    const res = fetchOrderList(0);
    console.log('111111111111')
    console.log(res)
    console.log('111111111111')
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

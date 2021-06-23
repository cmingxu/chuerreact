import React from "react";
import { useState, useEffect } from "react";
import { Layout, Button, Row, Col, message, Modal } from "antd";
import Store from "electron-store";
import { ipcRenderer } from "electron";
import ChapingOrderList from "./pages/ChapingOrderList";
import url from 'url';
const { Header, Footer, Content } = Layout;

const EventName = "OnCommentListRequest";
const CommentType = {
  CHAPING: "差评",
  ZHONGPING: "中评",
  YIGAI: "已改"
};

const store = new Store();
// only in this page, orders list request fired.
const DEFAULT_PAGE_URL = store.get("firstLaunchPageURL");

const App = () => {
  const [isDefaultPage, setIsDefaultPage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentListURL, setCommentListURL] = useState("");
  const [commentListRequestSeen, setCommentListRequestSeen] = useState(false);
  const [currentCommentFetchType, setCurrentCommentFetchType] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (!commentListRequestSeen) {
      ipcRenderer.on(EventName, (event, args) => {
        // 好评
        // https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=0&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=722835723182&_signature=_02B4Z6wo00101YHGUtgAAIDBlKCBoZUw-SGBwlZAAAC906iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq32b

        //  中评
        // https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=1&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=723304710966&_signature=_02B4Z6wo00101GVW.KgAAIDAcDAv0RGywEBlUvgAAHmg06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq3d8

        // 差评
        // Request URL: https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=2&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=723617812911&_signature=_02B4Z6wo00101CU6wQwAAIDAMFwSdpRhdowlPsWAAGmK06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq36b

        // Request URL: https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=1&filter=0&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=724114985542&_signature=_02B4Z6wo0010183Y3XwAAIDD2L4OBNeAPnPN3NnAAJPE06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq370

        console.log(args);
        console.log(args.url);
        setCommentListURL(args.url);
        setCommentListRequestSeen(true);
      });
    }

    return () => {
      ipcRenderer.removeAllListeners(EventName);
    };
  }, [setCommentListRequestSeen, setCommentListURL]);

  useEffect(() => {
    setIsDefaultPage(window.location.href == DEFAULT_PAGE_URL);
  }, [setIsDefaultPage]);

  const goToDefaultPage = () => {
    window.location.href = DEFAULT_PAGE_URL;
  };


  const showModal = commentType => {
    setIsModalVisible(true);
    setCurrentCommentFetchType(commentType);
    console.log(getModalTitle());
    setModalTitle(getModalTitle());
  };

  const handleCancel = () => {
    console.log("cancel");
    setIsModalVisible(false);
  };

  const getModalTitle = () => {
    switch (currentCommentFetchType.toString()) {
      case CommentType.CHAPING:
        return "提取差评订单ID";
      case CommentType.ZHONGPING:
        return "提取中评订单ID";
      case CommentType.YIGAI:
        return "提取已改订单ID";
    }
    return "提取订单ID";
  };

  return (
    <Layout>
      <Header>
        <h2 className="text-white" style={{ color: "white" }}>
          订单ID助手
        </h2>
      </Header>

      <Content style={{ paddingTop: "15px" }}>
        {!isDefaultPage && (
          <Row>
            <Col style={{ margin: "auto", padding: "5px" }}>
              <Button type="primary" onClick={() => goToDefaultPage()}>
                跳转至评论页面
              </Button>
            </Col>
          </Row>
        )}

        {isDefaultPage && (
          <>
            {Object.keys(CommentType).map(commentType => {
              return (
                <Row key={commentType}>
                  <Col style={{ margin: "auto", padding: "5px" }}>
                    <Button
                      type="primary"
                      shape="circle"
                      size="large"
                      danger
                      block
                      onClick={() => {
                        showModal(commentType);
                      }}
                    >
                      {CommentType[commentType]}订单
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </>
        )}

        {isModalVisible && (
          <Modal
            centered
            title={modalTitle}
            visible={isModalVisible}
            onCancel={handleCancel}
            closable={false}
            cancelText="取消"
          >
            <ChapingOrderList onCancel={ () => {}} targetUrl={url.parse(commentListURL, true)}></ChapingOrderList>
          </Modal>
        )}
      </Content>

      <Footer>@foobar123.com</Footer>
    </Layout>
  );
};

export default App;

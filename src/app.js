import React from "react";
import { useState, useEffect } from "react";
import { Layout, Button, Row, Col, message, Modal } from "antd";
import Store from "electron-store";
import { ipcRenderer } from "electron";
const { Header, Footer, Content } = Layout;

const EventName = "OnOrderListRequest";

const store = new Store();
// only in this page, orders list request fired.
const DEFAULT_PAGE_URL = store.get("firstLaunchPageURL");

const App = () => {
  const [isDefaultPage, setIsDefaultPage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderListURL, setOrderListURL] = useState("");
  const [orderListRequestSeen, setOrderListRequestSeen] = useState(false);

  useEffect(() => {
    if (!orderListRequestSeen) {
      ipcRenderer.on(EventName, (event, args) => {
        console.log(args);
        // 好评
        // https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=0&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=722835723182&_signature=_02B4Z6wo00101YHGUtgAAIDBlKCBoZUw-SGBwlZAAAC906iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq32b

        //  中评
        // https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=1&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=723304710966&_signature=_02B4Z6wo00101GVW.KgAAIDAcDAv0RGywEBlUvgAAHmg06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq3d8

        // 差评
        // Request URL: https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=2&filter=4&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=723617812911&_signature=_02B4Z6wo00101CU6wQwAAIDAMFwSdpRhdowlPsWAAGmK06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq36b

        // Request URL: https://fxg.jinritemai.com/product/tcomment/commentList?page=0&pageSize=20&rank=1&filter=0&id=&appid=1&__token=46cb84d6be9ff79acc5317d30c17228c&_bid=ffa_goods&_lid=724114985542&_signature=_02B4Z6wo0010183Y3XwAAIDD2L4OBNeAPnPN3NnAAJPE06iS44zOwZ7vNLJS-Ifnui1oTXc6xIqVRApOtUTwWlHwvYNd8PJqAU2RlKATTtoPpA2Km1y7Qdm6VPkJLdDyGpWQxSCB1H8M-Oq370

        setOrderListURL(args);
        setOrderListRequestSeen(true);
      });
    }

    return () => {
      ipcRenderer.removeAllListeners(EventName);
    };
  }, [setOrderListRequestSeen, setOrderListURL]);

  useEffect(() => {
    setIsDefaultPage(window.location.href == DEFAULT_PAGE_URL);
  }, [setIsDefaultPage]);

  const goToDefaultPage = () => {
    window.location.href = DEFAULT_PAGE_URL;
  };

  const listOrders = () => {
    message.success("foool");
    console.log("list orders");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    showModal();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <Header>
        <h2 className="text-white" style={{ color: "white" }}>
          订单ID助手
        </h2>
      </Header>

      <Content>
        {!isDefaultPage && (
          <Row>
            <Col>
              <Button type="primary" onClick={() => goToDefaultPage()}>
                跳转至评论页面
              </Button>
            </Col>
          </Row>
        )}

        {isDefaultPage && (
          <>
            <Row className='mx-auto'>
              <Col  className='mx-auto'>
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  block
                  size="large"
                  onClick={showModal}
                >
                  提取差评订单
                </Button>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  block
                  size="large"
                  onClick={showModal}
                >
                  提取中评订单
                </Button>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col>
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  block
                  size="large"
                  onClick={showModal}
                >
                  提取已改订单
                </Button>
              </Col>
            </Row>
          </>
        )}

        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Content>

      <Footer>@foobar123.com</Footer>
    </Layout>
  );
};

export default App;

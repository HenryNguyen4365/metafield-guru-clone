import { Page, Card, Layout, Button } from "@shopify/polaris";
import { navigate } from "@reach/router";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History } from "@shopify/app-bridge/actions";

const HomePage = ({ history }) => {
  const [open, setOpen] = useState(false);
  const navigateTo = useNavigate();

  return (
    <Page title="Metafields">
      <Layout>
        <Layout.Section oneHalf>
          <Card sectioned>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                navigateTo("/products");
                history.dispatch(History.Action.PUSH, "/products");
              }}
            >
              <img
                src="https://www.creativefabrica.com/wp-content/uploads/2018/12/T-shirt-icon-by-rudezstudio-2-580x386.jpg"
                width="auto"
                height={200}
                alt="Product"
              />
              <p
                style={{ fontSize: "30px", marginBottom: "20px" }}
                onClick={() => setOpen(true)}
              >
                Products
              </p>
            </div>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card sectioned>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                navigateTo("/shop");
                history.dispatch(History.Action.PUSH, "/shop");
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Shop.svg/1200px-Shop.svg.png"
                width="auto"
                height={200}
                alt="Shop"
              />
              <p style={{ fontSize: "30px", marginTop: "20px" }}>Shop</p>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;

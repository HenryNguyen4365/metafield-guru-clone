import { Page, Card, Layout, Button } from "@shopify/polaris";
import { navigate } from "@reach/router";

const HomePage = () => {
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
              onClick={() => navigate("/products")}
            >
              <img
                src="https://www.creativefabrica.com/wp-content/uploads/2018/12/T-shirt-icon-by-rudezstudio-2-580x386.jpg"
                width="auto"
                height={200}
                alt="Product"
              />
              <p style={{ fontSize: "30px" }}>Products</p>
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
              onClick={() => navigate("/shop")}
            >
              <img
                src="https://bytuong.com/wp-content/uploads/2017/08/cac-buoc-mo-cua-hang-kinh-doanh-bytuong-com-e1502770040233.jpg"
                width="auto"
                height={200}
                alt="Shop"
              />
              <p style={{ fontSize: "30px" }}>Shop</p>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;

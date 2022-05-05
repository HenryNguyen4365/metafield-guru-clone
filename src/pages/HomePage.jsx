import { Page, Card, Layout, Button } from "@shopify/polaris";
import { navigate } from "@reach/router";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useState } from "react";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const handleSelection = (resources) => {
    setOpen(false);
    navigate(
      `/products/metafields/${resources.selection
        .map((product) => product.id)[0]
        .replace("gid://shopify/Product/", "")}`
    );
  };
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
              <p
                style={{ fontSize: "30px", marginBottom: "20px" }}
                onClick={() => setOpen(true)}
              >
                Products
              </p>
            </div>
          </Card>
          {/* <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", marginTop: "10px"}}>
              <Button onClick={() => setOpen(true)}>Select Product</Button>
            </div> */}
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
      {/* <ResourcePicker
        resourceType="Product"
        showVariants={false}
        allowMultiple={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      /> */}
    </Page>
  );
};

export default HomePage;

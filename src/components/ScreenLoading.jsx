import { Spinner } from "@shopify/polaris";
import styled from "styled-components";

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: inherit;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScreenLoading = () => {
  return (
    <LoadingWrapper>
      <Spinner />
    </LoadingWrapper>
  );
};
export default ScreenLoading;

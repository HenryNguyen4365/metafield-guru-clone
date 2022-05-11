import { useMutation } from "@apollo/client";
import { Modal, TextContainer } from "@shopify/polaris";
import React from "react";
import { DELETE_METAFIELD } from "../shopify/shopify-api";

const DeleteModal = ({
  id,
  setActiveDeleteModal,
  setMtfData,
  mtfData,
  activeDeleteModal,
}) => {
  const toggleModalChange = () => setActiveDeleteModal((prev) => !prev);
  const [deleteMtf] = useMutation(DELETE_METAFIELD);
  const handleDelete = () => {
    deleteMtf({
      variables: { input: { id: id } },
    });
    const filterData = mtfData.filter((val) => val.id !== id);
    setMtfData(filterData);
    setActiveDeleteModal(false);
  };
  return (
    <Modal
      open={activeDeleteModal}
      onClose={toggleModalChange}
      title="Do you want to leave without saving?"
      primaryAction={{
        content: "Confirm",
        onAction: () => handleDelete(),
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: toggleModalChange,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>If you leave this page, any unsaved changes will be lost.</p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
};

export default DeleteModal;

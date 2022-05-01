import styled from "styled-components";

const TableWrapper = styled.table`
  width: 100%;
  th,
  td {
    text-align: left;
    padding: 1rem 0.75rem;
    border: none;
    border-bottom: 1px solid ${(e) => (e.bordered ? "#ebebeb" : "transparent")};
  }
  tr {
    ${(e) =>
      e.stripped_row
        ? `&:nth-child(even) td {
				background-color: #ebebeb;
			}`
        : ""}
  }
`;
const Table = ({ children, stripped_row, bordered }) => {
  return (
    <TableWrapper stripped_row={stripped_row} bordered={bordered}>
      {children}
    </TableWrapper>
  );
};

export default Table;

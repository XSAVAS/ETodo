// components/AddTable.js
import React from 'react';
import { Button } from 'reactstrap';

const AddTable = ({ onClick }) => {
  return (
    <div className="me-3 d-flex align-items-center">
      <Button color="success" onClick={onClick}>
        + Add New Table
      </Button>
    </div>
  );
};

export default AddTable;

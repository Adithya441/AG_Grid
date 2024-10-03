import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridComponent = () => {
  const [rowData, setRowData] = useState([
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Smith', age: 30 },
    { id: 3, name: 'Michael Johnson', age: 35 },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [showAge, setShowAge] = useState(true); // Example: Checkbox to show/hide 'Age' column

  // Column definitions (can dynamically hide the 'age' field based on showAge state)
  const columnDefs = [
    { field: 'id', headerName: 'ID', checkboxSelection: true },
    { field: 'name', headerName: 'Name' },
    ...(showAge ? [{ field: 'age', headerName: 'Age' }] : []), // Conditional 'Age' column
  ];

  const onSelectionChanged = (params) => {
    const selectedData = params.api.getSelectedRows();
    setSelectedRows(selectedData);
  };

  const handleCheckboxChange = (e) => {
    setShowAge(e.target.checked); // Control the display of the 'Age' column
  };

  return (
    <div>
      {/* Outer Checkboxes or Controls */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showAge}
            onChange={handleCheckboxChange}
          />
          Show Age Column
        </label>
      </div>

      {/* First AG Grid */}
      <div className="ag-theme-alpine" style={{ height: 200, width: 600 }}>
        <h3>First Grid (Select Rows)</h3>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </div><br/>

      {/* Button to Display Selected Rows */}
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => console.log(selectedRows)}>
          View Selected Rows in Console
        </button>
      </div>

      {/* Second AG Grid */}
      <div className="ag-theme-alpine" style={{ height: 200, width: 600 }}>
        <h3>Second Grid (Selected Data)</h3>
        <AgGridReact rowData={selectedRows} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default GridComponent;

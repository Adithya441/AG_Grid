import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const AGGridExample = () => {
  const [gridApi, setGridApi] = useState(null); // State for gridApi
  const [columnApi, setColumnApi] = useState(null); // State for columnApi

  const [columnDefs] = useState([
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' }
  ]);

  const [rowData] = useState([
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ]);

  // Store the APIs when the grid is ready
  const onGridReady = (params) => {
    console.log("onGridReady params: ", params); // Debugging to check params

    setGridApi(params.api);
    setColumnApi(params.columnApi);

    // Check if columnApi is defined
    if (params.columnApi) {
      console.log('Column API is available:', params.columnApi);
    } else {
      console.log('Column API is NOT available.');
    }
  };

  // Hide a specific column (for example: hide 'Model' column)
  const hideModelColumn = () => {
    if (columnApi) {
      columnApi.setColumnVisible('model', false); // Hide 'model' column
    } else {
      console.log('Column API is not available yet');
    }
  };

  // Show all columns (retrieve hidden columns)
  const showAllColumns = () => {
    if (columnApi) {
      const allColumns = columnApi.getAllColumns();
      allColumns.forEach((column) => {
        columnApi.setColumnVisible(column.getColId(), true);
      });
    } else {
      console.log('Column API is not available yet');
    }
  };

  return (
    <div>
      <button onClick={hideModelColumn}>Hide 'Model' Column</button>
      <button onClick={showAllColumns}>Show All Columns</button>

      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady} // Capture gridApi and columnApi
        ></AgGridReact>
      </div>
    </div>
  );
};

export default AGGridExample;

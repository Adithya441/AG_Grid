import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Using quartz theme

export function App() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDef, setColumnDef] = useState([
        {field: 'id'},        // Match the API field names exactly
        {field: 'name'},      // Ensure these match the data returned from API
        {field: 'email'},
        {field: 'address'},
        {field: 'phone'}
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true
    }), []);

    useEffect(() => {
        fetch('http://localhost:3003/users')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched Data:', data); // Check if data is correct
                setRowData(data); // Ensure rowData is being set properly
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const cellClickedListener = useCallback((e) => {
        console.log('cellClicked', e);
    }, []);

    return (
        <div className="ag-theme-quartz" style={{height: '500px', width: '100%'}}>
            <AgGridReact
                ref={gridRef}
                onCellClicked={cellClickedListener}
                rowData={rowData}
                animateRows={true}
                columnDefs={columnDef}
                defaultColDef={defaultColDef}
            />
        </div>
    );
}

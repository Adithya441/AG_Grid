import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Using quartz theme

export function App() {
    const gridRef = useRef();
    const gridApiRef = useRef(null); // Using a ref to hold the grid API
    const [rowData, setRowData] = useState([]);
    const [columnDef] = useState([
        { field: 'id' ,checkboxSelection:true},
        { field: 'name' },
        { field: 'email' },
        { field: 'address' },
        { field: 'phone' }
    ]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        editable: true,
        floatingFilter: true,
        flex: 1
    }), []);

    useEffect(() => {
        fetch('http://localhost:3004/users?_limit=50')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched Data:', data);
                setRowData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const cellClickedListener = useCallback((e) => {
        console.log('cellClicked', e);
    }, []);

    const onGridReady = (params) => {
        gridApiRef.current = params.api; // Store the API in a ref
    };

    const onExportClick = () => {
        if (gridApiRef.current) {
            gridApiRef.current.exportDataAsCsv(); // Use the ref to access the API
        } else {
            console.error('Grid API is not defined');
        }
    };

    return (
        <div>
            <button onClick={onExportClick} style={{ margin: '15px 15px' }}>Export</button>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    onCellClicked={cellClickedListener}
                    rowData={rowData}
                    animateRows={true}
                    columnDefs={columnDef}
                    defaultColDef={defaultColDef}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
}

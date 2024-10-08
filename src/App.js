import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import './App.css';

import loadingImage from './img2.gif';

export function App() {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    const columnDefs = [
        { field: "country", hide: true, rowGroup: true },
        { field: "year", hide: true },
        { field: "athlete" },
        { field: "sport" },
        { field: "total" },
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
    };

    const autoGroupColumnDef = {
        minWidth: 200,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Show spinner while data is loading
                const response = await fetch('https://www.ag-grid.com/example-assets/olympic-winners.json');
                const data = await response.json();
                setRowData(data); 
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Hide spinner when data is loaded
            }
        };
        fetchData();
    }, []);

    return (
        <div className="ag-theme-quartz" style={{ height: '500px', width: '100%', position: 'relative' }}>
            {loading ? (
                <div className="loading-overlay">
                    <img src={loadingImage} alt="Loading..." className="loading-spinner" />
                </div> // Use an image as the loading spinner
            ) : (
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    animateRows={true}
                />
            )}
        </div>
    );
}

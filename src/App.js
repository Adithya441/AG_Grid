import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import { sort } from 'fast-sort'; 
import './App.css'

import loadingImage from './img2.gif'

export function App() {
    const [rowData, setRowData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    const columnDefs = useMemo(() => [
        { field: 'id', sortable: true, checkboxSelection: true },
        { field: 'name', sortable: true },
        { field: 'email', sortable: true },
        { field: 'address', sortable: true },
        { field: 'phone', sortable: true }
    ], []);

    const sortWithFastSort = (data, sortModel) => {
        if (sortModel.length === 0) {
            return data;  // No sort applied
        }
        const sortCriteria = sortModel.map(sortItem => ({
            [sortItem.sort]: (row) => row[sortItem.colId]
        }));
        return sort(data).by(sortCriteria);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Show spinner while data is loading
                const response = await fetch('http://localhost:3004/users');
                const data = await response.json();
                setRowData(data); 
                setSortedData(data);
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
                    <img src={loadingImage} alt="Loading..." style={{ width: '50px', height: '50px' }} />
                </div> // Use an image as the loading spinner
            ) : (
                <AgGridReact
                    rowData={sortedData}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        flex: 1,
                        editable: true,
                        filter: true,
                        floatingFilter: true,
                        cacheQuickFilter: true
                    }}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={20}
                />
            )}
        </div>
    );
}

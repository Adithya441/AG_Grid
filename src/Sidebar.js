import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Using quartz theme
import loadingImage from './img2.gif'
import './Sidebar.css'
import { BsFilterRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";


export function SideBar() {
    const gridRef = useRef();
    const [gridApi, setGridApi] = useState(null);// Using a ref to hold the grid API
    const [columnApi, setColumnApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal,setModal] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [columnDef] = useState([
        { field: 'id' ,checkboxSelection:true, pinned:'left', cellEditorPopupPosition: 'under'},
        { field: 'name' },
        { field: 'email' },
        { field: 'address' },
        { field: 'phone' },
        { field: 'lastname'},
        { field: 'jobtitle'},
        { field: 'gender'},
        { field: 'zodiac'},
        { field: 'imei'},
    ]);

    const [checkboxState, setCheckboxState] = useState({
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        lastname:true,
        jobtitle: true,
        gender: true,
        zodiac: true,
        imei: true,
      });
    

    const gridOptions = {
        columnDefs: columnDef,
        rowSelection: {
            type: 'multiple', // Enable multiple row selection
            checkboxes: true, // Enable checkboxes for row selection
        },
    };

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        floatingFilter: true,
    }), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Show spinner while data is loading
                const response = await fetch('http://localhost:3004/users');
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


    const onGridReady = (params) => {
        setGridApi(params.api);
        setColumnApi(params.api);
    };


    const toggleColumnVisibility = (colId, e) => {
        console.log(checkboxState);
        if (columnApi) {
            setCheckboxState({
                ...checkboxState,
                [e.target.name]: e.target.checked,
              });
          const isVisible = columnApi.getColumnState().find(col => col.colId === colId).hide;
          columnApi.setColumnVisible(colId, isVisible);
        }
      };
  

    const onExportSelectedRows = () => {
        console.log(gridApi);
        if (gridApi) {
          const selectedNodes = gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          
    
          gridApi.exportDataAsCsv({
            onlySelected: true, // Export only the selected rows
            fileName: `${inputValue}.csv`, // CSV filename
          });
        } else {
          console.error("Grid API is not ready");
        }
      };


      const openNewTab = () => {
        if (!gridApi || !columnApi) return;
      
        // Get selected nodes (rows)
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
      
        // Get only the visible columns
        const visibleColumns = columnApi.getAllDisplayedColumns();
        const visibleColumnFields = visibleColumns.map(col => col.getColId());
      
        // Filter the selected row data to include only visible columns
        const filteredSelectedData = selectedData.map(row =>
          Object.keys(row)
            .filter(key => visibleColumnFields.includes(key)) // Include only visible columns
            .reduce((obj, key) => {
              obj[key] = row[key];
              return obj;
            }, {})
        );
      
        // Create new window/tab and display filtered data
        const newTab = window.open();
        newTab.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Selected Data</title>
              <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/styles/ag-grid.css" />
              <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/styles/ag-theme-quartz.css" />
              <script src="https://unpkg.com/ag-grid-community/dist/ag-grid-community.noStyle.js"></script>
              <link rel="stylesheet" href="Sidebar.css">
            </head>
            <body>
              <div id="newGrid" class="ag-theme-quartz" style="height: 300px; width: 100%;"></div>
              <script>
                const gridOptions = {
                  columnDefs: ${JSON.stringify(visibleColumns.map(col => ({ field: col.getColId(), headerName: col.getColDef().headerName })))},
                  rowData: ${JSON.stringify(filteredSelectedData)}
                };
      
                const eGridDiv = document.getElementById('newGrid');
                new agGrid.Grid(eGridDiv, gridOptions);
              </script>
            </body>
          </html>
        `);
        newTab.document.close(); // Important: close the document to render the content
      };
      
      

        const resetState = () => {
            console.log(checkboxState);
            setCheckboxState({
                id: true,
                name: true,
                email: true,
                address: true,
                phone: true,
                lastname:true,
                jobtitle: true,
                gender: true,
                zodiac: true,
                imei: true,
              });
              gridApi.resetColumnState();
        }

        const setpanel = () => {
            setModal(true);
        }

        const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onExportSelectedRows();
    setInputValue('')
  };

      

    return (
        <div className="table">
            {modal && (<div>
            <div className="btn">
                <input
                    type="text"
                    id="nameInput"
                    value={inputValue} // Bind value to state
                    onChange={handleChange} // Update state on change
                />
                 <button onClick={handleSubmit} style={{ marginLeft: '15px', marginRight:'15px' }}>Export</button>
                 <button onClick={() => resetState()} style={{marginRight:'10px'}}>
                    Reset
                </button>
                <button onClick={openNewTab} style={{marginRight:'30px'}}>Selected Data</button>
                <IoClose style={{marginRight:'30px', cursor:'pointer', marginTop:'5px'}} size={25} onClick={()=>setModal(false)}/>
            </div> 
            <div className="filter">
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="id"
                        name="id"
                        checked={checkboxState.id}
                        onChange={(e) => toggleColumnVisibility('id', e)}
                    />
                    <label htmlFor="idCheckbox">ID</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="name"
                        name="name"
                        checked={checkboxState.name}
                        onChange={(e) => toggleColumnVisibility('name', e)}
                    />
                    <label htmlFor="nameCheckbox">Name</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="email"
                        name="email"
                        checked={checkboxState.email}
                        onChange={(e) => toggleColumnVisibility('email', e)}
                    />
                    <label htmlFor="emailCheckbox">Email</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="address"
                        checked={checkboxState.address}
                        onChange={(e) => toggleColumnVisibility('address', e)}
                    />
                    <label htmlFor="nameCheckbox">Address</label>
                </div>
                
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="phone"
                        checked={checkboxState.phone}
                        onChange={(e) => toggleColumnVisibility('phone', e)}
                    />
                    <label htmlFor="nameCheckbox">Phone</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="lastname"
                        checked={checkboxState.lastname}
                        onChange={(e) => toggleColumnVisibility('lastname', e)}
                    />
                    <label htmlFor="nameCheckbox">Lastname</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="jobtitle"
                        checked={checkboxState.jobtitle}
                        onChange={(e) => toggleColumnVisibility('jobtitle', e)}
                    />
                    <label htmlFor="nameCheckbox">Jobtitle</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="gender"
                        checked={checkboxState.gender}
                        onChange={(e) => toggleColumnVisibility('gender', e)}
                    />
                    <label htmlFor="nameCheckbox">Gender</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="zodiac"
                        checked={checkboxState.zodiac}
                        onChange={(e) => toggleColumnVisibility('zodiac',e)}
                    />
                    <label htmlFor="nameCheckbox">Zodiac</label>
                </div>
                <div className="checkbox-item">
                    <input
                        type="checkbox"
                        id="nameCheckbox"
                        name="imei"
                        checked={checkboxState.imei}
                        onChange={(e) => toggleColumnVisibility('imei', e)}
                    />
                    <label htmlFor="nameCheckbox">Imei</label>
                </div>
            </div>
            </div>)}
            <div style={{ display: 'flex', gap: '68px', alignItems: 'center'}}>
            <h3>Employee Details</h3>
            <BsFilterRight size={25} style={{marginLeft:'470px', cursor:'pointer'}} onClick={setpanel}/>
            </div>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }} id="myGrid">
            {loading ? (
                <div className="loading-overlay">
                    <img src={loadingImage} alt="Loading..." style={{ width: '50px', height: '50px' }} />
                </div>
            ) : (
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    animateRows={true}
                    columnDefs={columnDef}
                    defaultColDef={defaultColDef}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    gridOptions={gridOptions}
                />
            )}
            </div>

            
        </div>

    );
}

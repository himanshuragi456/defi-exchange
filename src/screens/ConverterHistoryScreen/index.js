import React from 'react'
import { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ConvertHistoryNavigationContainer from '../../containers/ConvertHistoryNavigationContainer';
import Export from '../../assets/images/export.png'
import ConvertHistoryTable from '../../components/ConvertHistoryTable';

function ConverterHistory() {

    useEffect(() => {
        document
            .getElementsByClassName("parent-layout")[0]
            .classList.add("parent-layout__custom-wrapper");
    }, [])

    return (
        <div style={{ display: "flex" }}>
            <ConvertHistoryNavigationContainer />
            <div className='container mx-lg-5 convert-history-container'>
                <div className='d-flex justify-content-between'>
                    <h2 style={{ fontSize: "22px" }}>Convert history</h2>
                    <button className='bg-transparent text-white border-0'><img src={Export} /> Export</button>
                </div>
                <div className="d-flex mt-5 justify-content-lg-between flex-wrap">
                    <Dropdown className='m-1'>
                        <Dropdown.Toggle className='bg-transparent convert-history-dropdown' id="dropdown-basic">
                            Time
                            <span className="caret ml-1 ml-sm-4">Past 30 days</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='m-1'>
                        <Dropdown.Toggle className='bg-transparent convert-history-dropdown' id="dropdown-basic">
                            Wallet
                            <span className="caret ml-5 pl-3">All</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='m-1'>
                        <Dropdown.Toggle className='bg-transparent convert-history-dropdown' id="dropdown-basic">
                            Coin
                            <span className="caret ml-5 pl-3"></span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button className='converter-search-btn px-4 py-2 rounded m-1 pointer'>Search</button>
                    <button className='bg-transparent text-white py-2 px-4 rounded m-1 convert-history-dropdown pointer'>Reset</button>
                </div>
                <ConvertHistoryTable />
            </div>
        </div>
    )
}

export const ConverterHistoryScreen = injectIntl(
    withRouter(connect(null, null)(ConverterHistory))
);
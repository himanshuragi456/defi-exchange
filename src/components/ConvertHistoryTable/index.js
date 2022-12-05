import React from 'react';
import "./index.css";

function ConvertHistoryTable() {
    return (
        <div className='mainContainer mt-5 pt-5'>
            <table class="table table-hover thead-bordered py-4 tableContainer mt-5">
                <thead class='tableHead'>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Wallet</th>
                        <th scope="col">Pair</th>
                        <th scope="col">Type</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Price</th>
                        <th scope="col">Date Updated</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td style={{ color: "#FFC751" }}>@mdo</td>
                    </tr>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        <td>@fat</td>
                        <td>@fat</td>
                        <td>@fat</td>
                        <td>@fat</td>
                        <td style={{ color: "#58B449" }}>@fat</td>
                    </tr>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td style={{ color: "#FF0E0E" }}>the Bird</td>
                    </tr>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                    </tr>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                    </tr>
                    <tr>
                        <td>22-10-2022</td>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                        <td>the Bird</td>
                    </tr>
                </tbody>
            </table></div>
    )
}

export default ConvertHistoryTable
import React, { useState, useEffect } from "react";
import "./table.css";
import { CSVDownload } from "react-csv";

function TableTotal({
  searchDomain,
  totalAdvertisers,
  parseTime,
  parseErrors,
  res,
}) {
  const [download, setDownload] = useState(false);

  const handleSetDownload = () => {
    download ? setDownload(false) : setDownload(true);
  };
  return (
    <div>
      <div>
        <table>
          <thead>
            <tr className="table-total">
              <th className="table-total">
                Domain:
                <div className="table-total-props">{searchDomain}</div>
              </th>
              <th className="table-total">
                Total advertisers:
                <div className="table-total-props">{totalAdvertisers}</div>
              </th>
              <th className="table-total">
                Total Parse Time:
                <div className="table-total-props">{parseTime}ms</div>
              </th>
              <th className="table-total">
                Total Parse Errors:
                <div className="table-total-props">{parseErrors}</div>
              </th>
              <th className="table-total">
                <div
                  className="table-total-props btn"
                  onClick={(e) => handleSetDownload()}
                >
                  Download
                  {download && <CSVDownload data={res} />}
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

export default TableTotal;

import React from "react";
import "./table.css";

function TableHead({ sortByName, sortByNumber }) {
  return (
    <div>
      <table>
        <thead>
          <tr className="table-header">
            <th className="table-domain" onClick={sortByName}>
              Domain
            </th>
            <th onClick={sortByNumber}>Count</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}

export default TableHead;

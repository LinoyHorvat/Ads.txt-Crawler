import React from "react";

function Table({ domain, count }) {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="table-domain">{domain}</td>
            <td>{count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;

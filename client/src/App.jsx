import "./App.css";
import React, { useState } from "react";
import TableHead from "./components/Table/TableHead";
import Table from "./components/Table/Table";
import TableTotal from "./components/Table/TableTotal";
import myApi from "./api/Api";
import Spinner from "./components/Spinner/Spinner";
import validator from "validator";

function App() {
  const [searchDomain, setSearchDomain] = useState("");
  const [res, setRes] = useState("");
  const [totalAdvertisers, setTotalAdvertisers] = useState(0);
  const [parseTime, setParseTime] = useState(0);
  const [parseErrors, setParseErrors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [descending, setDescending] = useState(true);

  /**
   * @function handleSearch
   * Cheek that the domain term is valid.
   * Call the GET method for the given domain term.
   * setState to returned values
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (validator.isURL(searchDomain)) {
      try {
        setLoading(true);
        const { data } = await myApi.get(`/domain/${searchDomain}`);
        setLoading(false);
        setTotalAdvertisers(data.data.length);
        setParseTime(data.parseTime);
        setParseErrors(data.parseErrors);
        setRes(data.data);
      } catch (err) {
        setLoading(false);
        setRes("");
        console.log(err.response.data.message);
        alert(err.response.data.message);
      }
    } else {
      console.log("Invalid URL");
      alert("Invalid URL");
    }
  };
  /**
   * @function buildTable
   * Send domain name & count to <Table />
   */
  const buildTable = () => {
    return res.map((line, index) => {
      return (
        <div key={index}>
          <Table domain={line[0]} count={line[1]} />
        </div>
      );
    });
  };
  /**
   * @function showTable
   * Send searchDomain & results to <TableTotal />
   * Send sorting functions (sortByNumber,sortByName ) to <TableHead/>
   * Call buildTable() function to build the table
   */
  const showTable = () => (
    <div>
      {res ? (
        <div className="table">
          <TableTotal
            searchDomain={searchDomain}
            totalAdvertisers={totalAdvertisers}
            parseTime={parseTime}
            parseErrors={parseErrors}
            res={res}
          />
          <br />
          <div className="main-table">
            <TableHead sortByNumber={sortByNumber} sortByName={sortByName} />
            {buildTable()}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  /**
   * @function sortByNumber
   * When clicking on "Count" the function sort the results by count.
   */
  const sortByNumber = () => {
    let newRes;
    if (descending) {
      newRes = res.sort((a, b) => a[1] - b[1]);
      setDescending(false);
    } else {
      newRes = res.sort((a, b) => b[1] - a[1]);
      setDescending(true);
    }
    setRes(newRes);
  };
  /**
   * @function sortByName
   * When clicking on "Domain" the function sort the results by the domain name.
   */
  const sortByName = () => {
    let newRes;
    if (descending) {
      newRes = res.sort((a, b) => a[0].localeCompare(b[0]));
      setDescending(false);
    } else {
      newRes = res.sort((a, b) => b[0].localeCompare(a[0]));
      setDescending(true);
    }
    setRes(newRes);
  };

  return (
    <div className="App">
      <h1 className="app-title">Ads.txt Crawler</h1>
      <form className="search-input" onSubmit={handleSearch}>
        <input
          className="input"
          type="text"
          value={searchDomain}
          onChange={(e) => {
            setSearchDomain(e.target.value);
          }}
          placeholder="Enter domain name... (e.g. msn.com)"
        />
        <button className="btn btn-submit" type="submit">
          Parse Ads.txt
        </button>
      </form>
      {loading ? <Spinner /> : showTable()}
    </div>
  );
}

export default App;

import "./App.css";
import React, { useState, useEffect } from "react";
import TableHead from "./components/Table/TableHead";
import Table from "./components/Table/Table";
import TableTotal from "./components/Table/TableTotal";
import myApi from "./api/Api";
import Spinner from "./components/Spinner/Spinner";
// TODO: add validation for searchDomain try msn.co!!!!
import validator from "validator";

function App() {
  const [searchDomain, setSearchDomain] = useState("");
  const [res, setRes] = useState("");
  const [totalAdvertisers, setTotalAdvertisers] = useState(0);
  const [parseTime, setParseTime] = useState(0);
  const [parseErrors, setParseErrors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [descending, setDescending] = useState(true);

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
  const buildTable = () => {
    return res.map((line, index) => {
      return (
        <div key={index}>
          <Table domain={line[0]} count={line[1]} />
        </div>
      );
    });
  };
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
  const showTable = () => {
    return (
      <div className="table">
        {res && (
          <TableTotal
            searchDomain={searchDomain}
            totalAdvertisers={totalAdvertisers}
            parseTime={parseTime}
            parseErrors={parseErrors}
            res={res}
          />
        )}
        <br />
        <div className="main-table">
          {res && (
            <TableHead sortByNumber={sortByNumber} sortByName={sortByName} />
          )}
          {res && buildTable()}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1 className="app-title">Ads.txt Crawler</h1>
      <form className="search-input">
        <input
          className="input"
          type="text"
          value={searchDomain}
          onChange={(e) => {
            setSearchDomain(e.target.value);
          }}
          placeholder="Enter domain name... (e.g. msn.com)"
        />
        <button
          className="btn btn-submit"
          type="submit"
          onClick={(e) => handleSearch(e)}
        >
          Parse Ads.txt
        </button>
      </form>
      {loading ? <Spinner /> : showTable()}
    </div>
  );
}

export default App;

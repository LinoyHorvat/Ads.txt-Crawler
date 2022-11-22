const axios = require("axios");
const { performance } = require("perf_hooks");
const getDomain = async (req, res) => {
  const { domain: searchDomain } = req.params;
  const objOfDomains = {};
  const resultObj = {};
  const time = performance.now();
  const URL = `https://www.${searchDomain}/ads.txt`;
  let parseErrors = 0;
  try {
    let data = await axios.get(URL);
    if (data.request.res.responseUrl != URL) {
      res.status(404).send({ message: "not found" });
    }
    data = data.data;
    const parseTime = parseInt(performance.now() - time);
    // data
    data.split("\n").forEach((line) => {
      line = line.split(",");

      if (line.length >= 3) {
        const domainName = line[0].toLowerCase();
        objOfDomains[domainName]
          ? (objOfDomains[domainName] += 1)
          : (objOfDomains[domainName] = 1);
      }
    });
    const result = Object.entries(objOfDomains).sort((a, b) => b[1] - a[1]);
    resultObj["parseTime"] = parseTime;
    resultObj["parseErrors"] = parseErrors;
    resultObj["data"] = result;
    res.status(200).send(resultObj);
  } catch (err) {
    const parseTime = parseInt(performance.now() - time);
    parseErrors += 1;
    res.status(404).send({ message: err.message });
  }
};
module.exports = {
  getDomain,
};

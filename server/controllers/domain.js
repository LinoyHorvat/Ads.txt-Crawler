const axios = require("axios");
const { performance } = require("perf_hooks");
const getDomain = async (req, res) => {
  const { domain: searchDomain } = req.params;
  const objOfDomains = {};
  const resultObj = {};
  const time = performance.now();
  const URL = `http://www.${searchDomain}/ads.txt`;
  let parseErrors = 0;
  try {
    const { data } = await axios.get(URL);
    const parseTime = parseInt(performance.now() - time);
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
    // TODO: parseErrors
    resultObj["data"] = result;
    res.status(200).send(resultObj);
  } catch (err) {
    const parseTime = parseInt(performance.now() - time);
    parseErrors += 1;
    res.status(400).send({ message: err.message });
  }
};
module.exports = {
  getDomain,
};

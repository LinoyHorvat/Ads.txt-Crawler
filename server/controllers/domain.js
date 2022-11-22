/*----------------------------------------------------------------
Import
/*----------------------------------------------------------------*/
const axios = require("axios");
const { performance } = require("perf_hooks");
/**
 * @function dataArrangement
 * @param data returned from the the getDomain function
 * @return Array sorted by the the number of times the domain appears
 */
const dataArrangement = (data) => {
  const objOfDomains = {};
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
  return result;
};
/**
 * @function getDomain
 * @param searchDomain
 * @return The advertiser domains which are on the ads.txt file as following:
 * resultObj{
 *     parseTime: parseTime,
 *     parseErrors: parseErrors,
 *     data: result
 * }
 */
const getDomain = async (req, res) => {
  let { domain: searchDomain } = req.params;
  searchDomain = searchDomain.toLowerCase();
  const resultObj = {};
  const time = performance.now();
  const URL = `https://www.${searchDomain}/ads.txt`;
  let parseErrors = 0;
  try {
    let data = await axios.get(URL);
    if (data.request.res.responseUrl != URL) {
      res.status(404).send({ message: "not found" });
    }
    const parseTime = parseInt(performance.now() - time);
    resultObj["parseTime"] = parseTime;
    resultObj["parseErrors"] = parseErrors;
    resultObj["data"] = dataArrangement(data.data);
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

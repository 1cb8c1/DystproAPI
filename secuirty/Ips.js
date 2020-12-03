const removePort = (ip) => {
  return ip.split(/((?::))(?:[0-9]+)$/gm)[0].replace(/\[(.*?)\]/g, "$1");
};

const compareIps = (ip1, ip2) => {
  return removePort(ip1) === removePort(ip2);
};

module.exports = {
  removePort,
  compareIps,
};

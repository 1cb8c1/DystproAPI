//REMOVES PORT FROM IP STRING. WORKS FOR IPV4 AND IPV6
const removePort = (ip) => {
  return ip.split(/((?::))(?:[0-9]+)$/gm)[0].replace(/\[(.*?)\]/g, "$1");
};

//COMPARES TWO IPS WITHOUT PORTS
const compareIps = (ip1, ip2) => {
  return removePort(ip1) === removePort(ip2);
};

//EXPORTS
module.exports = {
  removePort,
  compareIps,
};

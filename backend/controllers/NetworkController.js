const { safeTerminal } = require("../utilities/terminal");
const { lightNetworkDetail } = require("../utilities/lightNetworkDetail");

exports.listNetworks = async (req, res, next) => {
  try {
    const networks = await safeTerminal.listNetworks();
    const networksArray = networks
      .split("\n")
      .filter((network) => network !== "")
      .map((network) => JSON.parse(network));
    res.json(networksArray);
  } catch (error) {
    next(error);
  }
};

exports.inspectNetwork = async (req, res, next) => {
  const networkID = req.params.id;
  try {
    const networkData = await safeTerminal.inspectNetwork(networkID);
    res.json(lightNetworkDetail(networkID, JSON.parse(networkData)));
  } catch (error) {
    next(error);
  }
};

exports.removeNetwork = async (req, res, next) => {
  const networkID = req.params.id;
  try {
    await safeTerminal.removeNetwork(networkID);
    res.json({ message: 'Network removed successfully' });
  } catch (error) {
    next(error);
  }
};

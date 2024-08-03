const { safeTerminal } = require("../utilities/terminal");
const { lightVolumeDetail } = require("../utilities/lightVolumeDetail");

exports.listVolumes = async (req, res, next) => {
  try {
    const volumes = await safeTerminal.listVolumes();
    const volumesArray = volumes
      .split("\n")
      .filter((volume) => volume !== "")
      .map((volume) => JSON.parse(volume));
    res.json(volumesArray);
  } catch (error) {
    next(error);
  }
};

exports.inspectVolume = async (req, res, next) => {
  const volumeID = req.params.id;
  try {
    const volumeData = await safeTerminal.inspectVolume(volumeID);
    res.json(lightVolumeDetail(volumeID, JSON.parse(volumeData)));
  } catch (error) {
    next(error);
  }
};

exports.removeVolume = async (req, res, next) => {
  const volumeID = req.params.id;
  try {
    await safeTerminal.removeVolume(volumeID);
    res.json({ message: 'Volume removed successfully' });
  } catch (error) {
    next(error);
  }
};

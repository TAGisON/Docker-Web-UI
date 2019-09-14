const { Terminal } = require('../utilities/terminal')

exports.fetch = async (req, res) => {
  const images = await Terminal(
    `docker image ls -a --format '{"ID": "{{.ID}}", "CreatedSince": "{{.CreatedSince}}", "Size": "{{.Size}}", "VirtualSize": "{{.VirtualSize}}", "Repository": "{{.Repository}}"}'`
  )
  const imagesArray = images
    .split("\n")
    .filter(image => image !== '')
    .map(image => JSON.parse(image))
  res.json(imagesArray)
}

exports.command = async (req, res) => {
  const imageID = req.query.image
  const command = req.query.command
  const cmd = `docker image ${command} ${imageID}`
  const cmdData = await Terminal(cmd)
  res.json(
    cmdData.replace("\n", "")
  )
}
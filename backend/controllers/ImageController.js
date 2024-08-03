const { safeTerminal } = require("../utilities/terminal");
const { lightImageDetail } = require("../utilities/lightImageDetail");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.fetch = async (req, res) => {
  const images = await safeTerminal.formattedImages();
  const imagesArray = images
    .split("\n")
    .filter((image) => image !== "")
    .map((image) => JSON.parse(image));
  res.json(imagesArray);
};

exports.command = async (req, res, next) => {
  const imageID = req.query.image;
  const command = req.query.command;
  try {
    const cmdData = await safeTerminal.singleImage(command, imageID);
    res.json(cmdData.replace("\n", ""));
  } catch (error) {
    next(error);
  }
};

// Handle File Upload
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/x-tar") {
      return cb(new Error("Only .tar files are allowed"));
    }
    cb(null, true);
  },
});

exports.upload = [
  upload.single("file"),
  (req, res, next) => {
    const tempPath = req.file.path;
    const targetPath = path.join("/mnt/container_images/", req.file.originalname);

    if (path.extname(req.file.originalname).toLowerCase() === ".tar") {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return next(err);
        res
          .status(200)
          .json({ message: "File uploaded successfully", path: targetPath });
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return next(err);
        res.status(400).json({ message: "Only .tar files are allowed" });
      });
    }
  },
];

// Lists System-Images
exports.listImages = (req, res) => {
  const imagesFolder = '/mnt/container_images/';

  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directory: ' + err });
    }

    const tarFiles = files.filter(file => path.extname(file).toLowerCase() === '.tar');
    const images = tarFiles.map((file, index) => ({
      id: index,
      name: file,
      path: path.join(imagesFolder, file)
    }));

    res.status(200).json(images);
  });
};

// Delete Image by ID
exports.deleteImage = async (req, res, next) => {
  const imageID = req.params.id;
  try {
    const cmdData = await safeTerminal.singleImage('rmi', imageID);
    res.json({ message: 'Image deleted successfully', details: cmdData });
  } catch (error) {
    next(error);
  }
};


//Import Images 
exports.importImage =
  async (req, res, next) => {
    const { name, tag, imagePath } = req.body;

    if (!name || !tag ) {
      return res.status(400).json({ error: 'Name, tag are required' });
    }
    if(!imagePath){
      return res.status(400).json({error: 'System Path Not Given'});
    }

    // const imagePath = path.join(__dirname, '..', 'uploads', file.filename);
    const command = `cat ${imagePath} | docker import - ${name}:${tag}`;

    try {
      await safeTerminal.genericCommand(command);
      res.status(200).json({ message: 'Image imported successfully' });
    } catch (error) {
      next(error);
    }
  };


exports.deployImage = async (req, res, next) => {
  const { name, hostname, network, ip, imageName, tag } = req.body;
  
  if (!name || !hostname || !network || !ip || !imageName || !tag) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const command = `docker run -itd --name ${name} --hostname ${hostname} --restart always --privileged true -v /home/coralswitch:/home/coralswitch -v /mnt/:/mnt/ -v /sys/fs/cgroup:/sys/fs/cgroup:ro --network ${network} --ip ${ip} ${imageName}:${tag} sbin/init`;

  try {
    const result = await safeTerminal.genericCommand(command);
    res.status(200).json({ message: 'Container deployed successfully', details: result });
  } catch (error) {
    next(error);
  }
};

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3230;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "web")));

// Boot database.
const db = require("./utilities/db");
db.boot();

const { DefaultController } = require("./controllers/DefaultController");
const {
  GenericCommandController,
} = require("./controllers/GenericCommandController");
const ContainerController = require("./controllers/ContainerController");
const ImageController = require("./controllers/ImageController");
const GroupController = require("./controllers/GroupController");
const CleanUpController = require("./controllers/CleanUpController");
const NetworkController = require("./controllers/NetworkController");
const VolumeController = require("./controllers/VolumeController");
app.get("/", DefaultController);
app.get("/api/generic", GenericCommandController);

// Container routes
app.get("/api/container/fetch", ContainerController.fetch);
app.get("/api/container/fetchById", ContainerController.fetchById);
app.get("/api/container/command", ContainerController.command);
app.get("/api/container/logs", ContainerController.logs);
app.get("/api/container/stats", ContainerController.stats);
app.delete("/api/container/delete", ContainerController.delete);
app.get('/api/container/export', ContainerController.exportContainer);

// Images routes
app.get("/api/image/fetch", ImageController.fetch);
app.get("/api/image/command", ImageController.command);
app.delete('/api/image/:id', ImageController.deleteImage);
app.get("/api/cleanup/command", CleanUpController.command);
app.post("/api/image/upload", ImageController.upload);
app.get("/api/system-images", ImageController.listImages);
app.post("/api/image/import", ImageController.importImage);
app.post('/image/deploy', ImageController.deployImage);

// Groups routes
app.post("/api/groups", GroupController.create);
app.get("/api/groups", GroupController.fetch);
app.delete("/api/groups", GroupController.delete);

// Network routes
app.get('/api/networks', NetworkController.listNetworks);
app.get('/api/network/:id', NetworkController.inspectNetwork);
app.delete('/api/network/:id', NetworkController.removeNetwork);

// Volume routes
app.get('/api/volumes', VolumeController.listVolumes);
app.get('/api/volume/:id', VolumeController.inspectVolume);
app.delete('/api/volume/:id', VolumeController.removeVolume);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

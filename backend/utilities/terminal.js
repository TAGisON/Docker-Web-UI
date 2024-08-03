const child_process = require("child_process");

const isValidId = (id) => /^[0-9a-zA-Z]+$/.test(id.trim());

const isValidString = (str) => /^[a-zA-Z]+$/.test(str.trim());

const Terminal = (command) =>
  new Promise((resolve, reject) => {
    child_process.exec(
      command,
      { maxBuffer: 1500 * 1024 }, // Set the maximum buffer size for the command output.
      function (error, stdout, stderr) {
        if (error) reject(error); // Reject the promise if there's an error.
        else resolve(stdout || stderr); // Resolve the promise with the command output.
      }
    );
  });

exports.safeTerminal = {
  installModules: async (backendPath) => {
    await Terminal(`cd ${backendPath} && npm install`);
  },

  serve: async (backendPath) => {
    await Terminal(`cd ${backendPath} && node index.js`);
  },

  // Lists all Docker containers.
  allContainers: () => Terminal(`docker ps -q -a`),

  // Inspects a Docker container
  inspectContainer: async (id) => {
    if (isValidId(id)) {
      return Terminal(`docker container inspect ${id}`);
    } else {
      throw new Error("The container id is invalid");
    }
  },

  // Executes a generic Docker container command
  generic: async (task, id) => {
    if (!isValidString(task)) {
      throw new Error("The task command is invalid.");
    }
    if (!isValidId(id)) {
      throw new Error("The container id is invalid");
    }
    return Terminal(`docker container ${task} ${id}`);
  },

  // Executes a generic command
  genericCommand: (command) => Terminal(command),

  // Retrieves the logs of a Docker container 
  logs: async (id) => {
    if (!isValidId(id)) {
      throw new Error("The container id is invalid");
    }
    return Terminal(`docker container logs ${id} --tail 1500`);
  },

  // Retrieves stats of all Docker containers
  stats: () =>
    Terminal(
      `docker container stats --no-stream --format '{"id": "{{.ID}}", "cpu_percentage": "{{.CPUPerc}}", "memory_usage": "{{.MemUsage}}", "network_io": "{{.NetIO}}"}'`
    ),

  prune: (pruneType) => {
    if (!isValidString(pruneType)) {
      throw new Error("The entity type is not valid");
    }
    return Terminal(`docker ${pruneType} prune -f`);
  },

  // Lists all Docker containers
  containerLs: () => Terminal(`docker container ls --format '{{json .}}'`),

  // Retrieves a formatted list of Docker images.
  formattedImages: () =>
    Terminal(
      `docker images --format '{"ID": "{{.ID}}", "Tag": "{{.Tag}}", "CreatedSince": "{{.CreatedSince}}", "Size": "{{.Size}}", "VirtualSize": "{{.VirtualSize}}", "Repository": "{{.Repository}}"}'`
    ),

  // Executes a Docker image command
  singleImage: (task, id) => {
    if (!isValidString(task)) {
      throw new Error("The task command is invalid.");
    }
    if (!isValidId(id)) {
      throw new Error("The image id is invalid");
    }
    if (task === "run") {
      return Terminal(`docker ${task} ${id}`);
    } else {
      return Terminal(`docker image ${task} ${id}`);
    }
  },

  // Lists all Docker networks
  listNetworks: () => Terminal(`docker network ls --format '{{json .}}'`),

  // Inspects a Docker network 
  inspectNetwork: async (id) => {
    if (isValidId(id)) {
      return Terminal(`docker network inspect ${id}`);
    } else {
      throw new Error("The network id is invalid");
    }
  },

  // Removes a Docker network
  removeNetwork: async (id) => {
    if (isValidId(id)) {
      return Terminal(`docker network rm ${id}`);
    } else {
      throw new Error("The network id is invalid");
    }
  },

  // Lists all Docker volumes
  listVolumes: () => Terminal(`docker volume ls --format '{{json .}}'`),

  // Inspects a Docker volume
  inspectVolume: async (id) => {
    if (isValidId(id)) {
      return Terminal(`docker volume inspect ${id}`);
    } else {
      throw new Error("The volume id is invalid");
    }
  },

  // Removes a Docker volume
  removeVolume: async (id) => {
    if (isValidId(id)) {
      return Terminal(`docker volume rm ${id}`);
    } else {
      throw new Error("The volume id is invalid");
    }
  },
};

exports.lightNetworkDetail = (id, inspectedData) => ({
    Id: inspectedData.Id,
    shortId: id,
    Name: inspectedData.Name,
    Driver: inspectedData.Driver,
    Scope: inspectedData.Scope,
    IPAM: inspectedData.IPAM,
  });
  
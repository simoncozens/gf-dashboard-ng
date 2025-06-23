export function arrangeVersionHistory(metadata, servers) {
  const family_to_directory = Object.fromEntries(
    Object.entries(metadata).map(([k, v]) => [v.name, k])
  );
  let versionhistory = {};

  for (directory of metadata) {
    let family_name = family_to_directory[directory];
    if (!family_name) {
      continue;
    }
    if (!versionhistory[family_name]) {
      versionhistory[family_name] = {};
    }
    for (server of servers) {
      if (!server.families[family_name]) {
        continue;
      }
      if (!versionhistory[family_name][server.name]) {
        versionhistory[family_name][server.name] = [];
      }
      let current_version = server.families[family_name].version;
      let versions = versionhistory[family_name][server.name].map(
        (x) => x.version
      );
      if (!versions.includes(current_version)) {
        versionhistory[family_name][server.name].push({
          version: current_version,
          date: new Date().toISOString(),
        });
      }
    }
  }
  return versionhistory;
}

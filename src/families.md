---
toc: true
title: Family status
---

```js
import { RenderFamily } from "./components/Family.js";
import { arrangeVersionHistory } from "./versionhistory.js";

const allResults = await FileAttachment("./results.json").json();
const metadata = await FileAttachment("./metadata.json").json();
const servers = await FileAttachment("./servers.json").json();
const updates = arrangeVersionHistory(metadata, servers);

const family_to_directory = Object.fromEntries(
  Object.entries(metadata).map(([k, v]) => [v.name, k])
);
const directory_to_family = Object.fromEntries(
  Object.entries(metadata).map(([k, v]) => [k, v.name])
);
let families = Object.keys(family_to_directory).sort();
const searchBar = Inputs.search(families, {
  placeholder: "Search families...",
});
const search = view(searchBar);
```

```jsx
if (search.length < 100) {
  let rows = search.map((x) => (
    <RenderFamily
      servers={servers}
      family={x}
      directory={family_to_directory[x]}
      allResults={allResults}
      metadata={metadata}
      updates={updates}
    />
  ));
  display(<div>{rows}</div>);
} else {
  display(<div />);
}
```

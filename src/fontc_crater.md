---
title: Fontc crater
---

```js
const fontc = await FileAttachment("./data/fontc.json").json();
import { RenderFailures, RenderSuccesses } from "./components/Fontc.js";
```

```js
const semiFlattened = fontc.summary.map((cur) => {
  // Move the `stats` object to the top level
  return {
    ...cur,
    ...cur.stats,
    stats: undefined, // Remove the original stats object
  };
});
const flattened = fontc.summary.flatMap((cur) =>
  Object.entries(cur.stats)
    .filter(([status, count]) =>
      ["both_failed", "fontmake_failed", "identical", "produced_diff"].includes(
        status
      )
    )
    .map(([status, count]) => {
      return {
        began: cur.began,
        status,
        count,
      };
    })
);
display(Inputs.table(semiFlattened));
```

```js
const y2 = d3.scaleLinear(
  [0, 100],
  [0, d3.max(fontc.summary, (d) => d.stats.total_targets)]
);

display(
  Plot.plot({
    color: { legend: true },
    y: { axis: "left", label: "targets" },

    marks: [
      Plot.ruleY([0]),
      Plot.axisY(y2.ticks(), {
        anchor: "right",
        label: "%",
        color: "lightgreen",
        y: y2,
        tickFormat: y2.tickFormat(),
      }),

      Plot.areaY(flattened, {
        y: "count",
        x: (d) => new Date(d.began),
        fill: "status",
      }),
      Plot.lineY(
        semiFlattened,
        Plot.mapY((D) => D.map(y2), {
          x: (d) => new Date(d.began),
          y: (d) => d.diff_perc_including_failures,
          stroke: "green",
          strokeOpacity: 0.5,
        })
      ),
      Plot.lineY(
        semiFlattened,
        Plot.mapY((D) => D.map(y2), {
          x: (d) => new Date(d.began),
          y: (d) => d.diff_perc_excluding_failures,
          stroke: "green",
        })
      ),
    ],
    width,
  })
);
```

## Successes

```jsx
display(<RenderSuccesses successes={fontc.lastRun.success} />);
```

## Failures

```jsx
display(<RenderFailures failures={fontc.lastRun.failure} />);
```

export function RenderFamily({family, directory, allResults, metadata, servers, updates} = {}) {
  let result = allResults.latestResult[directory];
  let fbStuff = <div/>;
  let history = [];
  console.log(updates[family]);
  if (updates[family]) {
    for (let [server, moves] of Object.entries(updates[family])) {
      for (let {version, date} of moves) {
        if (date != "1970-01-01T00:00:00") {
          history.push({server, version, date});
        }
      }
    }
  }
  history = history.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (result) {
    for (let section of Object.keys(result)) {
      // If no check has status: WARN or status: FAIL, skip the section
      let checks = result[section];
      if (checks.filter(check => check.status === 'WARN' || check.status === 'FAIL').length == 0) {
        delete result[section];
      }
    }
   fbStuff = Object.entries(result).map(
    ([section, checks]) => {
      return <div key={section}>
        <h3>{section}</h3>
        <ul>
          {checks.filter(check => check.status == "WARN" || check.status == "FAIL" || check.status == "ERROR").map(check => {
            let unique_codes = check.codes ? check.codes.split(' ').map(code => code.trim()).filter((v, i, a) => a.indexOf(v) === i) : [];
            check.codes = unique_codes.join(', ');
            return <li key={check.name}>
              <strong><a href={"https://fonttools.github.io/fontspector/#"+check.check_id}>{check.check_id}</a></strong>: <span  className={check.status.toLowerCase()}>{check.status}
              {check.codes ? <span> - {check.codes}</span> : ''}
              </span>
            </li>;
          })}
        </ul>
      </div>;
    }
  );
  }
  let md = metadata[directory];
  let lastUpdated = (history?.[0]) ? new Date(history[0].date).toLocaleDateString() : 'Unknown';
  return <div>
    <h2>{family}</h2>
      <table>
        <tr><th>Directory</th> <td>{directory}</td></tr>
        <tr><th>Designer</th> <td>{md?.designer}</td></tr>
        <tr><th>Subsets</th> <td>{md?.subsets?.join(', ')}</td></tr>
        <tr><th>Category</th> <td>{md?.category}</td></tr>
        <tr><th>Date added</th> <td>{md?.dateAdded}</td></tr>
        <tr><th>Last updated</th> <td>{lastUpdated}</td></tr>
        <tr><th>Dev version</th> <td class="dev">{servers?.dev.families[family]?.version}</td></tr>
        <tr><th>Sandbox version</th> <td class="sandbox">{servers?.sandbox.families[family]?.version}</td></tr>
        <tr ><th>Production version</th> <td class="production">{servers?.production.families[family]?.version}</td></tr>
      </table>

      <details>
        <summary>Version history</summary>
        <ul>
        {history.map(({server, version, date}) => {
          return <li key={`${server}-${version}`}>
            {new Date(date).toLocaleDateString()}: -&gt; <span className={server}>{server}: {version}</span>
          </li>;
        })}
        </ul>
      </details>

      <details>
        <summary>Upstream repository</summary>
        <a href={md?.source?.repositoryUrl}>{md?.source?.repositoryUrl}</a>
      </details>

      <details>
        <summary>Fontspector results</summary>
        {fbStuff}
      </details>
        <hr/>
  </div>;
}
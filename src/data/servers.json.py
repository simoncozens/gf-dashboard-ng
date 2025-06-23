from gftools.push.servers import GFServers
import json
import os

servers = GFServers()
servers.update_all()
print(json.dumps(servers.to_json(), indent=2, ensure_ascii=False))

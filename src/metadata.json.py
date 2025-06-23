import json
import os
from glob import glob
from gftools.util.google_fonts import Metadata
from google.protobuf.json_format import MessageToDict

repo_path = os.environ["GF_REPO_PATH"]
metadata = {}

for directory in glob(os.path.join(repo_path, "ofl", "*")):
    if not os.path.isdir(directory):
        continue
    
    try:
        md = Metadata(directory)
    except Exception as e:
        continue
    
    metadata[os.path.basename(directory)] = MessageToDict(md)

print(json.dumps(metadata, indent=2, ensure_ascii=False))
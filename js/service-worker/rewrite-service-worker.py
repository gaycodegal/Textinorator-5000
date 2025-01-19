"""
replace contents of service worker with a list of
files to be cached
"""
import argparse
import glob
import os
import pprint
import json

def stampFileEntry(filePath):
    time = os.path.getmtime(filePath)
    return {"path": filePath, "time": time}

def stampList(paths):
    return [stampFileEntry(path) for path in paths]

def valid_type(type_set, path):
    parts = path.split(".")
    if len(parts) == 1:
        return False
    if parts[-1] in type_set:
        return parts[-2] != "template"
    else:
        return False

def listFiles(types, exclude):
    type_set = set(types)
    files = glob.iglob('**/**', recursive=True)
    paths = [path for path in files if valid_type(type_set, path) and path not in exclude]
    return paths


def writePathsAsStampedJSON(output_file, paths):
    stamped = stampList(paths)
    with open(output_file, "w") as output_handle:
        output_handle.write(json.dumps(stamped))

def main():
    parser = argparse.ArgumentParser(
                    description=__doc__)
    parser.add_argument('--root-directory', default="../../")
    parser.add_argument('--output', default="./files.json")
    parser.add_argument('--types',
                        action='extend',
                        nargs='+',
                        default=["txt", "js", "css", "md", "html"])
    parser.add_argument('--exclude',
                        action='extend',
                        nargs='+',
                        default=["service-worker.js"])
    parser.add_argument('--default-entries',
                        action='extend',
                        nargs='+',
                        default=[".",
				 "manifest.json",
				 "favicon.ico",
				 "html/icons/icon-192.webp"])
    
    args = parser.parse_args()
    output_file=os.path.abspath(args.output)
    
    os.chdir(args.root_directory)
    files_list = listFiles(args.types, set(args.exclude))
    defaults = list(args.default_entries)
    defaults.extend(files_list)
    writePathsAsStampedJSON(output_file, sorted(set(defaults)))
    
if __name__ == "__main__":
    main()

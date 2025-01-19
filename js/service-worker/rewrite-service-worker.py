"""
replace contents of service worker with a list of
files to be cached
"""
import argparse
import glob
import os
import pprint
import json
import time

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

def templatedReplace(input_file, output_file, replacements):
    with open(input_file, "r") as input_handle:
        with open(output_file, "w") as output_handle:
            contents = input_handle.read()
            for replacement in replacements:
                contents = contents.replace(replacement, replacements[replacement])
            output_handle.write(contents)

def writePathsAsStampedJSON(output_file, stamped, force_sw_update = False):
    contents = ["[\n"]
    stamped_as_json = [json.dumps(item) for item in stamped]
    contents.extend(",\n".join(stamped_as_json))
    contents.append("\n]\n")
    contents = "".join(contents)
    different = False
    
    with open(output_file, "r") as output_handle:
        currentContent = output_handle.read()
        if currentContent != contents:
            different = True

    if not force_sw_update and not different:
        print("not overwriting, not different")
        return False
    
    with open(output_file, "w") as output_handle:
        output_handle.write(contents)
    return True

def rewrite_worker(input_file, output_file):
    write_time = time.time()
    templatedReplace(input_file, output_file, {
        "{write-time}": str(write_time)
    })

def main():
    parser = argparse.ArgumentParser(
                    description=__doc__)
    parser.add_argument('--root-directory', default="../../")
    parser.add_argument('--output-json', default="./files.json")
    parser.add_argument('--types',
                        action='extend',
                        nargs='+',
                        default=["txt", "js", "css", "md", "html"])
    parser.add_argument('--exclude',
                        action='extend',
                        nargs='+',
                        default=["service-worker.js"])
    parser.add_argument('--force-sw-update', action=argparse.BooleanOptionalAction)
    parser.add_argument('--default-entries',
                        action='extend',
                        nargs='+',
                        default=[".",
                                 "index.html",
				 "manifest.json",
				 "favicon.ico",
				 "html/icons/icon-192.webp"])
    parser.add_argument('--service-template', default="service-worker.template.js")
    parser.add_argument('--output-worker', default="../../service-worker.js")
    
    args = parser.parse_args()
    input_file=os.path.abspath(args.service_template)
    output_worker_file=os.path.abspath(args.output_worker)
    output_json_file=os.path.abspath(args.output_json)
    
    os.chdir(args.root_directory)
    files_list = listFiles(args.types, set(args.exclude))
    defaults = list(args.default_entries)
    defaults.extend(files_list)
    stamped = stampList(sorted(set(defaults)))
    if stamped[0]["path"] == "." and stamped[1]["path"] == "index.html":
        print("corrupt path entries")
        exit(1)
    stamped[0]["time"] = stamped[1]["time"]
    different = writePathsAsStampedJSON(output_json_file, stamped, args.force_sw_update)
    if different:
        rewrite_worker(input_file, output_worker_file)
    
if __name__ == "__main__":
    main()

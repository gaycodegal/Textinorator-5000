"""
replace contents of service worker with a list of
files to be cached
"""
import argparse
import glob
import os
import pprint

def valid_type(type_set, path):
    parts = path.split(".")
    if len(parts) == 1:
        return False
    if parts[-1] in type_set:
        return parts[-2] != "template"
    else:
        return False

def listFiles(types):
    type_set = set(types)
    files = glob.iglob('**/**', recursive=True)
    paths = [path for path in files if valid_type(type_set, path)]
    return paths

def transformPathsIntoText(paths):
    quoted_paths = ['"{}",'.format(path) for path in paths]
    return "\n" + "\n".join(quoted_paths)

def templatedReplace(input_file, output_file, replacements):
    with open(input_file, "r") as input_handle:
        with open(output_file, "w") as output_handle:
            contents = input_handle.read()
            for replacement in replacements:
                contents = contents.replace(replacement, replacements[replacement])
            output_handle.write(contents)

def main():
    parser = argparse.ArgumentParser(
                    description=__doc__)
    parser.add_argument('--service-template', default="service-worker.template.js")
    parser.add_argument('--root-directory', default="../../")
    parser.add_argument('--output', default="../../service-worker.js")
    parser.add_argument('--types',
                        action='extend',
                        nargs='+',
                        default=["txt", "js", "css", "md", "html", "json"])
    args = parser.parse_args()
    input_file=os.path.abspath(args.service_template)
    output_file=os.path.abspath(args.output)
    
    os.chdir(args.root_directory)
    files_list = listFiles(args.types)
    replacements = {
        "{extra_sources_here}": transformPathsIntoText(files_list)
    }
    templatedReplace(input_file, output_file, replacements)
    
if __name__ == "__main__":
    main()

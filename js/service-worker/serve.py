from flask import send_from_directory, Flask
from rewrite_service_worker import generate_stamped, generate_files_json_content, templatedContents
import os
import time

app = Flask(__name__)

@app.route('/js/service-worker/files.json')
def files_json():
    stamped = generate_stamped(
        "",
        ["txt", "js", "css", "md", "html"],
        ["service-worker.js"],
        [".",
         "index.html",
	 "manifest.json",
	 "favicon.ico",
	 "html/icons/icon-192.webp"]
    )
    return generate_files_json_content(stamped), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route('/service-worker.js')
def service_worker():
    write_time = time.time()
    contents = templatedContents(
        "js/service-worker/service-worker.template.js",
        {
            "{write-time}": str(write_time)
        })
    return contents, 200, {'Content-Type': 'text/javascript; charset=utf-8'}

@app.route('/<path:path>')
def serve(path):
    return send_from_directory('../../', path)

@app.route('/')
def index():
    return send_from_directory('../../', "index.html")

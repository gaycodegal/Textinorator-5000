# Static Offline Service Worker Design Doc

This service worker requests a list of files present
in the web-app from the server on install. If
new files are detected, it requests only the relevant
changed files and adds them to its cache.

When the web-app requests a file, the service worker
retrieves it from this cache and returns it.

## Why is the service-worker.js templated?

The service worker only triggers an install event when
any of its bytes are changed and this change detection
happens starting at the top of the file. Thus
we insert a timestamp into the first line. Whenever
we need to trigger an update, this line changing
will generate that install event.

Unfortunately that does mean the service-worker
must be statically generated ahead of time to bake in
this information. This is ideal for static hosts
that cannot rely on a scripted server but not
for development.

A sample server will be provided to fix this
inconvenience shortly.

## How does this minimize fetch requests

Ultimately we need to provide a list of files to the client
so that it can either install them or update them as necessary.
However, requesting every file every time the app updates
would be wasteful. Instead we need some method to detect
when a file has been changed. To this end, we simply
attach a "stamp" of the file's last modification time
to the file.

Time does not flow only in one direction for computers
so we merely need to check if the timestamp is not equal
to the timestamp of the cached file to determine whether an
update is needed.

The stamped file paths to request from the server are
sorted and pretty printed with one entry per line
to ensure that github can properly track changes to the file.

The file generated is

    js/service-worker/files.json

## No cache

When we have determined a file needs to be re-requested
from the server, we can be sure we need the actual
version of it from the server, so we make all fetch
requests related to updating files supply the no-cache
header

# Textinorator 5000

See the [User Guide](docs/USER_GUIDE.md) for information on how to use the tool.

This is a tool for adding text to images, designed to be usable on mobile offline. I found the current online tooling for adding text to images insufficient. It's currently a very ugly work in progress, but it is usable. I will design a more visually appealing frontend with more settings later.

Really the drag to scale text was a feature I personally wanted but hadn't seen in online image generators.

Additionally, this tool is self contained, and can be hosted anywhere without ads. If you have an app that serves zipped html files, you can even run it from the github zip download.

## Desires

- Upload custom fonts (to be cached in browser)
- Support emoji + non-ascii characters [complete]
  - This depends on your browser, but most should do it
- Stroke style, color, size [complete]
- Color [complete]
- Background [complete]
- Rotation
- Scale [complete]
- Move / edit / add text [complete]
- A better UI [complete]
- Offline use / install via PWA install/service worker tech.
- Vertical text support [100%]
	- Chrome is not ideal for this so its boundary is a bit worse
	  - the more you know 🌠
  - font shadow doesn't work with this for some reason, so disabled
	  at least in firefox that is.

## TODO

- perhaps edit text as a text area that shows up as needed - even style the
  text area's text like the canvas font/fill/
- optional safety margin, so its easier to draw when at the size of the screen
- optional snap text to screen borders
- set default font
- an options page
	- potentially have a refresh cache option user accessible
	- add no-sw option
- undo/redo history
- point specificity is subject to canvas scale; fix this
  - This is a fundamental limitation based on browser provided
		events, to fix the canvas scale will need to be dynamically adjusted
		by the user via the addition of a magnifying tool
- text layer should be merged during editing events to prevent
	costly text rendering calculations every frame
- direct user to a user guide

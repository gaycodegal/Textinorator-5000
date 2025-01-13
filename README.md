# Textinorator 5000

This is a tool for adding text to images, designed to be usable on mobile offline. I found the current online tooling for adding text to images insufficient. It's currently a very ugly work in progress, but it is usable. I will design a more visually appealing frontend with more settings later.

Really the drag to scale text was a feature I personally wanted but hadn't seen in online image generators.

Additionally, this tool is self contained, and can be hosted anywhere without ads. If you have an app that serves zipped html files, you can even run it from the github zip download.

## Desires

- Upload custom fonts (to be cached in browser)
- Support emoji + non-ascii characters [complete]
  - This depends on your browser, but most should do it
- Stroke style, color, size
- Color
- Background [complete]
- Rotation
- Scale [complete]
- Move / edit / add text [complete]
- A better UI
- Offline use / install via PWA install/service worker tech.
- Vertical text support
  - My math on text box bounding size is insufficient for vertical text
	  in a way I am really unclear what's wrong at the moment. Canvas
		supports it just fine though, so I'll need to add a toggle
		and do the math for completeness

## Controls

- Click on text to swap focus to it
- Once focus is on text, drag anywhere to move the text
- Click and drag on a corner of focused text to resize it
- Click on anything that isn't text and type your text in the input
  to add a new text line to the screen.


## TODO

- Initial size images to the width of the screen
- perhaps edit text as a text area that shows up as needed - even style the
  text area's text like the canvas font/fill/
- Change the `bottom:` property of the canvas area to not extend into the tool psettings panel; unfloat the tool settings panel

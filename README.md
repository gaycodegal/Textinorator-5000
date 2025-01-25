# Textinorator 5000

See the [User Guide](docs/USER_GUIDE.md) for information on how to use the tool.

This is a tool for adding text to images, designed to be usable on mobile offline. I found the current online tooling for adding text to images insufficient. It's currently a very ugly work in progress, but it is usable. I will design a more visually appealing frontend with more settings later.

Really the drag to scale text was a feature I personally wanted but hadn't seen in online image generators.

Additionally, this tool is self contained, and can be hosted anywhere without ads. If you have an app that serves zipped html files, you can even run it from the github zip download. You can install it as a PWA for offline use for systems that support PWAs, or use the options page to enable offline use.

If you have the do not track option turned on in your browser, offline use
must be manually enabled on the options page. For everyone else it will
be available by default. I figured the "do not track crowd" favors
more intentional control, so this was a development decision rather
than something browsers force.

## Features

- Supports emoji + non-ascii characters
  - This depends on your browser, but most should do it
- Set font stroke style, color, size, and shadow
- Set font name to any available installed font
	- For "fingerprinting" prevention reasons, browsers
	  do not provide a way to enumerate which fonts are
		available so you have to enter the font name manually
- "Upload" an image to put text over
  - The site is offline, and so it's only ever stored in memory
- Resize text with a drag based system (or by font size)
- Move / edit / add text
- A reasonable UI
  - Works on mobile too
- Installable via PWA tech, allowing for offline use
  - see the options page to enable offline use
	  if your browser doesn't present you with an install button
- Vertical text support
	- Chrome and firefox both have different flaws related to
	  vertical text support, so I did my best to get consistent
		behavior across browsers.
  - font shadow doesn't work with this for some reason
		at least in firefox. So font shadows are disabled for
		vertical text
- Draw lines behind the text, on top of the background image

## TODO

- optional snap text to screen borders
- set default font
- direct user to a user guide, preferrably static
	content generated from markdown, which supports
	dynamic theming

## Backlog

- perhaps edit text as a text area that shows up as needed - even style the
  text area's text like the canvas font/fill/
- point specificity is subject to canvas scale; fix this
  - This is a fundamental limitation based on browser provided
		events, to fix the canvas scale will need to be dynamically adjusted
		by the user via the addition of a magnifying tool
- text layer should be merged during editing events to prevent
	costly text rendering calculations every frame
- optional safety margin, so its easier to draw when at the size of the screen
- Upload custom fonts (to be cached in browser)
- Rotation


## Known issues

### Firefox
- Vertical text doesn't support shadow
- Bold text doesn't recognize emoji boundaries
- Bold text with shadow and emoji cuts them weirdly
- You can make bold emoji with firefox (this is funny)

### Chrome
- Vertical text is very weird and requires "manual" rotation
	and adjustment during the drawing process

### Non-specific
- I am concerned that the measureText returns different values
	for Firefox and Chrome. During normal text operations,
	this balances out with just normal math to calculate size.
	However, during vertical text rendering, the math gets really
	wonky, and doesn't adequately account for rendered text
	proporitions. Because the values are different on both
	platforms AND it no longer balances out, vertical
	text boundary boxes are a little worse.

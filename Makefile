icon:
	inkscape icon.svg -w 512 -b white -o html/icons/icon-512.png
	convert html/icons/icon-512.png -background white -resize 192x192\!  html/icons/icon-192.webp
	convert html/icons/icon-512.png -background white -resize 16x16\!  favicon.ico

color-scheme:
	cd ./css/colors && lua build-colors.lua

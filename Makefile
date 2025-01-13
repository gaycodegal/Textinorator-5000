icon:
	inkscape icon.svg -w 128 -b white -o icon.png

color-scheme:
	cd ./css/colors && lua build-colors.lua

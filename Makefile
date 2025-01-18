icon:
	inkscape icon.svg -w 512 -b white -o html/icons/icon-512.png
	convert html/icons/icon-512.png -background white -resize 192x192\!  html/icons/icon-192.webp
	convert html/icons/icon-512.png -background white -resize 16x16\!  favicon.ico

service-worker:
	cd ./js/service-worker/ && python rewrite-service-worker.py

color-scheme:
	cd ./css/colors && lua build-colors.lua

import {setUpFontSizeEvents,
				setUpFontNameEvents,
				setUpTextChangeEvents,
				setUpDeleteTextEvent,
				setUpFontVerticalEvent} from "./set-up-font-events.js";
import {setUpFontColorEvents} from "./set-up-color-controls.js";
import {setUpColorChooser} from "./color-chooser.js";

export function setUpTextToolEvents(textTool, toolControlsElement) {
		setUpFontSizeEvents(textTool.state.focusedTextSize,
												toolControlsElement);
		setUpFontNameEvents(textTool.state.focusedFontName,
												toolControlsElement);
		setUpTextChangeEvents(textTool.state.focusedText,
													toolControlsElement);
		setUpFontVerticalEvent(textTool.state.focusedTextVertical,
													toolControlsElement)
		
		setUpFontColorEvents(textTool.state.focusedColor,
												 toolControlsElement);
		setUpColorChooser(textTool.state.focusedColor,
											toolControlsElement);
		
		setUpDeleteTextEvent(textTool, toolControlsElement);
}


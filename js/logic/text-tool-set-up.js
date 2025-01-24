import {setUpFontSizeEvents,
				setUpFontNameEvents,
				setUpFontItalicEvent,
				setUpFontBoldEvent,
				setUpTextChangeEvents,
				setUpDeleteTextEvent,
				setUpFontVerticalEvent} from "./set-up-font-events.js";
import {setUpFontColorEvents} from "./set-up-color-controls.js";
import {setUpColorChooser} from "./color-chooser.js";

export function setUpTextToolEvents(textTool, toolControlsElement) {
		const textControlsElement = toolControlsElement
					.getElementsByClassName("text-tool-settings")[0];

		setUpFontSizeEvents(textTool.state.focusedTextSize,
												textControlsElement);
		setUpFontNameEvents(textTool.state.focusedFontName,
												textControlsElement);
		setUpFontItalicEvent(textTool.state.focusedTextItalic,
													textControlsElement)
		setUpFontBoldEvent(textTool.state.focusedTextBold,
													textControlsElement)
		setUpTextChangeEvents(textTool.state.focusedText,
													textControlsElement);
		setUpFontVerticalEvent(textTool.state.focusedTextVertical,
													textControlsElement)
		
		setUpFontColorEvents(textTool.state.focusedColor,
												 textControlsElement);
		setUpColorChooser(textTool.state.focusedColor,
											textControlsElement);
		
		setUpDeleteTextEvent(textTool, textControlsElement);
}


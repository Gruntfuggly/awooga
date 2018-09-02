# Awooga!

This a very simple extension that covers the whole text editor in colour when there are errors or warnings present.

*Note: This works by overriding your theme settings. Your original settings are backed up in* `awooga.originalColorCustomizations`.

By default it is enabled for all file extensions (except files without extensions).

When the current file has an extension, a button is displayed in the status bar (a megaphone with a tick or a cross next to it) indicating if **Awooga!** is enabled for the current file extension:

<img src="https://raw.githubusercontent.com/Gruntfuggly/awooga/master/button.png">

Click the button to disable or enable.

Once a file extension has been enabled or disabled, the state is stored in your settings and the extension will no longer be enabled for all file extensions.


## Configuration

Use `awooga.errorColour` and `awooga.warningColour` to change the colours of the overlays.

`awooga.enabled` can be manually modified to set the state for specific file extensions.

The position of the status bar button can be configured using `awooga.buttonAlignment` and `awooga.buttonPriority`.


## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.awooga).


### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/awooga).


## Known Issues

- Files without extensions are not considered.
- Only works when diagnostics are available (not problem matchers - yet).


## Credits

Icon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>


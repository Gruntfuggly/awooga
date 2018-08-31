# Awooga!

This a very simple extension that covers the whole text editor in colour when there are errors or warnings present.

*Note: This works by overriding your theme settings.*

By default it is enabled for all file extensions (except files without extensions).

When the current file has an extension and an available formatter, a button is displayed in the status bar (a megaphone with a tick or a cross next to it) indicating if **Awooga!** is enabled for the current file extension:

<img src="https://raw.githubusercontent.com/Gruntfuggly/awooga/master/button.png">

Click the button to disable or enable.

Once a file extension has been enabled or disabled, the state is stored in your settings and the extension will no longer be enabled for all file extensions.

### TODO
- [ ] Store original settings on first activation
- [ ] Handle problem matchers

## Configuration

Use `awooga.errorColour` and `awooga.warningColour` to change the colours of the overlays.

`awooha.enabled` can be manually modified to set the state for specific file extensions.

The position of the status bar button can be configured using `awooga.buttonAlignment` and `awooga.buttonPriority`.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.awooga).

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/awooga).

## Known Issues

- Files without extensions are not considered.
- Only works when diagnostics are available (not problem matchers). 

## Credits


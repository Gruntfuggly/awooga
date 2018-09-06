var vscode = require( 'vscode' );
var path = require( 'path' );

var button;

var location = vscode.workspace.getConfiguration( 'awooga' ).get( 'location' );

function setBackgroundColour( colour )
{
    var colours = vscode.workspace.getConfiguration( 'workbench' ).get( 'colorCustomizations' );
    vscode.workspace.getConfiguration( 'awooga' ).update( 'originalColorCustomizations', colours, false );
    colours[ location ] = colour;
    vscode.workspace.getConfiguration( 'workbench' ).update( 'colorCustomizations', colours, false );
}

function resetColour()
{
    location = vscode.workspace.getConfiguration( 'awooga' ).get( 'location' );
    setBackgroundColour( undefined );
}

function activate( context )
{
    function backupOriginalColours()
    {
        var originalColours = vscode.workspace.getConfiguration( 'awooga' ).get( 'originalColorCustomizations' );
        if( originalColours === {} )
        {
            var colours = vscode.workspace.getConfiguration( 'workbench' ).get( 'colorCustomizations' );
            vscode.workspace.getConfiguration( 'awooga' ).update( 'originalColorCustomizations', colours, false );
        }
    }

    var lastLevel;

    function getExtension()
    {
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document )
        {
            ext = path.extname( editor.document.fileName );
            if( ext && ext.length > 1 )
            {
                return ext.substr( 1 );
            }
        }
        return "";
    }

    function isEnabled()
    {
        var extension = getExtension();
        var enabled = vscode.workspace.getConfiguration( 'awooga' ).get( 'enabled' );
        return Object.keys( enabled ).length === 0 || ( extension.length > 0 && enabled[ extension ] );
    }

    function updateButton()
    {
        var extension = getExtension();

        var enabled = isEnabled() === true;

        button.text = "$(megaphone) $(" + ( enabled ? "check" : "x" ) + ")";
        button.command = 'awooga.' + ( enabled ? 'disable' : 'enable' );
        button.tooltip = ( enabled ? 'Disable' : 'Enable' ) + " Awooga! for ." + extension + " files";

        if( extension.length > 0 )
        {
            button.show();
        }
        else
        {
            button.hide();
        }
    }

    function createButton()
    {
        if( button )
        {
            button.dispose();
        }

        button = vscode.window.createStatusBarItem(
            vscode.workspace.getConfiguration( 'awooga' ).get( 'buttonAlignment' ) + 1,
            vscode.workspace.getConfiguration( 'awooga' ).get( 'buttonPriority' ) );

        context.subscriptions.push( button );

        updateButton();
    }

    function refresh()
    {
        var editor = vscode.window.activeTextEditor;

        if( editor && editor.document && editor.document.uri )
        {
            var diagnostics = vscode.languages.getDiagnostics( editor.document.uri );

            var level = 0;
            diagnostics.map( function( diagnostic )
            {
                var formatted = JSON.parse( JSON.stringify( diagnostic ) );
                if( formatted.severity === "Warning" && level < 1 )
                {
                    level = 2;
                }
                else if( formatted.severity === "Error" && level < 2 )
                {
                    level = 3;
                }
            } );

            var colour;

            if( level === 2 )
            {
                colour = vscode.workspace.getConfiguration( 'awooga' ).get( 'warningColour' );
            }
            else if( level === 3 )
            {
                colour = vscode.workspace.getConfiguration( 'awooga' ).get( 'errorColour' );
            }

            if( level !== lastLevel )
            {
                if( colour && isEnabled() )
                {
                    setBackgroundColour( colour );
                }
                else
                {
                    resetColour();
                }
                lastLevel = level;
            }

        }
    }

    function configure( shouldEnable )
    {
        var enabled = vscode.workspace.getConfiguration( 'awooga' ).get( 'enabled' );
        var extension = getExtension();
        enabled[ extension ] = shouldEnable;
        vscode.workspace.getConfiguration( 'awooga' ).update( 'enabled', enabled, true );
    }

    if( context.storagePath )
    {
        context.subscriptions.push( vscode.workspace.onDidOpenTextDocument( function()
        {
            if( !button )
            {
                createButton();
            }
            else
            {
                updateButton();
            }
        } ) );

        context.subscriptions.push( vscode.languages.onDidChangeDiagnostics( refresh ) );
        context.subscriptions.push( vscode.window.onDidChangeActiveTextEditor( function( e )
        {
            updateButton();
            refresh();
        } ) );

        context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
        {
            if( e.affectsConfiguration( 'awooga.enabled' ) )
            {
                lastLevel = undefined;
                resetColour();
                refresh();
                updateButton();
            }
            else if(
                e.affectsConfiguration( 'awooga.buttonAlignment' ) ||
                e.affectsConfiguration( 'awooga.buttonPriority' ) )
            {
                createButton();
            }
        } ) );

        context.subscriptions.push( vscode.commands.registerCommand( 'awooga.enable', function() { configure( true ); } ) );
        context.subscriptions.push( vscode.commands.registerCommand( 'awooga.disable', function() { configure( false ); } ) );

        backupOriginalColours();
    }
    else
    {
        console.log( "Awooga! inhibited because there is no current workspace" );
    }
}

function deactivate()
{
    resetColour();
}

exports.activate = activate;
exports.deactivate = deactivate;

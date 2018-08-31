var vscode = require( 'vscode' );

var location = vscode.workspace.getConfiguration( 'awooga' ).get( 'location' );

function setBackgroundColour( colour )
{
    var colours = vscode.workspace.getConfiguration( 'workbench' ).get( 'colorCustomizations' );
    colours[ location ] = colour;
    vscode.workspace.getConfiguration( 'workbench' ).update( 'colorCustomizations', colours, false );
}

function activate( context )
{
    var lastLevel;

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
                setBackgroundColour( colour );
                lastLevel = level;
            }

        }
    }

    context.subscriptions.push( vscode.languages.onDidChangeDiagnostics( refresh ) );
    context.subscriptions.push( vscode.window.onDidChangeActiveTextEditor( refresh ) );
    context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
    {
        if( e.affectsConfiguration( 'awooga' ) )
        {
            lastLevel = undefined;
            setBackgroundColour( undefined );
            location = vscode.workspace.getConfiguration( 'awooga' ).get( 'location' );
            refresh();
        }
    } ) );
}

function deactivate()
{
    setBackgroundColour( undefined );
}

exports.activate = activate;
exports.deactivate = deactivate;

"use strict";

var util = require('util'),
    readline = require('readline'),
    Game = require('./models/Game').Game,
    _und = require('underscore');



function startNewGame(opts){
    opts = opts || {};
    

    // Create readline interface (will pass thru fxns)
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.write("\n\n");
    rl.write("Welcome to Tic Tac Toe!\n");
    rl.write("=========================\n\n");

    // Pass thru options to new game instance
    var game = new Game( _und.extend(opts, { rl: rl }));

    game.play();


    game.on('end', function(results){
        if(results.win) rl.write( results.winner + " has won!\n" );
        else rl.write( "Tie game.\n");  
        
        rl.question("Play another game? [y/n]\n", function(answer){
            rl.pause();
            if(answer === 'yes' || 'y'){
                rl.cose();
                startNewGame(opts);
            }
            else process.exit(0);
        });
    });

}

startNewGame();

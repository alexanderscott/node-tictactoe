"use strict";

var util = require('util'),
    readline = require('readline'),
    Board = require('./Board').Board,
    _und = require('underscore');

var Player = function(opts){
    opts = opts || {};

    this.marker = opts.marker || 'X';
    this.markerInt = 1;

    return this;
}

// Make the player an event emitter, for triggering actions + responses
//util.inherits(Player, EventEmitter);


Player.prototype.beginTurn = function(rl, board, cb){
    var self = this;
    rl.resume();
    rl.question('Enter row and column (ex/ 1x3):\n', function(answer){
        rl.pause();

        var split = answer.split('x');

        if(answer.length === 3 && split.length === 2){
            var rowInput = parseInt(split[0]);
            var colInput = parseInt(split[1]);
           
            //TODO avoid using fixed dimensions here
            if(!_und.isNumber(rowInput) || !_und.isNumber(colInput) || _und.isNaN(rowInput) || _und.isNaN(colInput)){
                rl.write("Input row or column not a number\n");
                return self.beginTurn(rl, board, cb); 
            }

            if(rowInput < 1 || row > 3 || colInput < 1 || colInput > 3){
                rl.write("Incorrect coordinates, must be between 1 and 3\n");
                return self.beginTurn(rl, board, cb);
            }

            // Offset for array-like indexes
            var row = rowInput - 1;
            var col = colInput - 1;

            if(!board.canMoveCoords(row, col)){
                rl.write("This spot on the board has already been taken\n");
                return self.beginTurn(rl, board, cb);
            }

            board.processCoords(self, row, col);

            cb(null, board, rl); 

        } else {
            rl.write("Incorrect coordinate format\n");
            //rl.write("split:: " + util.inspect(split) + "\n");
            return self.beginTurn(rl, board, cb);
        }

    });
};

Player.prototype.processTurn = function(board, cb){
    


};

exports.Player = Player;

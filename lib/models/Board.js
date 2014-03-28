"use strict";

var util = require('util'),
    readline = require('readline'),
    Player = require('./Player').Player,
    EventEmitter = require('events').EventEmitter,
    AI = require('./AI').AI,
    Board = require('./Board').Board,
    _und = require('underscore');


var Board = function(opts){
    opts = opts || {};

    this.matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    EventEmitter.call(this);
    return this;
}

// Make the turn an event emitter, for triggering actions + responses
util.inherits(Board, EventEmitter);


Board.prototype.display = function(rl, cb){
    var self = this;
    
    for(var r = 0; r < self.matrix.length; r++){
        var displayStr = '';
        for(var c = 0; c < self.matrix[r].length; c++){
            var markerStr = self.matrix[r][c].toString();
            var newStr = ' '+ markerStr.replace('0', '-').replace('-1', 'O').replace('1', 'X');
            displayStr += newStr;
        }
        rl.write( displayStr + '\n' );
    }
    if(cb) return cb(null);
};

Board.prototype.processCoords = function(player, row, col){
    this.matrix[row][col] = player.markerInt;
};

Board.prototype.getOpenCoords = function(){
    var self = this;
    var options = [];       // Takes the form of [{ row: Integer, column: Integer }]
    for(var r = 0; r < self.matrix.length; r++){
        for(var c = 0; c < self.matrix[r].length; c++){
            if(self.matrix[r][c] === 0) options.push({ row: r, column: c });
        }
    }
    return options;

};



Board.prototype.canMoveCoords = function(row, col){
    if( this.matrix[row][col] === 0 ) return true;
    else return false;
};

Board.prototype.isFinished = function(rl){
    var options = this.getOpenCoords();
    if(options.length === 0) return true;
    else return false;
};

// Win is defined as values in any row, column, or diagonal 
// summing to 3 * the player marker integer (-1 or 1)
Board.prototype.hasWon = function(player){
    var self = this;

    // Iterate thru the matrix rows, summing values
    function checkRows(matrix){
        var win = false;
        for(var r = 0; r < matrix.length; r++){
            var rowSum = 0;
            for(var t = 0; t < matrix[r].length; t++){
                rowSum += matrix[r][t]; 
            }
            if(rowSum === (player.markerInt * 3)){
                win = true;
                break;
            } 
        }
        return win;
    }

    // Zip up the matrix and re-test (turns rows into columns and vice versa)
    function checkColumns(matrix){
        var zippedMatrix = _und.zip(matrix);
        return checkRows(zippedMatrix)
    }

    //TODO use board dimensions instead of hardcoded indexes
    function checkDiagonals(matrix){
        if( matrix[0][0] + matrix[1][1] + matrix[2][2] === (player.markerInt * 3) ||
            matrix[0][2] + matrix[1][1] + matrix[2][0] === (player.markerInt * 3)) return true;
        else return false;
    }


    if( checkRows(self.matrix) || checkColumns(self.matrix) || checkDiagonals(self.matrix) ) return true;
    else return false;
}

exports.Board = Board;

"use strict";

var util = require('util'),
    Player = require('./Player').Player,
    Board = require('./Board').Board,
    _und = require('underscore');

var AI = function(opts){
    opts = opts || {};

    this.marker = opts.marker || 'O';
    this.markerInt = -1;

    return this;
}

AI.prototype.createRandomTurn = function(board, cb){
    var self = this;
    var coords = _und.shuffle(board.getOpenCoords())[0];
    board.processCoords( self, coords.row, coords.column);

    if(cb) return cb(null, board);
    else return;
};

exports.AI = AI;

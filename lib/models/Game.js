"use strict";

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Player = require('./Player').Player,
    AI = require('./AI').AI,
    Board = require('./Board').Board,
    readline = require('readline'),
    _und = require('underscore');


function Game(opts){
    opts = opts || {};
    var self = this;

    this.rl = opts.rl || readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    this.players = {
        me: new Player(),
        ai: new AI()
    };

    this.board = new Board( opts );

    EventEmitter.call(this);
}

// Make the turn an event emitter, for triggering actions + responses
util.inherits(Game, EventEmitter);

Game.prototype.play = function(){
    var self = this;
    
    //self.board.display(self.rl);
    if(Math.random() < 0.5 ){
        self.rl.write("AI has been chosen to go first\n");
        self.aiTurn();
    } else {
        self.rl.write("You have been chosen to go first\n");
        self.playerTurn();
    }
};

Game.prototype.playerTurn = function(){
    var self = this;
    self.rl.write('\n\n');
    self.rl.write("Your turn  \n");
    this.players.me.beginTurn(self.rl, self.board, function(err, board, rl){
        self.rl.write('\n\n');
        self.board.display(self.rl);
        if(self.board.hasWon( self.players.me ) ){
            //self.rl.write("You won! Congratulations!\n");
            self.emit('end', { win: true, winner: 'player' });
        } else if(self.board.isFinished(self.rl)){
            self.emit('end', { tie: true });
        } else {
            self.aiTurn();
        }
    });
};

Game.prototype.aiTurn = function(){
    var self = this;
    this.players.ai.createRandomTurn(self.board);
    self.rl.write('\n\n');

    self.rl.write("AI's turn\n");
    self.board.display(self.rl);

    if(self.board.hasWon( self.players.ai ) ){
        //self.rl.write("AI has won.  Bummer dude.\n");
        self.trigger('end', { win: true, winner: 'AI' });
    } else if(self.board.isFinished(self.rl)){
        self.emit('end', { tie: true });
    } else {
        self.playerTurn();
    }
};

exports.Game = Game;

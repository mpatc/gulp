'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];
    $scope.players = 0;
    $scope.isGame = false;
    $scope.gameReady = false;
    $scope.player1score = 0;
    $scope.player2score = 0;
    var gameZones = [1,2,3,4];
    var cats = ['fruit', 'veggies', 'dessert', 'booze'];
    var randomCat = Math.floor(Math.random()* 4);
    console.log('randomCat: ', randomCat);
    $scope.cats = cats[0];
    $scope.startGame = false;


    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.players = message.players;
      $scope.isGame = message.isGame;
      $scope.gameReady = message.gameReady;
      $scope.cats = message.cats;
      $scope.startGame = message.startGame;
      $scope.messages.unshift(message);
    });
    // var board1 = ChessBoard('board1', 'start');
    // $scope.board1 = board1;
    $scope.sendGame = function () {
      // Create a new message object
      var message = {
        text: 'I am ready to play! I am player 1, you can call me ' + this.gameText1,
        isGame: true
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.gameText1 = '';
    };
    $scope.sendGame2 = function () {
      var cats= 'thing';
      // Create a new message object
      var message = {
        text: 'I am ready to play! I am player 2, you can call me ' + this.gameText2,
        isGame: false,
        gameReady: true,
        cats: cats
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.gameText2 = '';
    };
    $scope.sendGame3 = function () {
      // Create a new message object
      var message = {
        text: 'Let us play! I picked!',
        startGame: $scope.cats,
        player1score: this.score1
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.gameText3 = '';
    };
    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
    $(document).ready(function(){
      console.log('hello');
      alert('hello');
      var board1 = ChessBoard('board1', 'start');
    })
  }
]);

(function(){
	var p = window.Pong = {
		// max size of stage
		width: window.innerWidth,
		height: window.innerHeight,
		// timer id
		timer: null,
		// directions of the ball
		direction: {
			x: true, y: false
		},
		// speed of the ball
		speed: 5,
		// cache of ball element
		ball: null,
		// cache of your paddle
		you: null,
		
		resize: function(){
			this.width	= window.innerWidth;
			this.height = window.innerHeight;
		},

		init: function(){
			$(document).bind('keydown', p.keypress);

			p.ball = $('#ball');
			p.you = $('#you');

			p.start();
		},
		start: function(){
			p.timer = setInterval( $.proxy( p.gameplay, p ), 10 );
		},
		stop: function(){
			clearInterval( this.timer );
			this.timer = null;
		},
		keypress: function(e){
			switch( e.keyCode ){
				case 00:
				case 13:
				case 27:
					p.timer === null ? p.start() : p.stop(); break;
				case 38:
					p.User.up();
					console.log( 'UP' ); break;
				case 40:
					p.User.down();
					console.log( 'DOWN' ); break;
				default:
					console.log( e.keyCode );
			}
		},
		gameplay: function(){
			var pos = p.ball.position();

			p.checkColisions( pos )

			p.moveBall( pos );
		},
		checkColisions: function(pos){
			if( pos.top <= 0 || ( pos.top + 10 ) >= this.height ){
				this.toggleY();
			}

			if( pos.left <= 0 || ( pos.left + 10 ) >= this.width ){
				this.toggleX();
			}
		},
		moveBall: function(pos){
			this._move.call(
				this.ball,
				this._calcMove( 'x', pos.left ),
				this._calcMove( 'y', pos.top )
			);
		},
		_move: function(x,y){
			this.css({
				left: x, top: y
			});
		},
		_calcMove: function(z,value){
			return (
				this.direction[ z ]
					? ( value + this.speed )
					: ( value - this.speed )
			) + 'px';
		},
		toggleX: function(){
			this.direction.x = !this.direction.x;
		},
		toggleY: function(){
			this.direction.y = !this.direction.y;
		},
		//TODO: abstract this to a user class
		User: {
			up: function(){
				p.you.css({
					top: ( p.you.position().top - p.speed * 2 ) + 'px'
				});
			},
			down: function(){
				p.you.css({
					top: ( p.you.position().top + p.speed * 2 ) + 'px'
				});
			}
		}
	};

	$(window).resize(
		$.proxy( p.resize, p )
	);

	$( p.init );
})();

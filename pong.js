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
		// cache o the keys
		key: {
			up: false, down: false
		},

		// TODO: check if the ball is below the new window size		
		resize: function(){
			this.stop();

			this.width	= window.innerWidth;
			this.height = window.innerHeight;

			this.start();
		},

		init: function(){
			$(document).bind('keyup',
				$.proxy( p.keyup, p )
			).bind('keydown',
				$.proxy( p.keydown, p )
			);

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
		keyup: function(e){
			switch( e.keyCode ){
				case 38:
					this.key.up = false; break;
				case 40:
					this.key.down = false; break;
				default:
					console.log( 'UP: ', e.keyCode );
			}
		},
		keydown: function(e){
			this.key.up = this.key.down = false;

			switch( e.keyCode ){
				case 00:
				case 27:
				case 32:
					this.timer === null ? this.start() : this.stop(); break;
				case 38:
					this.key.up = true; break;
				case 40:
					this.key.down = true; break;
				default:
					console.log( e.keyCode );
			}
		},
		gameplay: function(){
			var pos = this.ball.position();

			this.checkColisions( pos )

			this.moveBall( pos );

			this.moveUser();
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
		moveUser: function(){
			this.key.up && this.User.up();
			this.key.down && this.User.down();
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
			isTop: function(){
				
			},
			isBottom: function(){
			
			},
			up: function(){
				p.you.css({
					top: ( p.you.position().top - p.speed ) + 'px'
				});
			},
			down: function(){
				p.you.css({
					top: ( p.you.position().top + p.speed ) + 'px'
				});
			}
		}
	};

	$(window).resize(
		$.proxy( p.resize, p )
	);

	$( p.init );
})();

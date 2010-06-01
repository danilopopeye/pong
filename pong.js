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

			// stage sizes
			this.width	= window.innerWidth;
			this.height = window.innerHeight;

			// user paddle size
			this.User.height = this.you.outerHeight();

			this.start();
		},
		init: function(){
			$(document).bind('keyup',
				$.proxy( p.keyup, p )
			).bind('keydown',
				$.proxy( p.keydown, p )
			);

			this.ball = $('#ball');
			this.you = $('#you');

			this.User.height = this.you.outerHeight();

			this.start();
		},
		start: function(){
			this.timer = setInterval(
				$.proxy( this.gameplay, this ), 10
			);
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
			}
		},
		keydown: function(e){
			this.key.up = this.key.down = false;

			switch( e.keyCode ){
				case 13:
				case 27:
				case 32:
					this.timer === null ? this.start() : this.stop(); break;
				case 38:
					this.key.up = true; break;
				case 40:
					this.key.down = true; break;
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

			this.key.up	= this.key.up && this.User.position >= 5;
			this.key.down = this.key.down
				&& this.height - this.User.position - this.User.height > 5;
		},
		moveUser: function(){
			this.key.up && this.User.up();
			this.key.down && this.User.down();
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
		User: {
			position: 0,
			up: function(){
				this._move( p.speed * -1 );
			},
			down: function(){
				this._move( p.speed );
			},
			_move: function(s){
				p.you.css({
					top: ( this.position = p.you.position().top + s ) + 'px'
				});
			}
		}
	};

	$(window).resize(
		$.proxy( p.resize, p )
	);

	$( $.proxy( p.init, p ) );
})();

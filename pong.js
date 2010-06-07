(function(){
	var p = window.Pong = {
		// max size of stage
		width: window.innerWidth,
		height: window.innerHeight,

		// debug option
		debug: true,
		// debug element
		_debug: null,
		// timer id
		timer: null,
		// directions of the ball
		direction: {
			x: true, y: true
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
		// keep the score counter
		score: {
			element: null, you: 0, cpu: 0
		},

		init: function(){
			$(document).bind('keyup',
				$.proxy( p.keyup, p )
			).bind('keydown',
				$.proxy( p.keydown, p )
			);

			this.score.element = $('#score');
			this.ball = $('#ball');
			this.you = $('#you');

			this._debug = this.debug ? $('#debug') : !$('#debug').remove();

			this.User.height	= this.you.outerHeight();
			this.User.left		= this.you.position().left;

			// set the threshold
			this.width -= this.width % this.speed;

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

			this.checkColisions( pos );

			this.moveBall( pos );

			this.moveUser();
			
			this.debug && this.updateDebug(pos);
		},
		checkColisions: function(pos){
			var hitLeft = hitRight = false;

			if( pos.left + 10 >= this.width - 15 ){
				hitRight = this.between(
					pos.top + 5, this.User.top, this.User.top + this.User.height
				);

				!hitRight && pos.left == this.width && ++this.score.cpu && this.updateScore('cpu');
			} else if( pos.left <= 15 ){
				hitLeft = this.between(
					pos.top + 5, this.User.top, this.User.top + this.User.height
				);

				!hitLeft && pos.left == 0 && ++this.score.you && this.updateScore('you');
			}

			this.direction.x = hitRight || ( pos.left <= 0 || this.width - pos.left < this.speed )
				? !this.direction.x : this.direction.x;

			this.direction.y = hitLeft || pos.top <= 0 || this.height - pos.top - 10 < this.speed
				? !this.direction.y : this.direction.y;

			this.key.up	= this.key.up && this.User.top >= this.speed;

			this.key.down = this.key.down
				&& this.height - this.User.top - this.User.height > this.speed;
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
		User: {
			top: 0,
			up: function(){
				this._move( p.speed * -1 );
			},
			down: function(){
				this._move( p.speed );
			},
			_move: function(s){
				p.you.css({
					top: ( this.top = p.you.position().top + s ) + 'px'
				});
			}
		},
		updateScore: function(who){
			this.score.element.find( '.' + who ).text( this.score[ who ] );
		},
		updateDebug: function(p){
			this._debug.find('b')
				.eq(0).text( p.left )
			.end()
				.eq(1).text( p.top )
		},

		// TODO: check if the ball is below the new window size		
		resize: function(){
			this.stop();

			// stage sizes
			this.width	= window.innerWidth;
			this.height = window.innerHeight;

			// user paddle size
			this.User.height	= this.you.outerHeight();
			this.User.left		= this.you.position().left;

			this.start();
		},
		between: function(check,v1,v2){
			return v1 <= check && check <= v2;
		}	
	};

	$(window).resize(
		$.proxy( p.resize, p )
	);

	$( $.proxy( p.init, p ) );
})();

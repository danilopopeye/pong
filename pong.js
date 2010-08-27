(function(){
	// enable a element
	$.fn.enable = function(){
		return this.each(function(){
			$(this).removeAttr('disabled');
		});
	}

	// disable a element
	$.fn.disable = function(){
		return this.each(function(){
			$(this).attr('disabled',true);
		});
	}

	var p = window.Pong = {
		// max size of stage
		width: 800,
		height: 480,

		// debug option
		debug: false,
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

			// buttons
			this.buttons.start = $('#start');
			this.buttons.stop = $('#stop');

			// button click
			this.buttons.start.click( this.buttons.click.start );
			this.buttons.stop.click( this.buttons.click.stop );

			this.score.element = $('#score');
			this.ball = $('#ball');
			this.you = $('#you');

			this._debug = this.debug ? $('#debug') : !$('#debug').remove();

			this.User.height	= 95;
			this.User.left		= 790;
		},
		start: function(){
			this.timer = setInterval(
				$.proxy( this.gameplay, this ), this.debug ? 100 : 10
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
				pos.right = pos.left + 10;
				pos.bottom = pos.top + 10;

			this.User.move();

			this.checkColisions( pos );

			this.moveBall( pos );

			this.debug && this.updateDebug(pos);
		},
		checkColisions: function(pos){
			var hitLeft = hitRight = false,
				left	= pos.left == 10,
				right = pos.right + 10 == this.width,
				hitWall = pos.left == 0 || pos.right == this.width;

			hitRight = right && this.isHit( pos, this.User );

			hitWall && this.updateScore( pos );

			this.direction.x = hitRight || hitLeft || hitWall
				? !this.direction.x : this.direction.x;

			this.direction.y = this.direction.y && pos.bottom == this.height
				|| pos.top == 0 ? !this.direction.y : this.direction.y;

			this.key.up	= this.key.up;

			this.key.down = this.key.down;
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
			top: 190,
			move: function(){
				var key = p.key,
					direction =
						key.up && this.top
							? p.speed * -1 :
						key.down && p.height - this.top - this.height > 0
							? p.speed :
					0;

				direction && p.you.css({
					top: ( this.top = this.top + direction ) + 'px'
				});
			}
		},
		updateScore: function( pos ){
			var who = pos.left == 0 ? 'you' : 'cpu';
			this.score[ who ] += 1;
			this.score.element.find( '.' + who ).text( this.score[ who ] );
		},
		updateDebug: function(p){
			this._debug.find('b')
				.eq(0).text( p.left )
			.end()
				.eq(1).text( p.top )
		},
		isHit: function(ball,player){
			return ball.top + 10 > player.top && ball.top < player.top + player.height;
		},
		buttons: {
			click: {
				start: function(){
					p.start();
					p.buttons.start.disable();
					p.buttons.stop.enable();
				},
				stop: function(){
					p.stop();
					p.buttons.stop.disable();
					p.buttons.start.enable();
				}
			}
		}
	};

	$( $.proxy( p.init, p ) );
})();

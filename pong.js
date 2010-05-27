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

		init: function(){
			$(document).bind(
				$.browser.msie ? 'keydown' : 'keypress', p.keypress
			);

			p.ball = $('#ball');

			p.timer = setInterval( $.proxy( p.gameplay, p ), 10 );
		},
		stop: function(){
			clearInterval( this.timer );
		},
		keypress: function(e){
			switch( e.keyCode ){
				case 38:
					console.log( 'UP' ); break;
				case 40:
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
		}
	};

	$( p.init );
})();

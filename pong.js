(function(){
	var p = window.Pong = {
		width: window.innerWidth,
		width: window.innerWidth,
		timer: null,
		init: function(){
			$(document).keypress( p.keypress );
			
			p.timer = setInterval( p.gameplay, 100 );
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
			
		}
	};

	$( p.init );
})();

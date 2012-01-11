$(document).ready( function(){
	
	if( $('#time').size() ){
		var timeBoard = $('#time').Flipper({
			dimensions: [10, 1],
			text : '',
			fontSize: 120,
			alphabet : [ ':', 'a', 'p', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',  ],
			skipAnimationThreshold: 2
		});
	
	
		var ti = setInterval( function(){
			timeBoard.updateString( createDateString() );
		}, 1000 );
	}
	
	if( $('#twitter').size() ){
		var twitterBoard = $('#twitter').Flipper({
			dimensions : [22, 12],
			text : '',
			fontSize: 24,
			alphabet : [
				' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
				'.', '?', '!', '@', '#', ':', ',', '"', '\'', '/', ';', '(', ')', '%', '-', '–','&', '$', '_'
			 ],
			skipAnimationThreshold : 3,
			lineDelay: 1000,
			textOffset : {
				v : 3
			}
		});

		function getLatestMessage(){
			$.getJSON( 'http://search.twitter.com/search.json?q=' + search + '&callback=?&rpp=1&lang=en', function( data ){
				
				var text = data.results[0].text.toUpperCase();
				var name = data.results[0].from_user_name.toUpperCase();
				
				console.log( '"' + text + '" BY ' + name );
				
				twitterBoard.updateString( '"' + text + '" BY ' + name );
				
				clearInterval( ti );
				
				ti = setInterval( function(){
					getLatestMessage();
				}, 20000 );			
			});
		}

		var search = '2012';
		var ti;	
	
		getLatestMessage();
	
		$('#newSearch').click( function(){
			search = $('#search').val();
			getLatestMessage();
		});
	}
	
	function createDateString(){
		var date = new Date();
		
		var tod = twentyFourToTwelve( date.getHours() );
		var hours = tod.hour; 
		var minutes = zeroFill( date.getMinutes() );
		var seconds = zeroFill( date.getSeconds() );
		
		return hours + ':' + minutes + ':' + seconds + tod.tod;
	}
			
	function zeroFill( num ){
		if( num < 10 ){
			return '0' + num;
		} else {
			return num;
		}
	}
	
	function twentyFourToTwelve( num ){
		if( num > 12 ){
			return {
				hour : zeroFill( num - 12 ) + '',
				tod : 'pm',
			}
		} else {
			return {
				hour : zeroFill( num ) + '',
				tod : 'am'
			}
		}
	}
});
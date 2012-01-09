$(document).ready( function(){
	
	if( $('#time').size() ){
		var timeBoard = $('#time').FlipBoard({
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
		var twitterBoard = $('#twitter').FlipBoard({
			dimensions : [22, 12],
			text : '',
			fontSize: 24,
			alphabet : [
				' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
				'.', '?', '!', '@', '#', ':', ',', '"', '\'', '/', ';', '(', ')', '%', '-', '–','&', '$', '_'
			 ],
			skipAnimationThreshold : 3,
			lineDelay: 1000	
		});

		function getLatestMessage(){
			$.getJSON( 'http://search.twitter.com/search.json?q=' + search + '&callback=?&rpp=1&lang=en', function( data ){
				
				var text = data.results[0].text.toUpperCase();
				var name = data.results[0].from_user_name.toUpperCase();
				
				console.log( '"' + text + '" BY ' + name );
				
				twitterBoard.updateString( '"' + text + '" BY ' + name );
			
				clearInterval(ti);
			
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
		
	// var board = $('#board').FlipBoard({
	// 	dimensions : [28, 5],
	// 	text : 'This is David Drew, co-founder of http://NoSweaters.com, verifying authenticity for deepshark.',
	// 	fontSize: 30
	// });
	
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

(function($){
	$.fn.FlipBoard = function( userOptions ){
		var options = {
			dimensions : null, // * Board width x height in an array format: [10, 5] is equivalent to a 10w by 5h board.
			alphabet : [ 
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ',
				'.', '?', '!', '@', '#', ':', ',', '"', '\'', '/', ';', '(', ')', '%', '-',				 
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
			 ],
			flipSpeed : 50,
			fontSize: 120,
			callback : function(){},
			align : 'center', // left, center and right
			skipAnimationThreshold : 5,
			lineDelay : 500
		};
		
		$.extend( options, userOptions );
		
		var $el = $(this);
		var panelWidth = 0;
		var board = [];
		
		for( r = 0; r < options.dimensions[1]; r++ ){
			
			var $row = jQuery('<div class="panel-row" />');
			$el.append( $row );
			board.push([]);				
			
			for( c = 0; c < options.dimensions[0]; c++ ){
				var $panel = jQuery('<div class="flipper-container"><div class="pers-wrapper top"><div class="stationary-panel"><span></span></div><div class="panel"><span></span></div></div><div class="pers-wrapper bottom"><div class="stationary-panel"><span></span></div><div class="panel"><span></span></div></div></div>');
				$row.append( $panel );
				board[r].push('');
				
				$panel.find('span').css({
					fontSize : options.fontSize,
				});
				
				$panel.find('.bottom span').css({
					top : '-' + ( options.fontSize / 1.5 ) + 'px'					
				});
				
				$panel.find('.panel, .stationary-panel').css({
					height: options.fontSize / 1.5,
					borderBottomWidth : Math.ceil( ( options.fontSize / 1.5 ) * .0322 )
				});
				
				if( r === 0 && c === 0 ){ // First time through, first panel
					$panel.find('span').text('W');
					panelWidth = $panel.find('span').first().width();
				}
				
				bRadius = ( panelWidth * .1 );
				
				$panel.find('.top .panel, .top .stationary-panel').css({
					"-moz-border-radius-topleft" : bRadius + 'px',
					"-moz-border-radius-topright" : bRadius + 'px',
					"-webkit-border-radius" : bRadius + "px " + bRadius + "px 0 0",
					"border-radius" : bRadius + "px " + bRadius + "px 0 0",
				});				

				$panel.find('.bottom .panel, .bottom .stationary-panel').css({
					"-moz-border-radius-bottomleft" : bRadius + 'px',
					"-moz-border-radius-bottomright" : bRadius + 'px',
					"-webkit-border-radius" : "0 0 " + bRadius + "px " + bRadius + "px",
					"border-radius" : "0 0 " + bRadius + "px " + bRadius + "px",
				});
				
				$panel.find('span').text(' ');

				$panel.find('span').css('width', panelWidth);					
			}
		}
					
		function getCurrentBoard(){
			var $rows = $el.find('.panel-row');
			var currentBoard = [];
			
			$.each( $rows, function(){
				var $row = $(this);
				var $panels = $row.find('.top .stationary-panel span');
				var panelVals = [];
				
				$.each( $panels, function(){
					var $panel = $(this);
					
					panelVals.push( $panel.text() );
				});
				
				currentBoard.push( panelVals );
			});
			
			return currentBoard;
		}
		
		function createNewBoard( str ){
			var lineLength = options.dimensions[0];
			var lines = options.dimensions[1];
			var newBoard = [];
			var strSplode = str.split(' ');
			var currentWordIndex = 0;
			
			for( i = 0; i < lines; i++ ){
				var thisLine = lineLength;
				var line = [];
				var lineHasRoom = true;
				
				while( lineHasRoom ){
					if( _.isString( strSplode[currentWordIndex] ) && strSplode[currentWordIndex].length <= thisLine ){
						var wordAsArray = [];
						
						for( charIndex in strSplode[currentWordIndex] ){
							line.push( strSplode[currentWordIndex][charIndex] );
						}
												
						thisLine -= strSplode[currentWordIndex].length;
						
						if( thisLine !== 0 ){
							line.push(' ');
							thisLine--;	
						}
						
						currentWordIndex++;
					} else if( thisLine !== 0 ){
						line.push(' ');
						thisLine--;	
					} else {
						lineHasRoom = false;
					}
				}
				
				newBoard.push( line );
			}
							
			return newBoard;
		}
				
		function panelChangeDispatch( toChange ){
			var $panels = $el.find('.flipper-container');
			
			for( i = 0; i < toChange.length; i++ ){
								
				for( panelIndex in toChange[i] ){
					var $panel = $( $panels[parseInt(panelIndex, 10) + (i * board[0].length)] );
					var currentText = $panel.find('span').first().text();
					var toText = toChange[i][panelIndex];
					var current = options.alphabet.indexOf( currentText );
					var to = options.alphabet.indexOf( toText ) === -1 ? 0 : options.alphabet.indexOf( toText );
									
					if( options.dimensions[1] > 1 ){
						var delay = i * options.lineDelay;
						delayFlipGo( $panel, current, to, delay );
					} else {
						flipGo( $panel, current, to );
					}
				}
			};
		}
		
		function delayFlipGo( $panel, current, to, delay ){
			setTimeout( function(){
				flipGo( $panel, current, to );
			}, delay);			
		}
				
		function flipGo( $panel, current, to ){
			var direction = 1;
			
			if( current === to ){
				direction = 0;
			}
												
			switch( direction ){
				case 0:
					break;
				case 1:
					var skipAnimation = doSkipAnimation( current, to, options.alphabet.length );
					current = options.alphabet[ current + 1 ] ? current : -1;
					var next = options.alphabet[ current + 1 ]					
					var $def = $.Deferred();
										
					flipUp( next, $panel, skipAnimation, $def );
					
					$.when( $def ).then( function(){
						current++;																
						flipGo( $panel, current, to );
					});							
					break;
			}
		}
		
		function flipUp( next, $panel, skip, $def ){
				
			var $topPanel = $panel.find('.top .panel');
			var $topSPanelSpan = $panel.find('.top .stationary-panel span');
			var $bottomPanel = $panel.find('.bottom .panel');
			var $bottomSPanelSpan = $panel.find('.bottom .stationary-panel span');
			
			if( skip ){
				$topPanel.find('span').text( next );
				$bottomPanel.find('span').text( next );				
				$topSPanelSpan.text( next );
				$bottomSPanelSpan.text( next )
				
				setTimeout( function(){			
					$def.resolve();
				}, 50)
				
			} else {
			
				$topSPanelSpan.text(next);			
				$bottomPanel.children('span').text(next);
			
				$topPanel.on('webkitAnimationEnd animationend', function(){
					$topPanel.removeClass('topFlipDown');
					$topPanel.children('span').text(next);	
					$bottomPanel.addClass('bottomFlipDown');
				});
		
				$bottomPanel.on('webkitAnimationEnd animationend', function(){
					$bottomPanel.removeClass('bottomFlipDown');
					$bottomSPanelSpan.text(next);
					$topPanel.off('webkitAnimationEnd animationend');
					$bottomPanel.off('webkitAnimationEnd animationend');							
					$def.resolve();								
				});
			
				$topPanel.addClass('topFlipDown');			
			}
		}
		
		function doSkipAnimation( currentIndex, toIndex, alphaLength ){			
			if( currentIndex < toIndex ){
				if( currentIndex + options.skipAnimationThreshold > toIndex ){
					return false;
				} else {
					return true;
				}
			} else {
				
				var lengthToEnd = alphaLength - currentIndex;
				
				if( ( lengthToEnd + toIndex ) > options.skipAnimationThreshold ){
					return true;
				} else {
					return false;
				}
			}
		}

		function difference(template, override) {
		    var ret = {};
		    for (var name in template) {
		        if (name in override) {
		            if (_.isObject(override[name]) && !_.isArray(override[name])) {
		                var diff = difference(template[name], override[name]);
		                if (!_.isEmpty(diff)) {
		                    ret[name] = diff;
		                }
		            } else if (!_.isEqual(template[name], override[name])) {
		                ret[name] = override[name];
		            }
		        }
		    }
		    return ret;
		}		
		
		var tools = {
			updateString : function( str ){
				var cBoard = getCurrentBoard();
				var nBoard = createNewBoard( str );
				
				var differences = [];
				
				for( i = 0; i < cBoard.length; i++ ){
					differences.push( difference( cBoard[i], nBoard[i] ) );
				}
				
				panelChangeDispatch( differences );
			},
			overrideWidth : function( panelIndex, newWidth ){ //  panelIndex can be a number or an array of numbers.
				if( _.isArray(panelIndex) ){
					
					$.each( panelIndex, function(){
						
						var thisIndex;
						
						if( _.isString( this ) ){
							thisIndex = parseInt( this, 10 );
						} else {
							thisIndex = this;
						}
						 
						
						$el.find('.flipper-container').eq( thisIndex ).find('span').width( newWidth );
					});
					
				} else {
					
					if( _.isString( panelIndex ) ){
						panelIndex = parseInt( panelIndex, 10 );
					}
					
					$el.find('.flipper-container').eq( panelIndex ).find('span').width( newWidth );
				}
			}
		};
		
		tools.updateString( options.text );	
		
		$.when( this ).then( function(){
			options.callback.apply();
		});
						
		return tools;
	}
})(jQuery);
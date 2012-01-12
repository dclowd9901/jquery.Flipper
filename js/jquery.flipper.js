(function($){
	$.fn.Flipper = function( userOptions ){
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
			lineDelay : 500,
			textOffset : {
				h : 0,
				v : 0
			}
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
					fontSize : options.fontSize
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
				
				$panel.find('span').css({
					top : ( options.textOffset.v >= 0 ) ? '+=' + options.textOffset.v + 'px' : '-=' + Math.abs( options.textOffset.v ) + 'px',
					left : ( options.textOffset.h >= 0 ) ? '+=' + options.textOffset.h + 'px' : '-=' + Math.abs( options.textOffset.h ) + 'px'
				});								
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

//     Underscore.js 1.3.0
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function(){function z(a,b,c){if(a===b)return a!==0||1/a==1/b;if(a==null||b==null)return a===b;if(a._chain)a=a._wrapped;if(b._chain)b=b._wrapped;if(a.isEqual&&w.isFunction(a.isEqual))return a.isEqual(b);if(b.isEqual&&w.isFunction(b.isEqual))return b.isEqual(a);var d=i.call(a);if(d!=i.call(b))return false;switch(d){case"[object String]":return a==String(b);case"[object Number]":return a!=+a?b!=+b:a==0?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":return+a==+b;case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if(typeof a!="object"||typeof b!="object")return false;var e=c.length;while(e--){if(c[e]==a)return true}c.push(a);var f=0,g=true;if(d=="[object Array]"){f=a.length;g=f==b.length;if(g){while(f--){if(!(g=f in a==f in b&&z(a[f],b[f],c)))break}}}else{if("constructor"in a!="constructor"in b||a.constructor!=b.constructor)return false;for(var h in a){if(j.call(a,h)){f++;if(!(g=j.call(b,h)&&z(a[h],b[h],c)))break}}if(g){for(h in b){if(j.call(b,h)&&!(f--))break}g=!f}}c.pop();return g}var a=this;var b=a._;var c={};var d=Array.prototype,e=Object.prototype,f=Function.prototype;var g=d.slice,h=d.unshift,i=e.toString,j=e.hasOwnProperty;var k=d.forEach,l=d.map,m=d.reduce,n=d.reduceRight,o=d.filter,p=d.every,q=d.some,r=d.indexOf,s=d.lastIndexOf,t=Array.isArray,u=Object.keys,v=f.bind;var w=function(a){return new A(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports){exports=module.exports=w}exports._=w}else{a["_"]=w}w.VERSION="1.3.0";var x=w.each=w.forEach=function(a,b,d){if(a==null)return;if(k&&a.forEach===k){a.forEach(b,d)}else if(a.length===+a.length){for(var e=0,f=a.length;e<f;e++){if(e in a&&b.call(d,a[e],e,a)===c)return}}else{for(var g in a){if(j.call(a,g)){if(b.call(d,a[g],g,a)===c)return}}}};var y=function(){};w.isEqual=function(a,b){return z(a,b,[])};w.isEmpty=function(a){if(w.isArray(a)||w.isString(a))return a.length===0;for(var b in a)if(j.call(a,b))return false;return true};w.isArray=t||function(a){return i.call(a)=="[object Array]"};w.isObject=function(a){return a===Object(a)};w.isFunction=function(a){return i.call(a)=="[object Function]"};w.isString=function(a){return i.call(a)=="[object String]"};var A=function(a){this._wrapped=a};w.prototype=A.prototype;var B=function(a,b){return b?w(a).chain():a};var C=function(a,b){A.prototype[a]=function(){var a=g.call(arguments);h.call(a,this._wrapped);return B(b.apply(w,a),this._chain)}};w.mixin(w);x(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=d[a];A.prototype[a]=function(){var c=this._wrapped;b.apply(c,arguments);var d=c.length;if((a=="shift"||a=="splice")&&d===0)delete c[0];return B(c,this._chain)}});x(["concat","join","slice"],function(a){var b=d[a];A.prototype[a]=function(){return B(b.apply(this._wrapped,arguments),this._chain)}});A.prototype.chain=function(){this._chain=true;return this};A.prototype.value=function(){return this._wrapped}}).call(this)
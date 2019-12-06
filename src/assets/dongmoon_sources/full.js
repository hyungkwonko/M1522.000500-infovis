//https://github.com/davidchambers/Base64.js

;(function () {
    var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';
  
    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    object.btoa || (
    object.btoa = function (input) {
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next input index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        input.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = input.charCodeAt(idx += 3/4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    });
  
    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    object.atob || (
    object.atob = function (input) {
      input = input.replace(/=+$/, '')
      if (input.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = input.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
      }
      return output;
    });
  
  }());


  /**
 * @license -------------------------------------------------------------------
 *   module: Base64Binary
 *      src: http://blog.danguer.com/2011/10/24/base64-binary-decoding-in-javascript/
 *  license: Simplified BSD License
 * -------------------------------------------------------------------
 * Copyright 2011, Daniel Guerrero. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = Math.ceil( (3*input.length) / 4.0);
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-1));		 

		var bytes = Math.ceil( (3*input.length) / 4.0);
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;	
	}
};



/**
 * @license -------------------------------------------------------------------
 *   module: WebAudioShim - Fix naming issues for WebAudioAPI supports
 *      src: https://github.com/Dinahmoe/webaudioshim
 *   author: Dinahmoe AB
 * -------------------------------------------------------------------
 * Copyright (c) 2012 DinahMoe AB
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext || null;

(function (Context) {
	var isFunction = function (f) {
		return Object.prototype.toString.call(f) === "[object Function]" ||
			Object.prototype.toString.call(f) === "[object AudioContextConstructor]";
	};
	var contextMethods = [
		["createGainNode", "createGain"],
		["createDelayNode", "createDelay"],
		["createJavaScriptNode", "createScriptProcessor"]
	];
	///
	var proto;
	var instance;
	var sourceProto;
	///
	if (!isFunction(Context)) {
		return;
	}
	instance = new Context();
	if (!instance.destination || !instance.sampleRate) {
		return;
	}
	proto = Context.prototype;
	sourceProto = Object.getPrototypeOf(instance.createBufferSource());

	if (!isFunction(sourceProto.start)) {
		if (isFunction(sourceProto.noteOn)) {
			sourceProto.start = function (when, offset, duration) {
				switch (arguments.length) {
					case 0:
						throw new Error("Not enough arguments.");
					case 1:
						this.noteOn(when);
						break;
					case 2:
						if (this.buffer) {
							this.noteGrainOn(when, offset, this.buffer.duration - offset);
						} else {
							throw new Error("Missing AudioBuffer");
						}
						break;
					case 3:
						this.noteGrainOn(when, offset, duration);
				}
			};
		}
	}

	if (!isFunction(sourceProto.noteOn)) {
		sourceProto.noteOn = sourceProto.start;
	}

	if (!isFunction(sourceProto.noteGrainOn)) {
		sourceProto.noteGrainOn = sourceProto.start;
	}

	if (!isFunction(sourceProto.stop)) {
		sourceProto.stop = sourceProto.noteOff;
	}

	if (!isFunction(sourceProto.noteOff)) {
		sourceProto.noteOff = sourceProto.stop;
	}

	contextMethods.forEach(function (names) {
		var name1;
		var name2;
		while (names.length) {
			name1 = names.pop();
			if (isFunction(this[name1])) {
				this[names.pop()] = this[name1];
			} else {
				name2 = names.pop();
				this[name1] = this[name2];
			}
		}
	}, proto);
})(window.AudioContext);


/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Initialize the MIDI library.
(function (global) {
    'use strict';
    var midiIO, _requestMIDIAccess, MIDIAccess, _onReady, MIDIPort, MIDIInput, MIDIOutput, _midiProc;

    function Promise() {

    }

    Promise.prototype.then = function(accept, reject) {
        this.accept = accept; 
        this.reject = reject;
    }

    Promise.prototype.succeed = function(access) {
        if (this.accept)
            this.accept(access);
    }

    Promise.prototype.fail = function(error) {
        if (this.reject)
            this.reject(error);
    }

    function _JazzInstance() {
        this.inputInUse = false;
        this.outputInUse = false;

        // load the Jazz plugin
        var o1 = document.createElement("object");
        o1.id = "_Jazz" + Math.random() + "ie";
        o1.classid = "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90";

        this.activeX = o1;

        var o2 = document.createElement("object");
        o2.id = "_Jazz" + Math.random();
        o2.type="audio/x-jazz";
        o1.appendChild(o2);

        this.objRef = o2;

        var e = document.createElement("p");
        e.appendChild(document.createTextNode("This page requires the "));

        var a = document.createElement("a");
        a.appendChild(document.createTextNode("Jazz plugin"));
        a.href = "http://jazz-soft.net/";

        e.appendChild(a);
        e.appendChild(document.createTextNode("."));
        o2.appendChild(e);

        var insertionPoint = document.getElementById("MIDIPlugin");
        if (!insertionPoint) {
            // Create hidden element
            var insertionPoint = document.createElement("div");
            insertionPoint.id = "MIDIPlugin";
            insertionPoint.style.position = "absolute";
            insertionPoint.style.visibility = "hidden";
            insertionPoint.style.left = "-9999px";
            insertionPoint.style.top = "-9999px";
            document.body.appendChild(insertionPoint);
        }
        insertionPoint.appendChild(o1);

        if (this.objRef.isJazz)
            this._Jazz = this.objRef;
        else if (this.activeX.isJazz)
            this._Jazz = this.activeX;
        else
            this._Jazz = null;
        if (this._Jazz) {
            this._Jazz._jazzTimeZero = this._Jazz.Time();
            this._Jazz._perfTimeZero = window.performance.now();
        }
    }

    _requestMIDIAccess = function _requestMIDIAccess() {
        var access = new MIDIAccess();
        return access._promise;
    };

    // API Methods

    MIDIAccess = function() {
        this._jazzInstances = new Array();
        this._jazzInstances.push( new _JazzInstance() );
        this._promise = new Promise;

        if (this._jazzInstances[0]._Jazz) {
            this._Jazz = this._jazzInstances[0]._Jazz;
            window.setTimeout( _onReady.bind(this), 3 );
        } else {
            window.setTimeout( _onNotReady.bind(this), 3 );
        }
    };

    _onReady = function _onReady() {
        if (this._promise)
            this._promise.succeed(this);
    };

    function _onNotReady() {
        if (this._promise)
            this._promise.fail( { code: 1 } );
    };

    MIDIAccess.prototype.inputs = function(  ) {
        if (!this._Jazz)
              return null;
        var list=this._Jazz.MidiInList();
        var inputs = new Array( list.length );

        for ( var i=0; i<list.length; i++ ) {
            inputs[i] = new MIDIInput( this, list[i], i );
        }
        return inputs;
    }

    MIDIAccess.prototype.outputs = function(  ) {
        if (!this._Jazz)
            return null;
        var list=this._Jazz.MidiOutList();
        var outputs = new Array( list.length );

        for ( var i=0; i<list.length; i++ ) {
            outputs[i] = new MIDIOutput( this, list[i], i );
        }
        return outputs;
    };

    MIDIInput = function MIDIInput( midiAccess, name, index ) {
        this._listeners = [];
        this._midiAccess = midiAccess;
        this._index = index;
        this._inLongSysexMessage = false;
        this._sysexBuffer = new Uint8Array();
        this.id = "" + index + "." + name;
        this.manufacturer = "";
        this.name = name;
        this.type = "input";
        this.version = "";
        this.onmidimessage = null;

        var inputInstance = null;
        for (var i=0; (i<midiAccess._jazzInstances.length)&&(!inputInstance); i++) {
            if (!midiAccess._jazzInstances[i].inputInUse)
                inputInstance=midiAccess._jazzInstances[i];
        }
        if (!inputInstance) {
            inputInstance = new _JazzInstance();
            midiAccess._jazzInstances.push( inputInstance );
        }
        inputInstance.inputInUse = true;

        this._jazzInstance = inputInstance._Jazz;
        this._input = this._jazzInstance.MidiInOpen( this._index, _midiProc.bind(this) );
    };

    // Introduced in DOM Level 2:
    MIDIInput.prototype.addEventListener = function (type, listener, useCapture ) {
        if (type !== "midimessage")
            return;
        for (var i=0; i<this._listeners.length; i++)
            if (this._listeners[i] == listener)
                return;
        this._listeners.push( listener );
    };

    MIDIInput.prototype.removeEventListener = function (type, listener, useCapture ) {
        if (type !== "midimessage")
            return;
        for (var i=0; i<this._listeners.length; i++)
            if (this._listeners[i] == listener) {
                this._listeners.splice( i, 1 );  //remove it
                return;
            }
    };

    MIDIInput.prototype.preventDefault = function() {
        this._pvtDef = true;
    };

    MIDIInput.prototype.dispatchEvent = function (evt) {
        this._pvtDef = false;

        // dispatch to listeners
        for (var i=0; i<this._listeners.length; i++)
            if (this._listeners[i].handleEvent)
                this._listeners[i].handleEvent.bind(this)( evt );
            else
                this._listeners[i].bind(this)( evt );

        if (this.onmidimessage)
            this.onmidimessage( evt );

        return this._pvtDef;
    };

    MIDIInput.prototype.appendToSysexBuffer = function ( data ) {
        var oldLength = this._sysexBuffer.length;
        var tmpBuffer = new Uint8Array( oldLength + data.length );
        tmpBuffer.set( this._sysexBuffer );
        tmpBuffer.set( data, oldLength );
        this._sysexBuffer = tmpBuffer;
    };

    MIDIInput.prototype.bufferLongSysex = function ( data, initialOffset ) {
        var j = initialOffset;
        while (j<data.length) {
            if (data[j] == 0xF7) {
                // end of sysex!
                j++;
                this.appendToSysexBuffer( data.slice(initialOffset, j) );
                return j;
            }
            j++;
        }
        // didn't reach the end; just tack it on.
        this.appendToSysexBuffer( data.slice(initialOffset, j) );
        this._inLongSysexMessage = true;
        return j;
    };

    _midiProc = function _midiProc( timestamp, data ) {
        // Have to use createEvent/initEvent because IE10 fails on new CustomEvent.  Thanks, IE!
        var length = 0;
        var i,j;
        var isSysexMessage = false;

        // Jazz sometimes passes us multiple messages at once, so we need to parse them out
        // and pass them one at a time.

        for (i=0; i<data.length; i+=length) {
            if (this._inLongSysexMessage) {
                i = this.bufferLongSysex(data,i);
                if ( data[i-1] != 0xf7 ) {
                    // ran off the end without hitting the end of the sysex message
                    return;
                }
                isSysexMessage = true;
            } else {
                isSysexMessage = false;
                switch (data[i] & 0xF0) {
                    case 0x80:  // note off
                    case 0x90:  // note on
                    case 0xA0:  // polyphonic aftertouch
                    case 0xB0:  // control change
                    case 0xE0:  // channel mode
                        length = 3;
                        break;

                    case 0xC0:  // program change
                    case 0xD0:  // channel aftertouch
                        length = 2;
                        break;

                    case 0xF0:
                        switch (data[i]) {
                            case 0xf0:  // variable-length sysex.
                                i = this.bufferLongSysex(data,i);
                                if ( data[i-1] != 0xf7 ) {
                                    // ran off the end without hitting the end of the sysex message
                                    return;
                                }
                                isSysexMessage = true;
                                break;

                            case 0xF1:  // MTC quarter frame
                            case 0xF3:  // song select
                                length = 2;
                                break;

                            case 0xF2:  // song position pointer
                                length = 3;
                                break;

                            default:
                                length = 1;
                                break;
                        }
                        break;
                }
            }
            var evt = document.createEvent( "Event" );
            evt.initEvent( "midimessage", false, false );
            evt.receivedTime = parseFloat( timestamp.toString()) + this._jazzInstance._perfTimeZero;
            if (isSysexMessage || this._inLongSysexMessage) {
                evt.data = new Uint8Array( this._sysexBuffer );
                this._sysexBuffer = new Uint8Array(0);
                this._inLongSysexMessage = false;
            } else
                evt.data = new Uint8Array(data.slice(i, length+i));
            this.dispatchEvent( evt );
        }
    };

    MIDIOutput = function MIDIOutput( midiAccess, name, index ) {
        this._listeners = [];
        this._midiAccess = midiAccess;
        this._index = index;
        this.id = "" + index + "." + name;
        this.manufacturer = "";
        this.name = name;
        this.type = "output";
        this.version = "";

        var outputInstance = null;
        for (var i=0; (i<midiAccess._jazzInstances.length)&&(!outputInstance); i++) {
            if (!midiAccess._jazzInstances[i].outputInUse)
                outputInstance=midiAccess._jazzInstances[i];
        }
        if (!outputInstance) {
            outputInstance = new _JazzInstance();
            midiAccess._jazzInstances.push( outputInstance );
        }
        outputInstance.outputInUse = true;

        this._jazzInstance = outputInstance._Jazz;
        this._jazzInstance.MidiOutOpen(this.name);
    };

    function _sendLater() {
        this.jazz.MidiOutLong( this.data );    // handle send as sysex
    }

    MIDIOutput.prototype.send = function( data, timestamp ) {
        var delayBeforeSend = 0;
        if (data.length === 0)
            return false;

        if (timestamp)
            delayBeforeSend = Math.floor( timestamp - window.performance.now() );

        if (timestamp && (delayBeforeSend>1)) {
            var sendObj = new Object();
            sendObj.jazz = this._jazzInstance;
            sendObj.data = data;

            window.setTimeout( _sendLater.bind(sendObj), delayBeforeSend );
        } else {
            this._jazzInstance.MidiOutLong( data );
        }
        return true;
    };

    //init: create plugin
    if (!window.navigator.requestMIDIAccess)
        window.navigator.requestMIDIAccess = _requestMIDIAccess;

}(window));

// Polyfill window.performance.now() if necessary.
(function (exports) {
    var perf = {}, props;

    function findAlt() {
        var prefix = ['moz', 'webkit', 'o', 'ms'],
        i = prefix.length,
            //worst case, we use Date.now()
            props = {
                value: (function (start) {
                    return function () {
                        return Date.now() - start;
                    };
                }(Date.now()))
            };

        //seach for vendor prefixed version
        for (; i >= 0; i--) {
            if ((prefix[i] + "Now") in exports.performance) {
                props.value = function (method) {
                    return function () {
                        exports.performance[method]();
                    }
                }(prefix[i] + "Now");
                return props;
            }
        }

        //otherwise, try to use connectionStart
        if ("timing" in exports.performance && "connectStart" in exports.performance.timing) {
            //this pretty much approximates performance.now() to the millisecond
            props.value = (function (start) {
                return function() {
                    Date.now() - start;
                };
            }(exports.performance.timing.connectStart));
        }
        return props;
    }

    //if already defined, bail
    if (("performance" in exports) && ("now" in exports.performance))
        return;
    if (!("performance" in exports))
        Object.defineProperty(exports, "performance", {
            get: function () {
                return perf;
            }});
        //otherwise, performance is there, but not "now()"

    props = findAlt();
    Object.defineProperty(exports.performance, "now", props);
}(window));




/* Wrapper for accessing strings through sequential reads */
function Stream(str) {
	var position = 0;
	
	function read(length) {
		var result = str.substr(position, length);
		position += length;
		return result;
	}
	
	/* read a big-endian 32-bit integer */
	function readInt32() {
		var result = (
			(str.charCodeAt(position) << 24)
			+ (str.charCodeAt(position + 1) << 16)
			+ (str.charCodeAt(position + 2) << 8)
			+ str.charCodeAt(position + 3));
		position += 4;
		return result;
	}

	/* read a big-endian 16-bit integer */
	function readInt16() {
		var result = (
			(str.charCodeAt(position) << 8)
			+ str.charCodeAt(position + 1));
		position += 2;
		return result;
	}
	
	/* read an 8-bit integer */
	function readInt8(signed) {
		var result = str.charCodeAt(position);
		if (signed && result > 127) result -= 256;
		position += 1;
		return result;
	}
	
	function eof() {
		return position >= str.length;
	}
	
	/* read a MIDI-style variable-length integer
		(big-endian value in groups of 7 bits,
		with top bit set to signify that another byte follows)
	*/
	function readVarInt() {
		var result = 0;
		while (true) {
			var b = readInt8();
			if (b & 0x80) {
				result += (b & 0x7f);
				result <<= 7;
			} else {
				/* b is the last byte */
				return result + b;
			}
		}
	}
	
	return {
		'eof': eof,
		'read': read,
		'readInt32': readInt32,
		'readInt16': readInt16,
		'readInt8': readInt8,
		'readVarInt': readVarInt
	}
}



/*
class to parse the .mid file format
(depends on stream.js)
*/
function MidiFile(data) {
	function readChunk(stream) {
		var id = stream.read(4);
		var length = stream.readInt32();
		return {
			'id': id,
			'length': length,
			'data': stream.read(length)
		};
	}
	
	var lastEventTypeByte;
	
	function readEvent(stream) {
		var event = {};
		event.deltaTime = stream.readVarInt();
		var eventTypeByte = stream.readInt8();
		if ((eventTypeByte & 0xf0) == 0xf0) {
			/* system / meta event */
			if (eventTypeByte == 0xff) {
				var subtypeByte = stream.readInt8();
				var length = stream.readVarInt();

				/* meta event */
				event.type = 'meta';
				event.status = subtypeByte;

				switch(subtypeByte) {
					case 0x00:
						event.subtype = 'sequenceNumber';
						if (length != 2) throw "Expected length for sequenceNumber event is 2, got " + length;
						event.number = stream.readInt16();
						return event;
					case 0x01:
						event.subtype = 'text';
						event.text = stream.read(length);
						return event;
					case 0x02:
						event.subtype = 'copyrightNotice';
						event.text = stream.read(length);
						return event;
					case 0x03:
						event.subtype = 'trackName';
						event.text = stream.read(length);
						return event;
					case 0x04:
						event.subtype = 'instrumentName';
						event.text = stream.read(length);
						return event;
					case 0x05:
						event.subtype = 'lyrics';
						event.text = stream.read(length);
						return event;
					case 0x06:
						event.subtype = 'marker';
						event.text = stream.read(length);
						return event;
					case 0x07:
						event.subtype = 'cuePoint';
						event.text = stream.read(length);
						return event;
					case 0x20:
						event.subtype = 'midiChannelPrefix';
						if (length != 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
						event.channel = stream.readInt8();
						return event;
					case 0x2f:
						event.subtype = 'endOfTrack';
						if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
						return event;
					case 0x51:
						event.subtype = 'setTempo';
						if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
						event.microsecondsPerBeat = (
							(stream.readInt8() << 16)
							+ (stream.readInt8() << 8)
							+ stream.readInt8()
						)
						return event;
					case 0x54:
						event.subtype = 'smpteOffset';
						if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
						var hourByte = stream.readInt8();
						event.frameRate = {
							0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
						}[hourByte & 0x60];
						event.hour = hourByte & 0x1f;
						event.min = stream.readInt8();
						event.sec = stream.readInt8();
						event.frame = stream.readInt8();
						event.subframe = stream.readInt8();
						return event;
					case 0x58:
						event.subtype = 'timeSignature';
						if (length != 4) throw "Expected length for timeSignature event is 4, got " + length;
						event.numerator = stream.readInt8();
						event.denominator = Math.pow(2, stream.readInt8());
						event.metronome = stream.readInt8();
						event.thirtyseconds = stream.readInt8();
						return event;
					case 0x59:
						event.subtype = 'keySignature';
						if (length != 2) throw "Expected length for keySignature event is 2, got " + length;
						event.key = stream.readInt8(true);
						event.scale = stream.readInt8();
						return event;
					case 0x7f:
						event.subtype = 'sequencerSpecific';
						event.data = stream.read(length);
						return event;
					default:
						// console.log("Unrecognised meta event subtype: " + subtypeByte);
						event.subtype = 'unknown'
						event.data = stream.read(length);
						return event;
				}
				event.data = stream.read(length);
				return event;
			} else if (eventTypeByte == 0xf0) {
				event.type = 'sysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length);
				return event;
			} else if (eventTypeByte == 0xf7) {
				event.type = 'dividedSysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length);
				return event;
			} else {
				throw "Unrecognised MIDI event type byte: " + eventTypeByte;
			}
		} else {
			/* channel event */
			var param1;
			if ((eventTypeByte & 0x80) == 0) {
				/* running status - reuse lastEventTypeByte as the event type.
					eventTypeByte is actually the first parameter
				*/
				param1 = eventTypeByte;
				eventTypeByte = lastEventTypeByte;
			} else {
				param1 = stream.readInt8();
				lastEventTypeByte = eventTypeByte;
			}

			var eventType = eventTypeByte >> 4;
			event.channel = eventTypeByte & 0x0f;
			event.type = 'channel';
			event.status = eventTypeByte;

			switch (eventType) {
				case 0x08:
					event.subtype = 'noteOff';
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					return event;
				case 0x09:
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					if (event.velocity == 0) {
						event.subtype = 'noteOff';
					} else {
						event.subtype = 'noteOn';
					}
					return event;
				case 0x0a:
					event.subtype = 'noteAftertouch';
					event.noteNumber = param1;
					event.amount = stream.readInt8();
					return event;
				case 0x0b:
					event.subtype = 'controller';
					event.controllerType = param1;
					event.value = stream.readInt8();
					return event;
				case 0x0c:
					event.subtype = 'programChange';
					event.programNumber = param1;
					return event;
				case 0x0d:
					event.subtype = 'channelAftertouch';
					event.amount = param1;
					return event;
				case 0x0e:
					event.subtype = 'pitchBend';
					event.value = param1 + (stream.readInt8() << 7);
					return event;
				default:
					throw 'Unrecognised MIDI event type: ' + eventType
					/* 
					console.log('Unrecognised MIDI event type: ' + eventType);
					stream.readInt8();
					event.subtype = 'unknown';
					return event;
					*/
			}
		}
	}
	
	stream = Stream(data);
	var headerChunk = readChunk(stream);
	if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
		throw "Bad .mid file - header not found";
	}
	var headerStream = Stream(headerChunk.data);
	var formatType = headerStream.readInt16();
	var trackCount = headerStream.readInt16();
	var timeDivision = headerStream.readInt16();
	
	if (timeDivision & 0x8000) {
		throw "Expressing time division in SMTPE frames is not supported yet"
	} else {
		ticksPerBeat = timeDivision;
	}
	
	var header = {
		'formatType': formatType,
		'trackCount': trackCount,
		'ticksPerBeat': ticksPerBeat
	}
	var tracks = [];
	for (var i = 0; i < header.trackCount; i++) {
		tracks[i] = [];
		var trackChunk = readChunk(stream);
		if (trackChunk.id != 'MTrk') {
			throw "Unexpected chunk - expected MTrk, got "+ trackChunk.id;
		}
		var trackStream = Stream(trackChunk.data);
		while (!trackStream.eof()) {
			var event = readEvent(trackStream);
			tracks[i].push(event);
			//console.log(event);
		}
	}
	
	return {
		'header': header,
		'tracks': tracks
	}
}



function Replayer(midiFile, timeWarp, eventProcessor, bpm) {
	function clone(o) {
		if (typeof o === 'object') {
			if (o == null) {
				return (o);
			} else {
				var res = typeof o.length === 'number' ? [] : {};
				for (var key in o) {
					res[key] = clone(o[key]);
				}
				return res;
			}
		} else {
			return o;
		}
	};

	var trackStates = [];
	var beatsPerMinute = bpm ? bpm : 120;
	var bpmOverride = bpm === +bpm;
	///
	var ticksPerBeat = midiFile.header.ticksPerBeat;	
	for (var i = 0; i < midiFile.tracks.length; i++) {
		trackStates[i] = {
			'nextEventIndex': 0,
			'ticksToNextEvent': (
				midiFile.tracks[i].length ?
					midiFile.tracks[i][0].deltaTime :
					null
			)
		};
	}

	var nextEventInfo;
	var samplesToNextEvent = 0;
	
	function getNextEvent() {
		var ticksToNextEvent = null;
		var nextEventTrack = null;
		var nextEventIndex = null;
		
		for (var i = 0; i < trackStates.length; i++) {
			if (
				trackStates[i].ticksToNextEvent != null
				&& (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)
			) {
				ticksToNextEvent = trackStates[i].ticksToNextEvent;
				nextEventTrack = i;
				nextEventIndex = trackStates[i].nextEventIndex;
			}
		}
		if (nextEventTrack != null) {
			/* consume event from that track */
			var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
			if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
				trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
			} else {
				trackStates[nextEventTrack].ticksToNextEvent = null;
			}
			trackStates[nextEventTrack].nextEventIndex += 1;
			/* advance timings on all tracks by ticksToNextEvent */
			for (var i = 0; i < trackStates.length; i++) {
				if (trackStates[i].ticksToNextEvent != null) {
					trackStates[i].ticksToNextEvent -= ticksToNextEvent
				}
			}
			return {
				'ticksToEvent': ticksToNextEvent,
				'event': nextEvent,
				'track': nextEventTrack
			}
		} else {
			return null;
		}
	};
	///
	var packet;
	var temporal = [];
	var calcDuration = {}; // used to calculate duration of noteOn
	///
	function processEvents() {
		function processNext() {
			var event = packet.event;
			var subtype = event.subtype;
			///
			var beatsToGenerate = 0;
			var secondsToGenerate = 0;
			if (packet.ticksToEvent > 0) {
				beatsToGenerate = packet.ticksToEvent / ticksPerBeat;
				secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
			}
			///
			var currentTime = secondsToGenerate * 1000 * timeWarp || 0;
			///
			switch(subtype) {
				case 'setTempo':
					if (!bpmOverride) { // tempo change events can occur anywhere in the middle and affect events that follow
						beatsPerMinute = 60000000 / event.microsecondsPerBeat;
					}
					break;
				case 'noteOn':
					var eid = event.channel + 'x' + event.noteNumber;
 					calcDuration[eid] = {
 						event: event,
 						currentTime: currentTime
 					};
					break;
				case 'noteOff':
					var eid = event.channel + 'x' + event.noteNumber;
					var map = calcDuration[eid];
					if (map) {
						map.event.duration = currentTime - map.currentTime;
						delete calcDuration[eid];
					}
					break;
			}
			///
			temporal.push([packet, currentTime]);
			///
			packet = getNextEvent();
		};
		///
		if (packet = getNextEvent()) {
			while(packet) {
				processNext(true);
			}
		}
	};
	///
	processEvents();
	///
	return {
		getData: function() {
			return clone(temporal);
		}
	};
};



/*
	----------------------------------------------------------
	MIDI.audioDetect : 2015-05-16
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
	Probably, Maybe, No... Absolutely!
	Test to see what types of <audio> MIME types are playable by the browser.
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};

(function(root) { 'use strict';

	var supports = {}; // object of supported file types
	var pending = 0; // pending file types to process
	///
	function canPlayThrough(src) { // check whether format plays through
		pending ++;
		///
		var body = document.body;
		var audio = new Audio();
		var mime = src.split(';')[0];
		audio.id = 'audio';
		audio.setAttribute('preload', 'auto');
		audio.setAttribute('audiobuffer', true);
		audio.addEventListener('error', function() {
			body.removeChild(audio);
			supports[mime] = false;
			pending --;
		}, false);
		audio.addEventListener('canplaythrough', function() {
			body.removeChild(audio);
			supports[mime] = true;
			pending --;
		}, false);
		audio.src = 'data:' + src;
		body.appendChild(audio);
	};

	root.audioDetect = function(onsuccess) {

		/// detect midi plugin
		if (navigator.requestMIDIAccess) {
			var toString = Function.prototype.toString;
			var isNative = toString.call(navigator.requestMIDIAccess).indexOf('[native code]') !== -1;
			if (isNative) { // has native midi support
				supports['webmidi'] = true;
			} else { // check for jazz plugin support
				for (var n = 0; navigator.plugins.length > n; n ++) {
					var plugin = navigator.plugins[n];
					if (plugin.name.indexOf('Jazz-Plugin') >= 0) {
						supports['webmidi'] = true;
					}
				}
			}
		}

		/// check whether <audio> tag is supported
		if (typeof Audio === 'undefined') {
			onsuccess(supports);
			return;
		} else {
			supports['audiotag'] = true;

			/// check for webaudio api support
			if (window.AudioContext || window.webkitAudioContext) {
				supports['webaudio'] = true;
			}

			/// check whether canPlayType is supported
			var audio = new Audio();
			if (audio.canPlayType) {

				/// see what we can learn from the browser
				var vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
				vorbis = (vorbis === 'probably' || vorbis === 'maybe');
				var mpeg = audio.canPlayType('audio/mpeg');
				mpeg = (mpeg === 'probably' || mpeg === 'maybe');

				// maybe nothing is supported
				if (!vorbis && !mpeg) {
					onsuccess(supports);
					return;
				}

				/// or maybe something is supported
				if (vorbis) canPlayThrough('audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=');
				if (mpeg) canPlayThrough('audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

				/// lets find out!
				var startTime = Date.now();
				var interval = setInterval(function() {
					var maxExecution = Date.now() - startTime > 5000;
					if (!pending || maxExecution) {
						clearInterval(interval);
						onsuccess(supports);
					}
				}, 1);
			} else {
				onsuccess(supports);
				return;
			}
		}
	};

})(MIDI);



/*
	----------------------------------------------------------
	GeneralMIDI : 2012-01-06
	----------------------------------------------------------
*/

(function(MIDI) { 'use strict';

	function asId(name) {
		return name.replace(/[^a-z0-9_ ]/gi, '').
				    replace(/[ ]/g, '_').
				    toLowerCase();
	};
	
	var GM = (function(arr) {
		var res = {};
		var byCategory = res.byCategory = {};
		var byId = res.byId = {};
		var byName = res.byName = {};
		///
		for (var key in arr) {
			var list = arr[key];
			for (var n = 0, length = list.length; n < length; n++) {
				var instrument = list[n];
				if (instrument) {
					var id = parseInt(instrument.substr(0, instrument.indexOf(' ')), 10);
					var name = instrument.replace(id + ' ', '');
					var nameId = asId(name);
					var categoryId = asId(key);
					///
					var spec = {
						id: nameId,
						name: name,
						program: --id,
						category: key
					};
					///
					byId[id] = spec;
					byName[nameId] = spec;
					byCategory[categoryId] = byCategory[categoryId] || [];
					byCategory[categoryId].push(spec);
				}
			}
		}
		return res;
	})({
		'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
		'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
		'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
		'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
		'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
		'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
		'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
		'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
		'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
		'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
		'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
		'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
		'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
		'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
		'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
		'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
	});
	
	GM.getProgramSpec = function(program) {
		var spec;
		if (typeof program === 'string') {
			spec = GM.byName[asId(program)];
		} else {
			spec = GM.byId[program];
		}
		if (spec) {
			return spec;
		} else {
			MIDI.handleError('invalid program', arguments);
		}
	};


	/* getProgram | programChange
	--------------------------------------------------- */
	MIDI.getProgram = function(channelId) {
		return getParam('program', channelId);
	};

	MIDI.programChange = function(channelId, program, delay) {
		var spec = GM.getProgramSpec(program);
		if (spec && isFinite(program = spec.program)) {
			setParam('program', channelId, program, delay);
		}
	};


	/* getMono | setMono
	--------------------------------------------------- */
	MIDI.getMono = function(channelId) {
		return getParam('mono', channelId);
	};

	MIDI.setMono = function(channelId, truthy, delay) {
		if (isFinite(truthy)) {
			setParam('mono', channelId, truthy, delay);
		}
	};


	/* getOmni | setOmni
	--------------------------------------------------- */
	MIDI.getOmni = function(channelId) {
		return getParam('omni', channelId);
	};

	MIDI.setOmni = function(channelId, truthy, delay) {
		if (isFinite(truthy)) {
			setParam('omni', channelId, truthy, delay);
		}
	};


	/* getSolo | setSolo
	--------------------------------------------------- */
	MIDI.getSolo = function(channelId) {
		return getParam('solo', channelId);
	};

	MIDI.setSolo = function(channelId, truthy, delay) {
		if (isFinite(truthy)) {
			setParam('solo', channelId, truthy, delay);
		}
	};
	
	function getParam(param, channelId) {
		var channel = channels[channelId];
		if (channel) {
			return channel[param];
		}
	};

	function setParam(param, channelId, value, delay) {
		var channel = channels[channelId];
		if (channel) {
			if (delay) {
				setTimeout(function() { //- is there a better option?
					channel[param] = value;
				}, delay);
			} else {
				channel[param] = value;
			}
			///
			var wrapper = MIDI.messageHandler[param] || messageHandler[param];
			if (wrapper) {
				wrapper(channelId, value, delay);
			}
		}
	};


	/* channels
	--------------------------------------------------- */
	var channels = (function() {
		var res = {};
		for (var number = 0; number <= 15; number++) {
			res[number] = {
				number: number,
				program: number,
				pitchBend: 0,
				mute: false,
				mono: false,
				omni: false,
				solo: false
			};
		}
		return res;
	})();


	/* note conversions
	--------------------------------------------------- */
	MIDI.keyToNote = {}; // C8  == 108
	MIDI.noteToKey = {}; // 108 ==  C8

	(function() {
		var A0 = 0x15; // first note
		var C8 = 0x6C; // last note
		var number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		for (var n = A0; n <= C8; n++) {
			var octave = (n - 12) / 12 >> 0;
			var name = number2key[n % 12] + octave;
			MIDI.keyToNote[name] = n;
			MIDI.noteToKey[n] = name;
		}
	})();
	

	/* expose
	--------------------------------------------------- */
	MIDI.channels = channels;
	MIDI.GM = GM;
	

	/* handle message
	--------------------------------------------------- */
	MIDI.messageHandler = {}; // overrides
	
	var messageHandler = { // defaults
		program: function(channelId, program, delay) {
			if (MIDI.__api) {
				if (MIDI.player.isPlaying) {
					MIDI.player.pause();
					MIDI.loadProgram(program, MIDI.player.play);
				} else {
					MIDI.loadProgram(program);
				}
			}
		}
	};


	/* handle errors
	--------------------------------------------------- */
	MIDI.handleError = function(type, args) {
		if (console && console.error) {
			console.error(type, args);
		}
	};

})(MIDI);


/*
	----------------------------------------------------------
	MIDI.Plugin : 2015-06-04
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
	Inspired by javax.sound.midi (albeit a super simple version): 
		http://docs.oracle.com/javase/6/docs/api/javax/sound/midi/package-summary.html
	----------------------------------------------------------
	Technologies
	----------------------------------------------------------
		Web MIDI API - no native support yet (jazzplugin)
		Web Audio API - firefox 25+, chrome 10+, safari 6+, opera 15+
		HTML5 Audio Tag - ie 9+, firefox 3.5+, chrome 4+, safari 4+, opera 9.5+, ios 4+, android 2.3+
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};

MIDI.Soundfont = MIDI.Soundfont || {};
MIDI.player = MIDI.player || {};

(function(MIDI) { 'use strict';

	if (typeof console !== 'undefined' && console.log) {
		console.log('%c♥ MIDI.js 0.4.2 ♥', 'color: red;');
	}

	MIDI.DEBUG = true;
	MIDI.USE_XHR = true;
	MIDI.soundfontUrl = './soundfont/';

	/*
		MIDI.loadPlugin({
			audioFormat: 'mp3', // optionally can force to use MP3 (for instance on mobile networks)
			onsuccess: function() { },
			onprogress: function(state, percent) { },
			instrument: 'acoustic_grand_piano', // or 1 (default)
			instruments: [ 'acoustic_grand_piano', 'acoustic_guitar_nylon' ] // or multiple instruments
		});
	*/

	MIDI.loadPlugin = function(opts, onsuccess, onerror, onprogress) {
		if (typeof opts === 'function') opts = {onsuccess: opts};
		opts = opts || {};
		opts.api = opts.api || MIDI.__api;
		
		function onDetect(supports) {
			var hash = location.hash;
			var api = '';

			/// use the most appropriate plugin if not specified
			if (supports[opts.api]) {
				api = opts.api;
			} else if (supports[hash.substr(1)]) {
				api = hash.substr(1);
			} else if (supports.webmidi) {
				api = 'webmidi';
			} else if (window.AudioContext) { // Chrome
				api = 'webaudio';
			} else if (window.Audio) { // Firefox
				api = 'audiotag';
			}

			if (connect[api]) {
				/// use audio/ogg when supported
				if (opts.audioFormat) {
					var audioFormat = opts.audioFormat;
				} else { // use best quality
					var audioFormat = supports['audio/ogg'] ? 'ogg' : 'mp3';
				}

				/// load the specified plugin
				MIDI.__api = api;
				MIDI.__audioFormat = audioFormat;
				MIDI.supports = supports;
				MIDI.loadProgram(opts);
			}
		};

		///		
		if (opts.soundfontUrl) {
			MIDI.soundfontUrl = opts.soundfontUrl;
		}

		/// Detect the best type of audio to use
		if (MIDI.supports) {
			onDetect(MIDI.supports);
		} else {
			MIDI.audioDetect(onDetect);
		}
	};

	/*
		MIDI.loadProgram('banjo', onsuccess, onerror, onprogress);
		MIDI.loadProgram({
			instrument: 'banjo',
			onsuccess: function(){},
			onerror: function(){},
			onprogress: function(state, percent){}
		})
	*/

	MIDI.loadProgram = (function() {

		function asList(opts) {
			var res = opts.instruments || opts.instrument || MIDI.channels[0].program;
			if (typeof res !== 'object') {
				if (res === undefined) {
					res = [];
				} else {
					res = [res];
				}
			}
			/// program number -> id
			for (var i = 0; i < res.length; i ++) {
				var instrument = res[i];
				if (instrument === +instrument) { // is numeric
					if (MIDI.GM.byId[instrument]) {
						res[i] = MIDI.GM.byId[instrument].id;
					}
				}
			}
			return res;
		};

		return function(opts, onsuccess, onerror, onprogress) {
			opts = opts || {};
			if (typeof opts !== 'object') opts = {instrument: opts};
			if (onerror) opts.onerror = onerror;
			if (onprogress) opts.onprogress = onprogress;
			if (onsuccess) opts.onsuccess = onsuccess;
			///
			opts.format = MIDI.__audioFormat;
			opts.instruments = asList(opts);
			///
			connect[MIDI.__api](opts);
		};
	})();
	
	var connect = {
		webmidi: function(opts) {
			// cant wait for this to be standardized!
			MIDI.WebMIDI.connect(opts);
		},
		audiotag: function(opts) {
			// works ok, kinda like a drunken tuna fish, across the board
			// http://caniuse.com/audio
			requestQueue(opts, 'AudioTag');
		},
		webaudio: function(opts) {
			// works awesome! safari, chrome and firefox support
			// http://caniuse.com/web-audio
			requestQueue(opts, 'WebAudio');
		}
	};

	function requestQueue(opts, context) {
		var audioFormat = opts.format;
		var instruments = opts.instruments;
		var onprogress = opts.onprogress;
		var onerror = opts.onerror;
		///
		var length = instruments.length;
		var pending = length;
		///
		function onEnd() {
			onprogress && onprogress('load', 1.0);
			MIDI[context].connect(opts);
		};
		///
		if (length) {
			for (var i = 0; i < length; i ++) {
				var programId = instruments[i];
				if (MIDI.Soundfont[programId]) { // already loaded
					!--pending && onEnd();
				} else { // needs to be requested
					sendRequest(instruments[i], audioFormat, function(evt, progress) {
						var fileProgress = progress / length;
						var queueProgress = (length - pending) / length;
						onprogress && onprogress('load', fileProgress + queueProgress, programId);
					}, function() {
						!--pending && onEnd();
					}, onerror);
				}
			}
		} else {
			onEnd();
		}
	};

	function sendRequest(programId, audioFormat, onprogress, onsuccess, onerror) {
		var soundfontPath = MIDI.soundfontUrl + programId + '-' + audioFormat + '.js';
		if (MIDI.USE_XHR) {
			galactic.util.request({
				url: soundfontPath,
				format: 'text',
				onerror: onerror,
				onprogress: onprogress,
				onsuccess: function(event, responseText) {
					var script = document.createElement('script');
					script.language = 'javascript';
					script.type = 'text/javascript';
					script.text = responseText;
					document.body.appendChild(script);
					onsuccess();
				}
			});
		} else {
			dom.loadScript.add({
				url: soundfontPath,
				verify: 'MIDI.Soundfont["' + programId + '"]',
				onerror: onerror,
				onsuccess: function() {
					onsuccess();
				}
			});
		}
	};

	MIDI.setDefaultPlugin = function(midi) {
		for (var key in midi) {
			MIDI[key] = midi[key];
		}
	};

})(MIDI);



/*
	----------------------------------------------------------------------
	AudioTag <audio> - OGG or MPEG Soundbank
	----------------------------------------------------------------------
	http://dev.w3.org/html5/spec/Overview.html#the-audio-element
	----------------------------------------------------------------------
*/

(function(MIDI) { 'use strict';

	window.Audio && (function() {
		var midi = MIDI.AudioTag = { api: 'audiotag' };
		var noteToKey = {};
		var volume = 127; // floating point 
		var buffer_nid = -1; // current channel
		var audioBuffers = []; // the audio channels
		var notesOn = []; // instrumentId + noteId that is currently playing in each 'channel', for routing noteOff/chordOff calls
		var notes = {}; // the piano keys
		for (var nid = 0; nid < 12; nid ++) {
			audioBuffers[nid] = new Audio();
		}

		function playChannel(channel, note) {
			if (!MIDI.channels[channel]) return;
			var instrument = MIDI.channels[channel].program;
			var instrumentId = MIDI.GM.byId[instrument].id;
			var note = notes[note];
			if (note) {
				var instrumentNoteId = instrumentId + '' + note.id;
				var nid = (buffer_nid + 1) % audioBuffers.length;
				var audio = audioBuffers[nid];
				notesOn[ nid ] = instrumentNoteId;
				if (!MIDI.Soundfont[instrumentId]) {
					MIDI.DEBUG && console.log('404', instrumentId);
					return;
				}
				audio.src = MIDI.Soundfont[instrumentId][note.id];
				audio.volume = volume / 127;
				audio.play();
				buffer_nid = nid;
			}
		};

		function stopChannel(channel, note) {
			if (!MIDI.channels[channel]) return;
			var instrument = MIDI.channels[channel].program;
			var instrumentId = MIDI.GM.byId[instrument].id;
			var note = notes[note];
			if (note) {
				var instrumentNoteId = instrumentId + '' + note.id;
				for (var i = 0, len = audioBuffers.length; i < len; i++) {
				    var nid = (i + buffer_nid + 1) % len;
				    var cId = notesOn[nid];
				    if (cId && cId == instrumentNoteId) {
				        audioBuffers[nid].pause();
				        notesOn[nid] = null;
				        return;
				    }
				}
			}
		};
		///
		midi.audioBuffers = audioBuffers;
		midi.messageHandler = {};
		///
		midi.send = function(data, delay) { };
		midi.setController = function(channel, type, value, delay) { };
		midi.setVolume = function(channel, n) {
			volume = n; //- should be channel specific volume
		};

		midi.pitchBend = function(channel, program, delay) { };

		midi.noteOn = function(channel, note, velocity, delay) {
			var id = noteToKey[note];
			if (notes[id]) {
				if (delay) {
					return setTimeout(function() {
						playChannel(channel, id);
					}, delay * 1000);
				} else {
					playChannel(channel, id);
				}
			}
		};
	
		midi.noteOff = function(channel, note, delay) {
// 			var id = noteToKey[note];
// 			if (notes[id]) {
// 				if (delay) {
// 					return setTimeout(function() {
// 						stopChannel(channel, id);
// 					}, delay * 1000)
// 				} else {
// 					stopChannel(channel, id);
// 				}
// 			}
		};
	
		midi.chordOn = function(channel, chord, velocity, delay) {
			for (var idx = 0; idx < chord.length; idx ++) {
				var n = chord[idx];
				var id = noteToKey[n];
				if (notes[id]) {
					if (delay) {
						return setTimeout(function() {
							playChannel(channel, id);
						}, delay * 1000);
					} else {
						playChannel(channel, id);
					}
				}
			}
		};
	
		midi.chordOff = function(channel, chord, delay) {
			for (var idx = 0; idx < chord.length; idx ++) {
				var n = chord[idx];
				var id = noteToKey[n];
				if (notes[id]) {
					if (delay) {
						return setTimeout(function() {
							stopChannel(channel, id);
						}, delay * 1000);
					} else {
						stopChannel(channel, id);
					}
				}
			}
		};
	
		midi.stopAllNotes = function() {
			for (var nid = 0, length = audioBuffers.length; nid < length; nid++) {
				audioBuffers[nid].pause();
			}
		};
	
		midi.connect = function(opts) {
			MIDI.setDefaultPlugin(midi);
			///
			for (var key in MIDI.keyToNote) {
				noteToKey[MIDI.keyToNote[key]] = key;
				notes[key] = {id: key};
			}
			///
			opts.onsuccess && opts.onsuccess();
		};
	})();

})(MIDI);



/*
	----------------------------------------------------------
	Web Audio API - OGG | MPEG Soundbank
	----------------------------------------------------------
	http://webaudio.github.io/web-audio-api/
	----------------------------------------------------------
*/

(function(MIDI) { 'use strict';

	window.AudioContext && (function() {

		var audioContext = null; // new AudioContext();
		var useStreamingBuffer = false; // !!audioContext.createMediaElementSource;
		var midi = MIDI.WebAudio = {api: 'webaudio'};
		var ctx; // audio context
		var sources = {};
		var effects = {};
		var masterVolume = 127;
		var audioBuffers = {};
		///
		midi.audioBuffers = audioBuffers;
		midi.messageHandler = {};
		///
		midi.send = function(data, delay) {
		
		};

		midi.setController = function(channelId, type, value, delay) {
		
		};

		midi.setVolume = function(channelId, volume, delay) {
			if (delay) {
				setTimeout(function() {
					masterVolume = volume;
				}, delay * 1000);
			} else {
				masterVolume = volume;
			}
		};

		midi.pitchBend = function(channelId, bend, delay) {
			var channel = MIDI.channels[channelId];
			if (channel) {
				if (delay) {
					setTimeout(function() {
						channel.pitchBend = bend;
					}, delay);
				} else {
					channel.pitchBend = bend;
				}
			}
		};

		midi.noteOn = function(channelId, noteId, velocity, delay) {
			delay = delay || 0;

			/// check whether the note exists
			var channel = MIDI.channels[channelId];
			var instrument = channel.program;
			var bufferId = instrument + 'x' + noteId;
			var buffer = audioBuffers[bufferId];
			if (buffer) {
				/// convert relative delay to absolute delay
				if (delay < ctx.currentTime) {
					delay += ctx.currentTime;
				}
		
				/// create audio buffer
				if (useStreamingBuffer) {
					var source = ctx.createMediaElementSource(buffer);
				} else { // XMLHTTP buffer
					var source = ctx.createBufferSource();
					source.buffer = buffer;
				}

				/// add effects to buffer
				if (effects) {
					var chain = source;
					for (var key in effects) {
						chain.connect(effects[key].input);
						chain = effects[key];
					}
				}

				/// add gain + pitchShift
				var gain = (velocity / 127) * (masterVolume / 127) * 2 - 1;
				source.connect(ctx.destination);
				source.playbackRate.value = 1; // pitch shift 
				source.gainNode = ctx.createGain(); // gain
				source.gainNode.connect(ctx.destination);
				source.gainNode.gain.value = Math.min(1.0, Math.max(-1.0, gain));
				source.connect(source.gainNode);
				///
				if (useStreamingBuffer) {
					if (delay) {
						return setTimeout(function() {
							buffer.currentTime = 0;
							buffer.play()
						}, delay * 1000);
					} else {
						buffer.currentTime = 0;
						buffer.play()
					}
				} else {
					source.start(delay || 0);
				}
				///
				sources[channelId + 'x' + noteId] = source;
				///
				return source;
			} else {
				MIDI.handleError('no buffer', arguments);
			}
		};

		midi.noteOff = function(channelId, noteId, delay) {
			delay = delay || 0;

			/// check whether the note exists
			var channel = MIDI.channels[channelId];
			var instrument = channel.program;
			var bufferId = instrument + 'x' + noteId;
			var buffer = audioBuffers[bufferId];
			if (buffer) {
				if (delay < ctx.currentTime) {
					delay += ctx.currentTime;
				}
				///
				var source = sources[channelId + 'x' + noteId];
				if (source) {
					if (source.gainNode) {
						// @Miranet: 'the values of 0.2 and 0.3 could of course be used as 
						// a 'release' parameter for ADSR like time settings.'
						// add { 'metadata': { release: 0.3 } } to soundfont files
						var gain = source.gainNode.gain;
						gain.linearRampToValueAtTime(gain.value, delay);
						gain.linearRampToValueAtTime(-1.0, delay + 0.3);
					}
					///
					if (useStreamingBuffer) {
						if (delay) {
							setTimeout(function() {
								buffer.pause();
							}, delay * 1000);
						} else {
							buffer.pause();
						}
					} else {
						if (source.noteOff) {
							source.noteOff(delay + 0.5);
						} else {
							source.stop(delay + 0.5);
						}
					}
					///
					delete sources[channelId + 'x' + noteId];
					///
					return source;
				}
			}
		};

		midi.chordOn = function(channel, chord, velocity, delay) {
			var res = {};
			for (var n = 0, note, len = chord.length; n < len; n++) {
				res[note = chord[n]] = midi.noteOn(channel, note, velocity, delay);
			}
			return res;
		};

		midi.chordOff = function(channel, chord, delay) {
			var res = {};
			for (var n = 0, note, len = chord.length; n < len; n++) {
				res[note = chord[n]] = midi.noteOff(channel, note, delay);
			}
			return res;
		};

		midi.stopAllNotes = function() {
			for (var sid in sources) {
				var delay = 0;
				if (delay < ctx.currentTime) {
					delay += ctx.currentTime;
				}
				var source = sources[sid];
				source.gain.linearRampToValueAtTime(1, delay);
				source.gain.linearRampToValueAtTime(0, delay + 0.3);
				if (source.noteOff) { // old api
					source.noteOff(delay + 0.3);
				} else { // new api
					source.stop(delay + 0.3);
				}
				delete sources[sid];
			}
		};

		midi.setEffects = function(list) {
			if (ctx.tunajs) {
				for (var n = 0; n < list.length; n ++) {
					var data = list[n];
					var effect = new ctx.tunajs[data.type](data);
					effect.connect(ctx.destination);
					effects[data.type] = effect;
				}
			} else {
				MIDI.handleError('effects not installed.', arguments);
				return;
			}
		};

		midi.connect = function(opts) {
			MIDI.setDefaultPlugin(midi);
			midi.setContext(ctx || createAudioContext(), opts.onsuccess);
		};
	
		midi.getContext = function() {
			return ctx;
		};
	
		midi.setContext = function(newCtx, onsuccess, onprogress, onerror) {
			ctx = newCtx;

			/// tuna.js effects module - https://github.com/Dinahmoe/tuna
			if (typeof Tuna !== 'undefined') {
				if (!(ctx.tunajs instanceof Tuna)) {
					ctx.tunajs = new Tuna(ctx);
				}
			}
		
			/// loading audio files
			var urls = [];
			var notes = MIDI.keyToNote;
			for (var key in notes) {
				urls.push(key);
			}
			///
			function waitForEnd(instrument) {
				for (var key in bufferPending) { // has pending items
					if (bufferPending[key]) {
						return;
					}
				}
				if (onsuccess) { // run onsuccess once
					onsuccess();
					onsuccess = null;
				}
			};

			function requestAudio(soundfont, programId, index, key) {
				var url = soundfont[key];
				if (url) {
					bufferPending[programId] ++;
					loadAudio(url, function(buffer) {
						buffer.id = key;
						var noteId = MIDI.keyToNote[key];
						audioBuffers[programId + 'x' + noteId] = buffer;
						///
						if (--bufferPending[programId] === 0) {
							var percent = index / 87;
							soundfont.isLoaded = true;
							MIDI.DEBUG && console.log('loaded: ', instrument);
							waitForEnd(instrument);
						}
					}, function() {
						MIDI.handleError('audio could not load', arguments);
					});
				}
			};
			///
			var bufferPending = {};
			var soundfonts = MIDI.Soundfont;
			for (var instrument in soundfonts) {
				var soundfont = soundfonts[instrument];
				if (soundfont.isLoaded) {
					continue;
				} else {
					var spec = MIDI.GM.byName[instrument];
					if (spec) {
						var programId = spec.program;
						///
						bufferPending[programId] = 0;
						///
						for (var index = 0; index < urls.length; index++) {
							var key = urls[index];
							requestAudio(soundfont, programId, index, key);
						}
					}
				}
			}
			///
			setTimeout(waitForEnd, 1);
		};


		/* Load audio file: streaming | base64 | arraybuffer
		---------------------------------------------------------------------- */
		function loadAudio(url, onsuccess, onerror) {
			if (useStreamingBuffer) {
				var audio = new Audio();
				audio.src = url;
				audio.controls = false;
				audio.autoplay = false;
				audio.preload = false;
				audio.addEventListener('canplay', function() {
					onsuccess && onsuccess(audio);
				});
				audio.addEventListener('error', function(err) {
					onerror && onerror(err);
				});
				document.body.appendChild(audio);
			} else if (url.indexOf('data:audio') === 0) { // Base64 string
				var base64 = url.split(',')[1];
				var buffer = Base64Binary.decodeArrayBuffer(base64);
				ctx.decodeAudioData(buffer, onsuccess, onerror);
			} else { // XMLHTTP buffer
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';
				request.onload = function() {
					ctx.decodeAudioData(request.response, onsuccess, onerror);
				};
				request.send();
			}
		};
		
		function createAudioContext() {
			return new (window.AudioContext || window.webkitAudioContext)();
		};
	})();
})(MIDI);



/*
	----------------------------------------------------------------------
	Web MIDI API - Native Soundbanks
	----------------------------------------------------------------------
	http://webaudio.github.io/web-midi-api/
	----------------------------------------------------------------------
*/

(function(MIDI) { 'use strict';

	var output = null;
	var channels = [];
	var midi = MIDI.WebMIDI = {api: 'webmidi'};

	midi.messageHandler = {};
	midi.messageHandler.program = function(channelId, program, delay) { // change patch (instrument)
		output.send([0xC0 + channelId, program], delay * 1000);
	};

	midi.send = function(data, delay) {
		output.send(data, delay * 1000);
	};

	midi.setController = function(channelId, type, value, delay) {
		output.send([channelId, type, value], delay * 1000);
	};

	midi.setVolume = function(channelId, volume, delay) { // set channel volume
		output.send([0xB0 + channelId, 0x07, volume], delay * 1000);
	};

	midi.pitchBend = function(channelId, program, delay) { // pitch bend
		output.send([0xE0 + channelId, program], delay * 1000);
	};

	midi.noteOn = function(channelId, note, velocity, delay) {
		output.send([0x90 + channelId, note, velocity], delay * 1000);
	};

	midi.noteOff = function(channelId, note, delay) {
		output.send([0x80 + channelId, note, 0], delay * 1000);
	};

	midi.chordOn = function(channelId, chord, velocity, delay) {
		for (var n = 0; n < chord.length; n ++) {
			var note = chord[n];
			output.send([0x90 + channelId, note, velocity], delay * 1000);
		}
	};

	midi.chordOff = function(channelId, chord, delay) {
		for (var n = 0; n < chord.length; n ++) {
			var note = chord[n];
			output.send([0x80 + channelId, note, 0], delay * 1000);
		}
	};

	midi.stopAllNotes = function() {
		output.cancel();
		for (var channelId = 0; channelId < 16; channelId ++) {
			output.send([0xB0 + channelId, 0x7B, 0]);
		}
	};

	midi.connect = function(opts) {
		var onsuccess = opts.onsuccess;
		var onerror = opts.onerror;
		///
		MIDI.setDefaultPlugin(midi);
		///
		function errFunction(err) { // well at least we tried!
			onerror && onerror(err);
			///
			if (window.AudioContext) { // Chrome
				opts.api = 'webaudio';
			} else if (window.Audio) { // Firefox
				opts.api = 'audiotag';
			} else { // no support
				return;
			}
			///
			MIDI.loadPlugin(opts);
		};
		///
		navigator.requestMIDIAccess().then(function(access) {
			var pluginOutputs = access.outputs;
			if (typeof pluginOutputs == 'function') { // Chrome pre-43
				output = pluginOutputs()[0];
			} else { // Chrome post-43
				output = pluginOutputs[0];
			}
			if (output === undefined) { // no outputs
				errFunction();
			} else {
				onsuccess && onsuccess();
			}
		}, onerror);
	};

})(MIDI);



/*
	----------------------------------------------------------
	MIDI.player : 2015-05-16
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};
if (typeof MIDI.player === 'undefined') MIDI.player = {};

(function() { 'use strict';

var player = MIDI.player;
player.currentTime = 0; // current time within current song
player.duration = 0; // duration of current song
player.isPlaying = false;
///
player.BPM = null; // beats-per-minute override
player.timeDelay = 0; // in seconds
player.timeWarp = 1.0; // warp beats-per-minute
player.transpose = 0; // transpose notes up or down


/* Playback
---------------------------------------------------------- */
player.play =
player.start = function(onsuccess) {
	player.currentTime = clamp(0, player.duration, player.currentTime);
    startAudio(player.currentTime, null, onsuccess);
};

player.stop = function() {
	stopAudio();
	player.currentTime = 0;
};

player.pause = function() {
	stopAudio();
};

player.toggle = function() {
	if (player.isPlaying) {
		player.pause();
	} else {
		player.play();
	}
};


/* Listeners
---------------------------------------------------------- */
player.on =
player.addListener = function(onsuccess) {
	onPacketListener = onsuccess;
};

player.off =
player.removeListener = function() {
	onPacketListener = undefined;
};

player.clearAnimation = function() {
	player.frameId && cancelAnimationFrame(player.frameId);
};

player.setAnimation = function(callback) {
	var currentTime = 0;
	var nowSys = 0;
	var nowMidi = 0;
	//
	player.clearAnimation();
	///
	requestAnimationFrame(function frame() {
		player.frameId = requestAnimationFrame(frame);
		///
		if (player.duration) {
			if (player.isPlaying) {
				currentTime = (nowMidi === player.currentTime) ? nowSys - Date.now() : 0;
				///
				if (player.currentTime === 0) {
					currentTime = 0;
				} else {
					currentTime = player.currentTime - currentTime;
				}
				if (nowMidi !== player.currentTime) {
					nowSys = Date.now();
					nowMidi = player.currentTime;
				}
			} else {
				currentTime = player.currentTime;
			}
			///
			var duration = player.duration;
			var percent = currentTime / duration;
			var total = currentTime / 1000;
			var minutes = total / 60;
			var seconds = total - (minutes * 60);
			var t1 = minutes * 60 + seconds;
			var t2 = (duration / 1000);
			if (t2 - t1 < -1.0) {
				return;
			} else {
				var progress = Math.min(1.0, t1 / t2);
				if (progress !== callback.progress) {
					callback.progress = progress;
					callback({
						progress: progress,
						currentTime: t1,
						duration: t2
					});
				}
			}
		}
	});
};


/* Load File - accepts base64 or url to MIDI File
---------------------------------------------------------- */
player.loadFile = (function() {

	function getInstrumentList() {
		var GM = MIDI.GM;
		var instruments = {};
		var programChange = {};
		var packets = player.packets;
		for (var n = 0; n < packets.length; n ++) {
			var event = packets[n][0].event;
			if (event.type === 'channel') {
				var channel = event.channel;
				switch(event.subtype) {
					case 'programChange':
						programChange[channel] = event.programNumber;
						break;
					case 'noteOn':
						var program = programChange[channel];
						if (program === +program) {
							if (handleEvent.programChange) {
								var gm = GM.byId[program];
							} else {
								var channel = MIDI.channels[channel];
								var gm = GM.byId[channel.program];
							}
							instruments[gm.id] = true;
						}
						break;
				}
			}
		}
		///
		var res = [];
		for (var key in instruments) {
			res.push(key);
		}
		return res;
	};

	function loadFile(onsuccess, onprogress, onerror) {
		try {
			player.replayer = new Replayer(MidiFile(player.currentData), 1.0 / player.timeWarp, null, player.BPM);
			player.packets = player.replayer.getData();
			player.duration = getLength();
			///
			MIDI.loadPlugin({
				instruments: getInstrumentList(),
				onsuccess: onsuccess,
				onprogress: onprogress,
				onerror: onerror
			});
		} catch(err) {
			onerror && onerror(err);
		}
	};
	
	function toBase64(data) {
		var res = [];
		var fromCharCode = String.fromCharCode;
		for (var i = 0, length = data.length; i < length; i++) {
			res[i] = fromCharCode(data.charCodeAt(i) & 255);
		}
		return res.join('');
	};

	return function(opts, onsuccess, onprogress, onerror) {
		if (typeof opts === 'string') opts = {src: opts};
		var src = opts.src;
		var onsuccess = onsuccess || opts.onsuccess;
		var onerror = onerror || opts.onerror;
		var onprogress = onprogress || opts.onprogress;
		///
		player.stop();
		///
		if (src.indexOf('base64,') !== -1) {
			player.currentData = atob(src.split(',')[1]);
			loadFile(onsuccess, onprogress, onerror);
		} else {
			var fetch = new XMLHttpRequest();
			fetch.open('GET', src);
			fetch.overrideMimeType('text/plain; charset=x-user-defined');
			fetch.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200 && this.responseText) {
						player.currentData = toBase64(this.responseText);
						loadFile(onsuccess, onprogress, onerror);
					} else {
						onerror && onerror('Unable to load MIDI file.');
					}
				}
			};
			fetch.send();
		}
	};
})();


/* Scheduling
---------------------------------------------------------- */
var packetQueue = []; // hold events to be triggered
var packetOn = {};
///
var onPacketListener = undefined; // listener
var startTime = 0; // to measure time elapse
///
player.packets = {}; // get event for requested note

function scheduleTracking(event, note, currentTime, offset) {
	return setTimeout(function() {
		onPacketListener && onPacketListener(event);
		///
		player.currentTime = currentTime;
		///
		packetQueue.shift();
		///
		var sid = event.channel + 'x' + event.noteNumber;
		var subtype = event.subtype;
		if (subtype === 'noteOn') {
			packetOn[sid] = event;
		} else if (subtype === 'noteOff') {
			delete packetOn[sid];
		}
		///
		if (OFFSET < player.duration) {
			if (packetQueue.length < 1000) { // fill queue
				startAudio(OFFSET, true);
			} else if (player.currentTime === OFFSET) { // grab next sequence
				startAudio(OFFSET, true);
			}
		}
	}, currentTime - offset);
};


/* Start Audio
---------------------------------------------------------- */
var IDX;
var OFFSET;
function startAudio(currentTime, isPlaying, onsuccess) {
	if (!isPlaying) {
		player.isPlaying && stopAudio();
		player.isPlaying = true;
		player.packets = player.replayer.getData();
		player.duration = getLength();
	}
	///
	var messages = 0;
	var packets = player.packets;
	var length = packets.length;
	///
	var interval = packetQueue[0] && packetQueue[0].interval || 0;
	var foffset = currentTime - player.currentTime;
	///
	var now;
	var ctx = getContext();
	if (MIDI.api !== 'webaudio') {
		now = getNow();
		NOW = NOW || now;
		ctx.currentTime = (now - NOW) / 1000;
	}
	///
	startTime = ctx.currentTime;
	///
	if (isPlaying) {
		var packetIdx = IDX;
		var offset = OFFSET;
	} else {
		var obj = seekPacket(currentTime);
		var packetIdx = obj.idx;
		var offset = OFFSET = obj.offset;
	}

	while(packetIdx < length && messages <= 100) {
		var packet = packets[packetIdx];
		///
		IDX = ++ packetIdx;
		OFFSET += packet[1];
		currentTime = OFFSET - offset;
		///
		var event = packet[0].event;
		if (event.type === 'channel') {
			var subtype = event.subtype;
			if (!handleEvent[subtype]) {
				continue;
			}
			///
			var channelId = event.channel;
			var channel = MIDI.channels[channelId];
			var delay = ctx.currentTime + ((currentTime + foffset) / 1000);
			var delayMIDI = Math.max(0, delay + player.timeDelay);
			var queueTime = OFFSET - offset;
			///
			switch(subtype) {
				case 'controller':
					MIDI.setController(channelId, event.controllerType, event.value, delayMIDI);
					break;
				case 'programChange':
					MIDI.programChange(channelId, event.programNumber, delayMIDI);
					break;
				case 'pitchBend':
					MIDI.pitchBend(channelId, event.value, delayMIDI);
					break;
				case 'noteOn':
					if (!channel.mute) {
						var note = clamp(0, 127, event.noteNumber + player.transpose);
						packetQueue.push({
							event: event,
							time: queueTime,
							source: MIDI.noteOn(channelId, note, event.velocity, delayMIDI),
							interval: scheduleTracking(event, note, OFFSET, offset - foffset)
						});
						messages++;
					}
					break;
				case 'noteOff':
					if (!channel.mute) {
						var note = clamp(0, 127, event.noteNumber + player.transpose);
						packetQueue.push({
							event: event,
							time: queueTime,
							source: MIDI.noteOff(channelId, note, delayMIDI),
							interval: scheduleTracking(event, note, OFFSET, offset - foffset)
						});
						messages++;
					}
					break;
				default:
					break;
			}
		}
	}
	onsuccess && onsuccess(packetQueue);
};

function seekPacket(seekTime) {
	var packets = player.packets;
	var length = packets.length;
	for (var idx = 0, offset = 0; idx < length; idx++) {
		var packet = packets[idx];
		var packetTime = packet[1];
		if (offset + packetTime < seekTime) {
			offset += packetTime;
		} else {
			break;
		}
	}
	return {
		idx: idx,
		offset: offset
	};
};


/* Stop Audio
---------------------------------------------------------- */
function stopAudio() {
	if (player.isPlaying) {
		player.isPlaying = false;
		///
		var ctx = getContext();
		player.currentTime += (ctx.currentTime - startTime) * 1000;

		/// stop the audio, and intervals
		while(packetQueue.length) {
			var packet = packetQueue.pop();
			if (packet) {
				if (packet.source) {
					if (typeof packet.source === 'number') { // HTML5 Audio
						clearTimeout(packet.source);
					} else { // WebAudioAPI
						packet.source.disconnect(0);
					}
				}
				///
				clearTimeout(packet.interval);
			}
		}
		
		for (var sid in packetOn) {
			var event = packetOn[sid];
			//onPacketListener({
			//	channel: event.channel,
			//	noteNumber: event.noteNumber,
			//	status: event.status - 16,
			//	subtype: 'noteOff',
			//	type: 'channel'
			//});
		}
	}
};


/* Helpers
---------------------------------------------------------- */
function clamp(min, max, value) {
	return (value < min) ? min : ((value > max) ? max : value);
};

function getContext() {
	if (MIDI.api === 'webaudio') {
		return MIDI.WebAudio.getContext();
	} else {
		player.ctx = {currentTime: 0};
	}
	return player.ctx;
};

function getLength() {
	var packets =  player.packets;
	var length = packets.length;
	var totalTime = 0.0;
	for (var n = 0; n < length; n++) {
		totalTime += packets[n][1];
	}
	return totalTime;
};

var NOW;
function getNow() {
    if (window.performance && performance.now) {
        return performance.now();
    } else {
		return Date.now();
	}
};


/* Toggle event handling
---------------------------------------------------------- */
var handleEvent = {
    controller: true,
    noteOff: true,
    noteOn: true,
    pitchBend: true,
    programChange: true
};

player.handleEvent = function(type, truthy) {
	handleEvent[type] = truthy;
};

})();



/*
	----------------------------------------------------------
	MIDI.Synesthesia : 2015-05-30
	----------------------------------------------------------
	Peacock		“Instruments to perform color-music: Two centuries of technological experimentation,” Leonardo, 21 (1988), 397-406.
	Gerstner	Karl Gerstner, The Forms of Color 1986.
	Klein		Colour-Music: The art of light, London: Crosby Lockwood and Son, 1927.
	Jameson		“Visual music in a visual programming language,” IEEE Symposium on Visual Languages, 1999, 111-118.
	Helmholtz	Treatise on Physiological Optics, New York: Dover Books, 1962.
	Jones		The art of light & color, New York: Van Nostrand Reinhold, 1972.
	----------------------------------------------------------
	Reference	http://rhythmiclight.com/archives/ideas/colorscales.html
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') var MIDI = {};

MIDI.Synesthesia = MIDI.Synesthesia || {};

(function(root) {
	var defs = {
		'Isaac Newton (1704)': { 
			format: 'HSL',
			ref: 'Gerstner, p.167',
			english: ['red', null, 'orange', null, 'yellow', 'green', null, 'blue', null, 'indigo', null, 'violet'],
			0: [ 0, 96, 51 ], // C
			1: [ 0, 0, 0 ], // C#
			2: [ 29, 94, 52 ], // D
			3: [ 0, 0, 0 ], // D#
			4: [ 60, 90, 60 ], // E
			5: [ 135, 76, 32 ], // F
			6: [ 0, 0, 0 ], // F#
			7: [ 248, 82, 28 ], // G
			8: [ 0, 0, 0 ], // G#
			9: [ 302, 88, 26 ], // A
			10: [ 0, 0, 0 ], // A#
			11: [ 325, 84, 46 ] // B
		},
		'Louis Bertrand Castel (1734)': { 
			format: 'HSL',
			ref: 'Peacock, p.400',
			english: ['blue', 'blue-green', 'green', 'olive green', 'yellow', 'yellow-orange', 'orange', 'red', 'crimson', 'violet', 'agate', 'indigo'],			
			0: [ 248, 82, 28 ],
			1: [ 172, 68, 34 ],
			2: [ 135, 76, 32 ],
			3: [ 79, 59, 36 ],
			4: [ 60, 90, 60 ],
			5: [ 49, 90, 60 ],
			6: [ 29, 94, 52 ],
			7: [ 360, 96, 51 ],
			8: [ 1, 89, 33 ],
			9: [ 325, 84, 46 ],
			10: [ 273, 80, 27 ],
			11: [ 302, 88, 26 ]
		},
		'George Field (1816)': { 
			format: 'HSL',
			ref: 'Klein, p.69',
			english: ['blue', null, 'purple', null, 'red', 'orange', null, 'yellow', null, 'yellow green', null, 'green'],
			0: [ 248, 82, 28 ],
			1: [ 0, 0, 0 ],
			2: [ 302, 88, 26 ],
			3: [ 0, 0, 0 ],
			4: [ 360, 96, 51 ],
			5: [ 29, 94, 52 ],
			6: [ 0, 0, 0 ],
			7: [ 60, 90, 60 ],
			8: [ 0, 0, 0 ],
			9: [ 79, 59, 36 ],
			10: [ 0, 0, 0 ],
			11: [ 135, 76, 32 ]
		},
		'D. D. Jameson (1844)': { 
			format: 'HSL',
			ref: 'Jameson, p.12',
			english: ['red', 'red-orange', 'orange', 'orange-yellow', 'yellow', 'green', 'green-blue', 'blue', 'blue-purple', 'purple', 'purple-violet', 'violet'],
			0: [ 360, 96, 51 ],
			1: [ 14, 91, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 49, 90, 60 ],
			4: [ 60, 90, 60 ],
			5: [ 135, 76, 32 ],
			6: [ 172, 68, 34 ],
			7: [ 248, 82, 28 ],
			8: [ 273, 80, 27 ],
			9: [ 302, 88, 26 ],
			10: [ 313, 78, 37 ],
			11: [ 325, 84, 46 ]
		},
		'Theodor Seemann (1881)': { 
			format: 'HSL',
			ref: 'Klein, p.86',
			english: ['carmine', 'scarlet', 'orange', 'yellow-orange', 'yellow', 'green', 'green blue', 'blue', 'indigo', 'violet', 'brown', 'black'],
			0: [ 0, 58, 26 ],
			1: [ 360, 96, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 49, 90, 60 ],
			4: [ 60, 90, 60 ],
			5: [ 135, 76, 32 ],
			6: [ 172, 68, 34 ],
			7: [ 248, 82, 28 ],
			8: [ 302, 88, 26 ],
			9: [ 325, 84, 46 ],
			10: [ 0, 58, 26 ],
			11: [ 0, 0, 3 ]
		},
		'A. Wallace Rimington (1893)': { 
			format: 'HSL',
			ref: 'Peacock, p.402',
			english: ['deep red', 'crimson', 'orange-crimson', 'orange', 'yellow', 'yellow-green', 'green', 'blueish green', 'blue-green', 'indigo', 'deep blue', 'violet'],
			0: [ 360, 96, 51 ],
			1: [ 1, 89, 33 ],
			2: [ 14, 91, 51 ],
			3: [ 29, 94, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 79, 59, 36 ],
			6: [ 135, 76, 32 ],
			7: [ 163, 62, 40 ],
			8: [ 172, 68, 34 ],
			9: [ 302, 88, 26 ],
			10: [ 248, 82, 28 ],
			11: [ 325, 84, 46 ]
		},
		'Bainbridge Bishop (1893)': { 
			format: 'HSL',
			ref: 'Bishop, p.11',
			english: ['red', 'orange-red or scarlet', 'orange', 'gold or yellow-orange', 'yellow or green-gold', 'yellow-green', 'green', 'greenish-blue or aquamarine', 'blue', 'indigo or violet-blue', 'violet', 'violet-red', 'red'],			
			0: [ 360, 96, 51 ],
			1: [ 1, 89, 33 ],
			2: [ 29, 94, 52 ],
			3: [ 50, 93, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 163, 62, 40 ],
			8: [ 302, 88, 26 ],
			9: [ 325, 84, 46 ],
			10: [ 343, 79, 47 ],
			11: [ 360, 96, 51 ]
		},
		'H. von Helmholtz (1910)': { 
			format: 'HSL',
			ref: 'Helmholtz, p.22',
			english: ['yellow', 'green', 'greenish blue', 'cayan-blue', 'indigo blue', 'violet', 'end of red', 'red', 'red', 'red', 'red orange', 'orange'],
			0: [ 60, 90, 60 ],
			1: [ 135, 76, 32 ],
			2: [ 172, 68, 34 ],
			3: [ 211, 70, 37 ],
			4: [ 302, 88, 26 ],
			5: [ 325, 84, 46 ],
			6: [ 330, 84, 34 ],
			7: [ 360, 96, 51 ],
			8: [ 10, 91, 43 ],
			9: [ 10, 91, 43 ],
			10: [ 8, 93, 51 ],
			11: [ 28, 89, 50 ]
		},
		'Alexander Scriabin (1911)': { 
			format: 'HSL',
			ref: 'Jones, p.104',
			english: ['red', 'violet', 'yellow', 'steely with the glint of metal', 'pearly blue the shimmer of moonshine', 'dark red', 'bright blue', 'rosy orange', 'purple', 'green', 'steely with a glint of metal', 'pearly blue the shimmer of moonshine'],
			0: [ 360, 96, 51 ],
			1: [ 325, 84, 46 ],
			2: [ 60, 90, 60 ],
			3: [ 245, 21, 43 ],
			4: [ 211, 70, 37 ],
			5: [ 1, 89, 33 ],
			6: [ 248, 82, 28 ],
			7: [ 29, 94, 52 ],
			8: [ 302, 88, 26 ],
			9: [ 135, 76, 32 ],
			10: [ 245, 21, 43 ],
			11: [ 211, 70, 37 ]
		},
		'Adrian Bernard Klein (1930)': { 
			format: 'HSL',
			ref: 'Klein, p.209',
			english: ['dark red', 'red', 'red orange', 'orange', 'yellow', 'yellow green', 'green', 'blue-green', 'blue', 'blue violet', 'violet', 'dark violet'],
			0: [ 0, 91, 40 ],
			1: [ 360, 96, 51 ],
			2: [ 14, 91, 51 ],
			3: [ 29, 94, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 248, 82, 28 ],
			9: [ 292, 70, 31 ],
			10: [ 325, 84, 46 ],
			11: [ 330, 84, 34 ]
		},
		'August Aeppli (1940)': { 
			format: 'HSL',
			ref: 'Gerstner, p.169',
			english: ['red', null, 'orange', null, 'yellow', null, 'green', 'blue-green', null, 'ultramarine blue', 'violet', 'purple'],
			0: [ 0, 96, 51 ],
			1: [ 0, 0, 0 ],
			2: [ 29, 94, 52 ],
			3: [ 0, 0, 0 ],
			4: [ 60, 90, 60 ],
			5: [ 0, 0, 0 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 0, 0, 0 ],
			9: [ 211, 70, 37 ],
			10: [ 273, 80, 27 ],
			11: [ 302, 88, 26 ]
		},
		'I. J. Belmont (1944)': { 
			ref: 'Belmont, p.226',
			english: ['red', 'red-orange', 'orange', 'yellow-orange', 'yellow', 'yellow-green', 'green', 'blue-green', 'blue', 'blue-violet', 'violet', 'red-violet'],
			0: [ 360, 96, 51 ],
			1: [ 14, 91, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 50, 93, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 248, 82, 28 ],
			9: [ 313, 78, 37 ],
			10: [ 325, 84, 46 ],
			11: [ 338, 85, 37 ]
		},
		'Steve Zieverink (2004)': { 
			format: 'HSL',
			ref: 'Cincinnati Contemporary Art Center',
			english: ['yellow-green', 'green', 'blue-green', 'blue', 'indigo', 'violet', 'ultra violet', 'infra red', 'red', 'orange', 'yellow-white', 'yellow'],
			0: [ 73, 73, 55 ],
			1: [ 135, 76, 32 ],
			2: [ 172, 68, 34 ],
			3: [ 248, 82, 28 ],
			4: [ 302, 88, 26 ],
			5: [ 325, 84, 46 ],
			6: [ 326, 79, 24 ],
			7: [ 1, 89, 33 ],
			8: [ 360, 96, 51 ],
			9: [ 29, 94, 52 ],
			10: [ 62, 78, 74 ],
			11: [ 60, 90, 60 ]
		},
		'Circle of Fifths (Johnston 2003)': {
			format: 'RGB',
			ref: 'Joseph Johnston',
			english: ['yellow', 'blue', 'orange', 'teal', 'red', 'green', 'purple', 'light orange', 'light blue', 'dark orange', 'dark green', 'violet'],
			0: [ 255, 255, 0 ],
			1: [ 50, 0, 255 ],
			2: [ 255, 150, 0 ],
			3: [ 0, 210, 180 ],
			4: [ 255, 0, 0 ],
			5: [ 130, 255, 0 ],
			6: [ 150, 0, 200 ],
			7: [ 255, 195, 0 ],
			8: [ 30, 130, 255 ],
			9: [ 255, 100, 0 ],
			10: [ 0, 200, 0 ],
			11: [ 225, 0, 225 ]
		},
		'Circle of Fifths (Wheatman 2002)': {
			format: 'HEX',
			ref: 'Stuart Wheatman', // http://www.valleysfamilychurch.org/
			english: [],
			data: ['#122400', '#2E002E', '#002914', '#470000', '#002142', '#2E2E00', '#290052', '#003D00', '#520029', '#003D3D', '#522900', '#000080', '#244700', '#570057', '#004D26', '#7A0000', '#003B75', '#4C4D00', '#47008F', '#006100', '#850042', '#005C5C', '#804000', '#0000C7', '#366B00', '#80007F', '#00753B', '#B80000', '#0057AD', '#6B6B00', '#6600CC', '#008A00', '#B8005C', '#007F80', '#B35900', '#2424FF', '#478F00', '#AD00AD', '#00994D', '#F00000', '#0073E6', '#8F8F00', '#8A14FF', '#00AD00', '#EB0075', '#00A3A3', '#E07000', '#6B6BFF', '#5CB800', '#DB00DB', '#00C261', '#FF5757', '#3399FF', '#ADAD00', '#B56BFF', '#00D600', '#FF57AB', '#00C7C7', '#FF9124', '#9999FF', '#6EDB00', '#FF29FF', '#00E070', '#FF9999', '#7ABDFF', '#D1D100', '#D1A3FF', '#00FA00', '#FFA3D1', '#00E5E6', '#FFC285', '#C2C2FF', '#80FF00', '#FFA8FF', '#00E070', '#FFCCCC', '#C2E0FF', '#F0F000', '#EBD6FF', '#ADFFAD', '#FFD6EB', '#8AFFFF', '#FFEBD6', '#EBEBFF', '#E0FFC2', '#FFEBFF', '#E5FFF2', '#FFF5F5']
		},
		'Daniel Christopher (2013)': {
			format: 'HEX',
			english: [],
			0: '33669A',
			1: '009999',
			2: '079948',
			3: '6FBE44',
			4: 'F6EC13',
			5: 'FFCD05',
			6: 'F89838',
			7: 'EF3B39',
			8: 'CC3366',
			9: 'CB9AC6',
			10: '89509F',
			11: '5e2c95'
		}
	};

	root.map = function(type) {
		var res = {};
		var blend = function(a, b) {
			return [ // blend two colors and round results
				(a[0] * 0.5 + b[0] * 0.5 + 0.5) >> 0, 
				(a[1] * 0.5 + b[1] * 0.5 + 0.5) >> 0,
				(a[2] * 0.5 + b[2] * 0.5 + 0.5) >> 0
			];
		};
		///
		var colors = defs[type] || defs['D. D. Jameson (1844)'];
		for (var note = 0, pcolor; note <= 88; note ++) { // creates mapping for 88 notes
			if (colors.data) {
				res[note] = {
					hsl: colors.data[note],
					hex: colors.data[note] 
				};
			} else {
				var color = colors[(note + 9) % 12];
				///
				var H, S, L;
				switch(colors.format) {
					case 'HEX':
						color = Color.Space(color, 'W3>HEX>RGB');
					case 'RGB':
						color = Color.Space(color, 'RGB>HSL');
						H = color.H >> 0;
						S = color.S >> 0;
						L = color.L >> 0;
						break;
					case 'HSL':
						H = color[0];
						S = color[1];
						L = color[2];
						break;
				}
				///
				if (H === S && S === L) { // note color is unset
					color = blend(pcolor, colors[(note + 10) % 12]);
				}
				///
// 				var amount = L / 10;
// 				var octave = note / 12 >> 0;
// 				var octaveLum = L + amount * octave - 3.0 * amount; // map luminance to octave
				///
				res[note] = {
					hsl: 'hsla(' + H + ',' + S + '%,' + L + '%, 1)',
					hex: Color.Space({H: H, S: S, L: L}, 'HSL>RGB>HEX>W3')
				};
				///
				pcolor = color;
			}
		}
		return res;
	};

})(MIDI.Synesthesia);



/*
	----------------------------------------------------------
	util.request : 0.1.1 : 2015-04-12 : https://mudcu.be
	----------------------------------------------------------
	XMLHttpRequest - IE7+ | Chrome 1+ | Firefox 1+ | Safari 1.2+
	CORS - IE10+ | Chrome 3+ | Firefox 3.5+ | Safari 4+
	----------------------------------------------------------
	util.request({
		url: './dir/something.extension',
		data: 'test!',
		format: 'text', // text | xml | json
		responseType: 'text', // arraybuffer | blob | document | json | text
		headers: {},
		withCredentials: true, // true | false
		///
		onerror: function(evt, percent) {
			console.log(evt);
		},
		onsuccess: function(evt, responseText) {
			console.log(responseText);
		},
		onprogress: function(evt, percent) {
			percent = Math.round(percent * 100);
			loader.create('thread', 'loading... ', percent);
		}
	});
	
	
	https://mathiasbynens.be/demo/xhr-responsetype //- shim for responseType='json'
	
*/

if (typeof galactic === 'undefined') galactic = {};

(function(root) {

	var util = root.util || (root.util = {});

	util.request = function(opts, onsuccess, onerror, onprogress) { 'use strict';
		if (typeof opts === 'string') opts = {url: opts};
		///
		var data = opts.data;
		var url = opts.url;
		var method = opts.method || (opts.data ? 'POST' : 'GET');
		var format = opts.format;
		var headers = opts.headers;
		var responseType = opts.responseType;
		var withCredentials = opts.withCredentials || false;
		///
		var onprogress = onprogress || opts.onprogress;
		var onsuccess = onsuccess || opts.onsuccess;
		var onerror = onerror || opts.onerror;
		///
		if (typeof NodeFS !== 'undefined' && root.loc.isLocalUrl(url)) {
			NodeFS.readFile(url, 'utf8', function(err, res) {
				if (err) {
					onerror && onerror(err);
				} else {
					onsuccess && onsuccess({responseText: res});
				}
			});
			return;
		}
		///
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		///
		if (headers) {
			for (var type in headers) {
				xhr.setRequestHeader(type, headers[type]);
			}
		} else if (data) { // set the default headers for POST
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		if (responseType) {
			xhr.responseType = responseType;
		}
		if (withCredentials) {
			xhr.withCredentials = true;
		}
		if (onerror && 'onerror' in xhr) {
			xhr.onerror = onerror;
		}
		if (onprogress && xhr.upload && 'onprogress' in xhr.upload) {
			if (data) {
				xhr.upload.onprogress = function(evt) {
					onprogress.call(xhr, evt, event.loaded / event.total);
				};
			} else {
				xhr.addEventListener('progress', function(evt) {
					var totalBytes = 0;
					if (evt.lengthComputable) {
						totalBytes = evt.total;
					} else if (xhr.totalBytes) {
						totalBytes = xhr.totalBytes;
					} else {
						var rawBytes = parseInt(xhr.getResponseHeader('Content-Length-Raw'));
						if (isFinite(rawBytes)) {
							xhr.totalBytes = totalBytes = rawBytes;
						} else {
							return;
						}
					}
					onprogress.call(xhr, evt, evt.loaded / totalBytes);
				});
			}
		}

		xhr.onreadystatechange = function(evt) {
			if (xhr.readyState === 4) { // The request is complete
				if (xhr.status === 200 || // Response OK
					xhr.status === 304 || // Not Modified
					xhr.status === 308 || // Permanent Redirect
					xhr.status === 0 && root.client.cordova // Cordova quirk
				) {
					if (onsuccess) {
						var res;
						if (format === 'json') {
							try {
								res = JSON.parse(evt.target.response);
							} catch(err) {
								onerror && onerror.call(xhr, evt);
							}
						} else if (format === 'xml') {
							res = evt.target.responseXML;
						} else if (format === 'text') {
							res = evt.target.responseText;
						} else {
							res = evt.target.response;
						}
						///
						onsuccess.call(xhr, evt, res);
					}
				} else {
					onerror && onerror.call(xhr, evt);
				}
			}
		};
		xhr.send(data);
		return xhr;
	};

	/// NodeJS
	if (typeof module !== 'undefined' && module.exports) {
		var NodeFS = require('fs');
		XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
		module.exports = root.util.request;
	}

})(galactic);



/*
	-----------------------------------------------------------
	dom.loadScript.js : 0.1.4 : 2014/02/12 : http://mudcu.be
	-----------------------------------------------------------
	Copyright 2011-2014 Mudcube. All rights reserved.
	-----------------------------------------------------------
	/// No verification
	dom.loadScript.add("../js/jszip/jszip.js");
	/// Strict loading order and verification.
	dom.loadScript.add({
		strictOrder: true,
		urls: [
			{
				url: "../js/jszip/jszip.js",
				verify: "JSZip",
				onsuccess: function() {
					console.log(1)
				}
			},
			{ 
				url: "../inc/downloadify/js/swfobject.js",
				verify: "swfobject",
				onsuccess: function() {
					console.log(2)
				}
			}
		],
		onsuccess: function() {
			console.log(3)
		}
	});
	/// Just verification.
	dom.loadScript.add({
		url: "../js/jszip/jszip.js",
		verify: "JSZip",
		onsuccess: function() {
			console.log(1)
		}
	});
*/

if (typeof(dom) === "undefined") var dom = {};

(function() { "use strict";

dom.loadScript = function() {
	this.loaded = {};
	this.loading = {};
	return this;
};

dom.loadScript.prototype.add = function(config) {
	var that = this;
	if (typeof(config) === "string") {
		config = { url: config };
	}
	var urls = config.urls;
	if (typeof(urls) === "undefined") {
		urls = [{ 
			url: config.url, 
			verify: config.verify
		}];
	}
	/// adding the elements to the head
	var doc = document.getElementsByTagName("head")[0];
	/// 
	var testElement = function(element, test) {
		if (that.loaded[element.url]) return;
		if (test && globalExists(test) === false) return;
		that.loaded[element.url] = true;
		//
		if (that.loading[element.url]) that.loading[element.url]();
		delete that.loading[element.url];
		//
		if (element.onsuccess) element.onsuccess();
		if (typeof(getNext) !== "undefined") getNext();
	};
	///
	var hasError = false;
	var batchTest = [];
	var addElement = function(element) {
		if (typeof(element) === "string") {
			element = {
				url: element,
				verify: config.verify
			};
		}
		if (/([\w\d.\[\]\'\"])$/.test(element.verify)) { // check whether its a variable reference
			var verify = element.test = element.verify;
			if (typeof(verify) === "object") {
				for (var n = 0; n < verify.length; n ++) {
					batchTest.push(verify[n]);
				}			
			} else {
				batchTest.push(verify);
			}
		}
		if (that.loaded[element.url]) return;
		var script = document.createElement("script");
		script.onreadystatechange = function() {
			if (this.readyState !== "loaded" && this.readyState !== "complete") return;
			testElement(element);
		};
		script.onload = function() {
			testElement(element);
		};
		script.onerror = function() {
			hasError = true;
			delete that.loading[element.url];
			if (typeof(element.test) === "object") {
				for (var key in element.test) {
					removeTest(element.test[key]);
				}			
			} else {
				removeTest(element.test);
			}
		};
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", element.url);
		doc.appendChild(script);
		that.loading[element.url] = function() {};
	};
	/// checking to see whether everything loaded properly
	var removeTest = function(test) {
		var ret = [];
		for (var n = 0; n < batchTest.length; n ++) {
			if (batchTest[n] === test) continue;
			ret.push(batchTest[n]);
		}
		batchTest = ret;
	};
	var onLoad = function(element) {
		if (element) {
			testElement(element, element.test);
		} else {
			for (var n = 0; n < urls.length; n ++) {
				testElement(urls[n], urls[n].test);
			}
		}
		var istrue = true;
		for (var n = 0; n < batchTest.length; n ++) {
			if (globalExists(batchTest[n]) === false) {
				istrue = false;
			}
		}
		if (!config.strictOrder && istrue) { // finished loading all the requested scripts
			if (hasError) {
				if (config.error) {
					config.error();
				}
			} else if (config.onsuccess) {
				config.onsuccess();
			}
		} else { // keep calling back the function
			setTimeout(function() { //- should get slower over time?
				onLoad(element);
			}, 10);
		}
	};
	/// loading methods;  strict ordering or loose ordering
	if (config.strictOrder) {
		var ID = -1;
		var getNext = function() {
			ID ++;
			if (!urls[ID]) { // all elements are loaded
				if (hasError) {
					if (config.error) {
						config.error();
					}
				} else if (config.onsuccess) {
					config.onsuccess();
				}
			} else { // loading new script
				var element = urls[ID];
				var url = element.url;
				if (that.loading[url]) { // already loading from another call (attach to event)
					that.loading[url] = function() {
						if (element.onsuccess) element.onsuccess();
						getNext();
					}
				} else if (!that.loaded[url]) { // create script element
					addElement(element);
					onLoad(element);
				} else { // it's already been successfully loaded
					getNext();
				}
			}
		};
		getNext();
	} else { // loose ordering
		for (var ID = 0; ID < urls.length; ID ++) {
			addElement(urls[ID]);
			onLoad(urls[ID]);
		}
	}
};

dom.loadScript = new dom.loadScript();

function globalExists(path, root) {
	try {
		path = path.split('"').join('').split("'").join('').split(']').join('').split('[').join('.');
		var parts = path.split(".");
		var length = parts.length;
		var object = root || window;
		for (var n = 0; n < length; n ++) {
			var key = parts[n];
			if (object[key] == null) {
				return false;
			} else { //
				object = object[key];
			}
		}
		return true;
	} catch(e) {
		return false;
	}
};

})();

/// For NodeJS
if (typeof (module) !== "undefined" && module.exports) {
	module.exports = dom.loadScript;
}


/*
	----------------------------------------------------------
	ui/Timer : 0.1.1 : 2015-03-23 : https://sketch.io
	----------------------------------------------------------
*/

if (typeof sketch === 'undefined') sketch = {};

(function(root) { 'use strict';

root.ui = root.ui || {};
root.ui.Timer = function(opts) {
	opts = opts || {};
	///
	var that = this;
	///
	var size;
	var format;
	var container;
	var endValue;
	var value;
	///
	var RAD_DEG = 180.0 / Math.PI; // Radians to Degrees
	var DEG_RAD = 1.0 / RAD_DEG; // Degrees to Radians
	///
	var setParams = function(opts) {
		size = opts.size || 120;
		format = opts.format || 'percent';
		container = opts.container || document.body;
		endValue = opts.endValue;
		value = opts.value || 0;
	};
	///
	var getPosition = function() {
		if (format === 'percent') {
			return {
				value: value,
				format: 'PERCENT',
				percent: value / 100
			}
		} else if (format === 'time') {
			var elapse = (Date.now() - startTime) / 1000;
			var otime = endValue - elapse;
			var percent = elapse / endValue;
			///
			var time = Math.max(0, Math.round(otime));
			var hours = (time / 3600) >> 0;
			var minutes = ((time - (hours * 3600)) / 60) >> 0;
			var seconds = time - (hours * 3600) - (minutes * 60);
			if (seconds < 10 && minutes) seconds = '0' + seconds;
			///
			if (minutes) {
				return {
					value: minutes,
					format: 'MINUTES',
					percent: percent
				};
			} else {
				return {
					value: seconds,
					format: 'SECONDS',
					percent: percent
				};
			}
		}
	};

	var gradient = ['#9cdb7d', '#99d97f', '#97d782', '#95d684', '#93d487', '#91d38a', '#8fd18c', '#8dcf8f', '#8bce91', '#89cc94', '#87cb97', '#85c999', '#83c89c', '#81c69e', '#7fc4a1', '#7dc3a4', '#7bc1a6', '#79c0a9', '#77beab', '#75bcae', '#73bbb1', '#71b9b3', '#6fb8b6', '#6db6b8', '#6bb5bb', '#69b3be', '#67b1c0', '#65b0c3', '#63aec5', '#61adc8', '#5fabcb', '#5daacd', '#5ba8d0', '#59a6d2', '#57a5d5', '#55a3d8', '#53a2da', '#51a0dd', '#4f9edf', '#4d9de2', '#4b9be5', '#499ae7', '#4798ea', '#4597ec', '#4395ef', '#4193f2', '#3f92f4', '#3d90f7', '#3b8ff9', '#398dfc', '#378cff'];
	///
	var requestId;
	var pulse = 0;
	var startTime = Date.now(); // 'time' format
	var render = function() {
		var obj = getPosition();
		///
		ctx.fillStyle = gradient[Math.round((1.0 - obj.percent) * 50)];
		///
// 		pulse ++;
		///
		var startAngle = -360 * DEG_RAD;
		var endAngle = obj.percent * 360 * DEG_RAD;
		var outerRadius = size / 2.0 + (pulse % 20);
		var innerRadius = size / 2.0 * 0.61 + (pulse % 20);
		///
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.save();
		///
		ctx.beginPath()
		ctx.arc(outerRadius, outerRadius, outerRadius, startAngle, endAngle, false);
		ctx.arc(outerRadius, outerRadius, innerRadius, endAngle, startAngle, true);
		ctx.globalAlpha = 0.25;
		ctx.fill();
		///
		startAngle += 360 * DEG_RAD;
		///
		ctx.beginPath()
		ctx.arc(outerRadius, outerRadius, outerRadius, startAngle, endAngle, false);
		ctx.arc(outerRadius, outerRadius, innerRadius, endAngle, startAngle, true);
		ctx.globalAlpha = 1.0;
		ctx.fill();
		///
		var ratio = size / 260;
		var fontSize = ratio * 26;
		var fontFamily = '"Trebuchet MS", Arial, Helvetica, sans-serif';
		ctx.font = 'bold ' + fontSize + 'px ' + fontFamily;
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.fillText(obj.format, outerRadius, outerRadius + ratio * 14);
		///
		var fontSize = ratio * 46;
		ctx.font = 'bold ' + fontSize + 'px ' + fontFamily;
		ctx.fillStyle = '#ffffff';
		ctx.fillText(obj.value, outerRadius, outerRadius - ratio * 44);
		ctx.restore();
		///
		if (obj.percent < 1.0) {
			requestId = requestAnimationFrame(render);
		}
	};
	///
	setParams(opts);
	///
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = size;
	canvas.height = size;
	///
	var parent = document.createElement('div');
	parent.style.display = 'none';
	parent.className = 'sk-timer';
	parent.appendChild(canvas);
	///
	container.appendChild(parent);
	///
	if (opts.onstart) {
		setTimeout(opts.onstart, 250);
	}

	/* Public 
	---------------------------------------------------------- */
	that.reset = function() {
		setParams(opts);
	};

	that.destroy = function() {
		container.removeChild(canvas);
	};

	that.hidden = false;

	that.hide = function(callback) {
		cancelAnimationFrame(requestId);
		///
		that.hidden = true;
		parent.style.transition = 'opacity .35s';
		parent.style.opacity = 0;
		setTimeout(function() {
			parent.style.display = 'none';
			callback && callback();
		}, 350);
	};

	that.setValue = function(percent) {
		cancelAnimationFrame(requestId);
		///
		that.hidden = false;
		parent.style.display = 'block';
		parent.style.opacity = 1.0;
		///
		if ((value = Math.ceil(percent)) >= 100) {
			that.hide();
		}
		///
		render();
	};

	addStyleSheet();

	return that;

};

var addStyleSheet = function() {
	if (document.getElementById('sk-timer-stylesheet') == null) {
		var style = document.createElement('style');
		style.id = 'sk-timer-stylesheet';
		style.innerHTML = '.sk-timer {\
				position: absolute;\
				z-index: 1000;\
				top: 0;\
				left: 0;\
				width: 100%;\
				height: 100%;\
			}\
			.sk-timer canvas {\
				border: 3px solid #000;\
				border-radius: 50%;\
				background: #000;\
				margin: auto;\
				position: absolute;\
				top: 0;\
				left: 0;\
				right: 0;\
				bottom: 0;\
			}\
		';
		document.head.appendChild(style);
	}
};

})(sketch);


/* 
	----------------------------------------------------------
	Color Space : 1.2 : 2012.11.06
	----------------------------------------------------------
	https://github.com/mudcube/Color.Space.js
	----------------------------------------------------------
	RGBA <-> HSLA  <-> W3
	RGBA <-> HSVA
	RGBA <-> CMY   <-> CMYK
	RGBA <-> HEX24 <-> W3
	RGBA <-> HEX32
	RGBA <-> W3
	----------------------------------------------------------
	Examples
	----------------------------------------------------------
	Color.Space(0x99ff0000, "HEX32>RGBA>HSLA>W3"); // outputs "hsla(60,100%,17%,0.6)"
	Color.Space(0xFF0000, "HEX24>RGB>HSL"); // convert hex24 to HSL object.
	----------------------------------------------------------
	W3 values
	----------------------------------------------------------
	rgb(255,0,0)
	rgba(255,0,0,1)
	rgb(100%,0%,0%)
	rgba(100%,0%,0%,1)
	hsl(120, 100%, 50%)
	hsla(120, 100%, 50%, 1)
	#000000
	----------------------------------------------------------
*/

if (typeof(Color) === "undefined") var Color = {};
if (typeof(Color.Space) === "undefined") Color.Space = {};

(function () { "use strict";

var useEval = false; // caches functions for quicker access.

var functions = {
	// holds generated cached conversion functions.
};

var shortcuts = {
	"HEX24>HSL": "HEX24>RGB>HSL",
	"HEX32>HSLA": "HEX32>RGBA>HSLA",
	"HEX24>CMYK": "HEX24>RGB>CMY>CMYK",
	"RGB>CMYK": "RGB>CMY>CMYK"
};

var root = Color.Space = function(color, route) {
	if (shortcuts[route]) { // shortcut available
		route = shortcuts[route];
	}
	var r = route.split(">");
	// check whether color is an [], if so, convert to {}
	if (typeof(color) === "object" && color[0] >= 0) { // array
		var type = r[0];
		var tmp = {};
		for(var i = 0; i < type.length; i ++) {
			var str = type.substr(i, 1);
			tmp[str] = color[i];
		}
		color = tmp;
	}
	if (functions[route]) { // cached function available
		return functions[route](color);
	}
	var f = "color";
	for (var pos = 1, key = r[0]; pos < r.length; pos ++) {
		if (pos > 1) { // recycle previous
			key = key.substr(key.indexOf("_") + 1);
		}
		key += (pos === 0 ? "" : "_") + r[pos];
		color = root[key](color);
		if (useEval) {
			f = "Color.Space."+key+"("+f+")";
		}
	}	
	if (useEval) {
		functions[route] = eval("(function(color) { return "+f+" })");
	}
	return color;
};

// W3C - RGB + RGBA

root.RGB_W3 = function(o) { 
	return "rgb(" + (o.R >> 0) + "," + (o.G >> 0) + "," + (o.B >> 0) + ")"; 
};

root.RGBA_W3 = function(o) { 
	var alpha = typeof(o.A) === "number" ? o.A / 255 : 1;
	return "rgba(" + (o.R >> 0) + "," + (o.G >> 0) + "," + (o.B >> 0) + "," + alpha + ")"; 
};

root.W3_RGB = function(o) {
	var o = o.substr(4, o.length - 5).split(",");
	return {
		R: parseInt(o[0]),
		G: parseInt(o[1]),
		B: parseInt(o[2])
	}
};

root.W3_RGBA = function(o) {
	var o = o.substr(5, o.length - 6).split(",");
	return {
		R: parseInt(o[0]),
		G: parseInt(o[1]),
		B: parseInt(o[2]),
		A: parseFloat(o[3]) * 255
	}
};

// W3C - HSL + HSLA

root.HSL_W3 = function(o) {
	return "hsl(" + ((o.H + 0.5) >> 0) + "," + ((o.S + 0.5) >> 0) + "%," + ((o.L + 0.5) >> 0) + "%)"; 
};

root.HSLA_W3 = function(o) {
	var alpha = typeof(o.A) === "number" ? o.A / 255 : 1;
	return "hsla(" + ((o.H + 0.5) >> 0) + "," + ((o.S + 0.5) >> 0) + "%," + ((o.L + 0.5) >> 0) + "%," + alpha + ")"; 
};

root.W3_HSL = function(o) {
	var o = o.substr(4, o.length - 5).split(",");
	return {
		H: parseInt(o[0]),
		S: parseInt(o[1]),
		L: parseInt(o[2])
	}
};

root.W3_HSLA = function(o) {
	var o = o.substr(5, o.length - 6).split(",");
	return {
		H: parseInt(o[0]),
		S: parseInt(o[1]),
		L: parseInt(o[2]),
		A: parseFloat(o[3]) * 255
	}
};

// W3 HEX = "FFFFFF" | "FFFFFFFF"

root.W3_HEX = 
root.W3_HEX24 = function (o) {
	if (o.substr(0, 1) === "#") o = o.substr(1);
	if (o.length === 3) o = o[0] + o[0] + o[1] + o[1] + o[2] + o[2];
	return parseInt("0x" + o);
};

root.W3_HEX32 = function (o) {
	if (o.substr(0, 1) === "#") o = o.substr(1);
	if (o.length === 6) {
		return parseInt("0xFF" + o);
	} else {
		return parseInt("0x" + o);
	}
};

// HEX = 0x000000 -> 0xFFFFFF

root.HEX_W3 =
root.HEX24_W3 = function (o, maxLength) {
	if (!maxLength) maxLength = 6;
	if (!o) o = 0;
	var z = o.toString(16);
	// when string is lesser than maxLength
	var n = z.length;
	while (n < maxLength) {
		z = "0" + z;
		n++;
	}
	// when string is greater than maxLength
	var n = z.length;
	while (n > maxLength) {
		z = z.substr(1);
		n--;
	}
	return "#" + z;
};

root.HEX32_W3 = function(o) {
	return root.HEX_W3(o, 8);
};

root.HEX_RGB =
root.HEX24_RGB = function (o) {
	return {
		R: (o >> 16),
		G: (o >> 8) & 0xFF,
		B: o & 0xFF
	};
};

// HEX32 = 0x00000000 -> 0xFFFFFFFF

root.HEX32_RGBA = function (o) {
	return {
		R: o >>> 16 & 0xFF,
		G: o >>> 8 & 0xFF,
		B: o & 0xFF,
		A: o >>> 24
	};
};

// RGBA = R: Red / G: Green / B: Blue / A: Alpha

root.RGBA_HEX32 = function (o) {
	return (o.A << 24 | o.R << 16 | o.G << 8 | o.B) >>> 0;
};

// RGB = R: Red / G: Green / B: Blue

root.RGB_HEX24 =
root.RGB_HEX = function (o) {
	if (o.R < 0) o.R = 0;
	if (o.G < 0) o.G = 0;
	if (o.B < 0) o.B = 0;
	if (o.R > 255) o.R = 255;
	if (o.G > 255) o.G = 255;
	if (o.B > 255) o.B = 255;
	return o.R << 16 | o.G << 8 | o.B;
};

root.RGB_CMY = function (o) {
	return {
		C: 1 - (o.R / 255),
		M: 1 - (o.G / 255),
		Y: 1 - (o.B / 255)
	};
};

root.RGBA_HSLA =
root.RGB_HSL = function (o) { // RGB from 0 to 1
	var _R = o.R / 255,
		_G = o.G / 255,
		_B = o.B / 255,
		min = Math.min(_R, _G, _B),
		max = Math.max(_R, _G, _B),
		D = max - min,
		H,
		S,
		L = (max + min) / 2;
	if (D === 0) { // No chroma
		H = 0;
		S = 0;
	} else { // Chromatic data
		if (L < 0.5) S = D / (max + min);
		else S = D / (2 - max - min);
		var DR = (((max - _R) / 6) + (D / 2)) / D;
		var DG = (((max - _G) / 6) + (D / 2)) / D;
		var DB = (((max - _B) / 6) + (D / 2)) / D;
		if (_R === max) H = DB - DG;
		else if (_G === max) H = (1 / 3) + DR - DB;
		else if (_B === max) H = (2 / 3) + DG - DR;
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		H: H * 360,
		S: S * 100,
		L: L * 100,
		A: o.A
	};
};

root.RGBA_HSVA =
root.RGB_HSV = function (o) { //- RGB from 0 to 255
	var _R = o.R / 255,
		_G = o.G / 255,
		_B = o.B / 255,
		min = Math.min(_R, _G, _B),
		max = Math.max(_R, _G, _B),
		D = max - min,
		H, 
		S,
		V = max;
	if (D === 0) { // No chroma
		H = 0;
		S = 0;
	} else { // Chromatic data
		S = D / max;
		var DR = (((max - _R) / 6) + (D / 2)) / D;
		var DG = (((max - _G) / 6) + (D / 2)) / D;
		var DB = (((max - _B) / 6) + (D / 2)) / D;
		if (_R === max) H = DB - DG;
		else if (_G === max) H = (1 / 3) + DR - DB;
		else if (_B === max) H = (2 / 3) + DG - DR;
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		H: H * 360,
		S: S * 100,
		V: V * 100,
		A: o.A
	};
};

// CMY = C: Cyan / M: Magenta / Y: Yellow

root.CMY_RGB = function (o) {
	return {
		R: Math.max(0, (1 - o.C) * 255),
		G: Math.max(0, (1 - o.M) * 255),
		B: Math.max(0, (1 - o.Y) * 255)
	};
};

root.CMY_CMYK = function (o) {
	var C = o.C;
	var M = o.M;
	var Y = o.Y;
	var K = Math.min(Y, Math.min(M, Math.min(C, 1)));
	C = Math.round((C - K) / (1 - K) * 100);
	M = Math.round((M - K) / (1 - K) * 100);
	Y = Math.round((Y - K) / (1 - K) * 100);
	K = Math.round(K * 100);
	return {
		C: C,
		M: M,
		Y: Y,
		K: K
	};
};

// CMYK = C: Cyan / M: Magenta / Y: Yellow / K: Key (black)

root.CMYK_CMY = function (o) {
	return {
		C: (o.C * (1 - o.K) + o.K),
		M: (o.M * (1 - o.K) + o.K),
		Y: (o.Y * (1 - o.K) + o.K)
	};
};

// HSL (1978) = H: Hue / S: Saturation / L: Lightess
// en.wikipedia.org/wiki/HSL_and_HSV

root.HSLA_RGBA =
root.HSL_RGB = function (o) {
	var H = o.H / 360;
	var S = o.S / 100;
	var L = o.L / 100;
	var R, G, B;
	var temp1, temp2, temp3;
	if (S === 0) {
		R = G = B = L;
	} else {
		if (L < 0.5) temp2 = L * (1 + S);
		else temp2 = (L + S) - (S * L);
		temp1 = 2 * L - temp2;
		// calculate red
		temp3 = H + (1 / 3);
		if (temp3 < 0) temp3 += 1;
		if (temp3 > 1) temp3 -= 1;
		if ((6 * temp3) < 1) R = temp1 + (temp2 - temp1) * 6 * temp3;
		else if ((2 * temp3) < 1) R = temp2;
		else if ((3 * temp3) < 2) R = temp1 + (temp2 - temp1) * ((2 / 3) - temp3) * 6;
		else R = temp1;
		// calculate green
		temp3 = H;
		if (temp3 < 0) temp3 += 1;
		if (temp3 > 1) temp3 -= 1;
		if ((6 * temp3) < 1) G = temp1 + (temp2 - temp1) * 6 * temp3;
		else if ((2 * temp3) < 1) G = temp2;
		else if ((3 * temp3) < 2) G = temp1 + (temp2 - temp1) * ((2 / 3) - temp3) * 6;
		else G = temp1;
		// calculate blue
		temp3 = H - (1 / 3);
		if (temp3 < 0) temp3 += 1;
		if (temp3 > 1) temp3 -= 1;
		if ((6 * temp3) < 1) B = temp1 + (temp2 - temp1) * 6 * temp3;
		else if ((2 * temp3) < 1) B = temp2;
		else if ((3 * temp3) < 2) B = temp1 + (temp2 - temp1) * ((2 / 3) - temp3) * 6;
		else B = temp1;
	}
	return {
		R: R * 255,
		G: G * 255,
		B: B * 255,
		A: o.A
	};
};

// HSV (1978) = H: Hue / S: Saturation / V: Value
// en.wikipedia.org/wiki/HSL_and_HSV

root.HSVA_RGBA = 
root.HSV_RGB = function (o) {
	var H = o.H / 360;
	var S = o.S / 100;
	var V = o.V / 100;
	var R, G, B, D, A, C;
	if (S === 0) {
		R = G = B = Math.round(V * 255);
	} else {
		if (H >= 1) H = 0;
		H = 6 * H;
		D = H - Math.floor(H);
		A = Math.round(255 * V * (1 - S));
		B = Math.round(255 * V * (1 - (S * D)));
		C = Math.round(255 * V * (1 - (S * (1 - D))));
		V = Math.round(255 * V);
		switch (Math.floor(H)) {
			case 0:
				R = V;
				G = C;
				B = A;
				break;
			case 1:
				R = B;
				G = V;
				B = A;
				break;
			case 2:
				R = A;
				G = V;
				B = C;
				break;
			case 3:
				R = A;
				G = B;
				B = V;
				break;
			case 4:
				R = C;
				G = A;
				B = V;
				break;
			case 5:
				R = V;
				G = A;
				B = B;
				break;
		}
	}
	return {
		R: R,
		G: G,
		B: B,
		A: o.A
	};
};

})();



/*:
	----------------------------------------------------
	event.js : 1.1.5 : 2013/12/12 : MIT License
	----------------------------------------------------
	https://github.com/mudcube/Event.js
	----------------------------------------------------
	1  : click, dblclick, dbltap
	1+ : tap, longpress, drag, swipe
	2+ : pinch, rotate
	   : mousewheel, devicemotion, shake
	----------------------------------------------------
	Ideas for the future
	----------------------------------------------------
	* GamePad, and other input abstractions.
	* Event batching - i.e. for every x fingers down a new gesture is created.
	----------------------------------------------------
	http://www.w3.org/TR/2011/WD-touch-events-20110505/
	----------------------------------------------------	
*/

if (typeof(eventjs) === "undefined") var eventjs = {};

(function(root) { "use strict";

// Add custom *EventListener commands to HTMLElements (set false to prevent funkiness).
root.modifyEventListener = false;

// Add bulk *EventListener commands on NodeLists from querySelectorAll and others  (set false to prevent funkiness).
root.modifySelectors = false;

// Event maintenance.
root.add = function(target, type, listener, configure) {
	return eventManager(target, type, listener, configure, "add");
};

root.remove = function(target, type, listener, configure) {
	return eventManager(target, type, listener, configure, "remove");
};

root.returnFalse = function(event) {
	return false;	
};

root.stop = function(event) {
	if (!event) return;
	if (event.stopPropagation) event.stopPropagation();
	event.cancelBubble = true; // <= IE8
	event.cancelBubbleCount = 0;
};

root.prevent = function(event) {
	if (!event) return;
	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.preventManipulation) {
		event.preventManipulation(); // MS
	} else {
		event.returnValue = false; // <= IE8
	}
};

root.cancel = function(event) {
	root.stop(event);
	root.prevent(event);
};

root.blur = function() { // Blurs the focused element. Useful when using eventjs.cancel as canceling will prevent focused elements from being blurred.
	var node = document.activeElement;
	if (!node) return;
	var nodeName = document.activeElement.nodeName;
	if (nodeName === "INPUT" || nodeName === "TEXTAREA" || node.contentEditable === "true") {
		if (node.blur) node.blur();
	}
};

// Check whether event is natively supported (via @kangax)
root.getEventSupport = function (target, type) {
	if (typeof(target) === "string") {
		type = target;
		target = window;
	}
	type = "on" + type;
	if (type in target) return true;
	if (!target.setAttribute) target = document.createElement("div");
	if (target.setAttribute && target.removeAttribute) {
		target.setAttribute(type, "");
		var isSupported = typeof target[type] === "function";
		if (typeof target[type] !== "undefined") target[type] = null;
		target.removeAttribute(type);
		return isSupported;
	}
};

var clone = function (obj) {
	if (!obj || typeof (obj) !== 'object') return obj;
	var temp = new obj.constructor();
	for (var key in obj) {
		if (!obj[key] || typeof (obj[key]) !== 'object') {
			temp[key] = obj[key];
		} else { // clone sub-object
			temp[key] = clone(obj[key]);
		}
	}
	return temp;
};

/// Handle custom *EventListener commands.
var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
	configure = configure || {};
	// Check whether target is a configuration variable;
	if (String(target) === "[object Object]") {
		var data = target;
		target = data.target; delete data.target;
		///
		if (data.type && data.listener) {
			type = data.type; delete data.type;
			listener = data.listener; delete data.listener;
			for (var key in data) {
				configure[key] = data[key];
			}
		} else { // specialness
			for (var param in data) {
				var value = data[param];
				if (typeof(value) === "function") continue;
				configure[param] = value;
			}
			///
			var ret = {};
			for (var key in data) {
				var param = key.split(",");
				var o = data[key];
				var conf = {};
				for (var k in configure) { // clone base configuration
					conf[k] = configure[k];
				}
				///
				if (typeof(o) === "function") { // without configuration
					var listener = o;
				} else if (typeof(o.listener) === "function") { // with configuration
					var listener = o.listener;
					for (var k in o) { // merge configure into base configuration
						if (typeof(o[k]) === "function") continue;
						conf[k] = o[k];
					}
				} else { // not a listener
					continue;
				}
				///
				for (var n = 0; n < param.length; n ++) {
					ret[key] = eventjs.add(target, param[n], listener, conf, trigger);
				}
			}
			return ret;
		}
	}
	///
	if (!target || !type || !listener) return;
	// Check for element to load on interval (before onload).
	if (typeof(target) === "string" && type === "ready") {
		if (window.eventjs_stallOnReady) { /// force stall for scripts to load
			type = "load";
			target = window;
		} else { //
			var time = (new Date()).getTime();
			var timeout = configure.timeout;
			var ms = configure.interval || 1000 / 60;
			var interval = window.setInterval(function() {
				if ((new Date()).getTime() - time > timeout) {
					window.clearInterval(interval);
				}
				if (document.querySelector(target)) {
					window.clearInterval(interval);
					setTimeout(listener, 1);
				}
			}, ms);
			return;
		}
	}
	// Get DOM element from Query Selector.
	if (typeof(target) === "string") {
		target = document.querySelectorAll(target);
		if (target.length === 0) return createError("Missing target on listener!", arguments); // No results.
		if (target.length === 1) { // Single target.
			target = target[0];
		}
	}

	/// Handle multiple targets.
	var event;
	var events = {};
	if (target.length > 0 && target !== window) { 
		for (var n0 = 0, length0 = target.length; n0 < length0; n0 ++) {
			event = eventManager(target[n0], type, listener, clone(configure), trigger);
			if (event) events[n0] = event;
		}	
		return createBatchCommands(events);
	}

	/// Check for multiple events in one string.
	if (typeof(type) === "string") {
		type = type.toLowerCase();
		if (type.indexOf(" ") !== -1) {
			type = type.split(" ");
		} else if (type.indexOf(",") !== -1) {
			type = type.split(",");
		}
	}
	
	/// Attach or remove multiple events associated with a target.
	if (typeof(type) !== "string") { // Has multiple events.
		if (typeof(type.length) === "number") { // Handle multiple listeners glued together.
			for (var n1 = 0, length1 = type.length; n1 < length1; n1 ++) { // Array [type]
				event = eventManager(target, type[n1], listener, clone(configure), trigger);
				if (event) events[type[n1]] = event;
			}
		} else { // Handle multiple listeners.
			for (var key in type) { // Object {type}
				if (typeof(type[key]) === "function") { // without configuration.
					event = eventManager(target, key, type[key], clone(configure), trigger);
				} else { // with configuration.
					event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
				}
				if (event) events[key] = event;
			}
		}
		return createBatchCommands(events);
	} else if (type.indexOf("on") === 0) { // to support things like "onclick" instead of "click"
		type = type.substr(2);
	}

	// Ensure listener is a function.
	if (typeof(target) !== "object") return createError("Target is not defined!", arguments);
	if (typeof(listener) !== "function") return createError("Listener is not a function!", arguments);

	// Generate a unique wrapper identifier.
	var useCapture = configure.useCapture || false;
	var id = getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
	// Handle the event.
	if (root.Gesture && root.Gesture._gestureHandlers[type]) { // Fire custom event.
		id = type + id;
		if (trigger === "remove") { // Remove event listener.
			if (!wrappers[id]) return; // Already removed.
			wrappers[id].remove();
			delete wrappers[id];
		} else if (trigger === "add") { // Attach event listener.
			if (wrappers[id]) {
				wrappers[id].add();
				return wrappers[id]; // Already attached.
			}
			// Retains "this" orientation.
			if (configure.useCall && !root.modifyEventListener) {
				var tmp = listener;
				listener = function(event, self) {
					for (var key in self) event[key] = self[key];
					return tmp.call(target, event);
				};
			}
			// Create listener proxy.
			configure.gesture = type; 
			configure.target = target;
			configure.listener = listener;
			configure.fromOverwrite = fromOverwrite;
			// Record wrapper.
			wrappers[id] = root.proxy[type](configure); 
		}
		return wrappers[id];
	} else { // Fire native event.
		var eventList = getEventList(type);
		for (var n = 0, eventId; n < eventList.length; n ++) {
			type = eventList[n];
			eventId = type + "." + id;
			if (trigger === "remove") { // Remove event listener.
				if (!wrappers[eventId]) continue; // Already removed.
				target[remove](type, listener, useCapture); 
				delete wrappers[eventId];
			} else if (trigger === "add") { // Attach event listener.
				if (wrappers[eventId]) return wrappers[eventId]; // Already attached.
				target[add](type, listener, useCapture); 
				// Record wrapper.
				wrappers[eventId] = { 
					id: eventId,
					type: type,
					target: target,
					listener: listener,
					remove: function() {
						for (var n = 0; n < eventList.length; n ++) {
							root.remove(target, eventList[n], listener, configure);
						}
					}
				};
			}
		}
		return wrappers[eventId];
	}
};

/// Perform batch actions on multiple events.
var createBatchCommands = function(events) {
	return {
		remove: function() { // Remove multiple events.
			for (var key in events) {
				events[key].remove();
			}
		},
		add: function() { // Add multiple events.
			for (var key in events) {
				events[key].add();
			}
		}
	};
};

/// Display error message in console.
var createError = function(message, data) {
	if (typeof(console) === "undefined") return;
	if (typeof(console.error) === "undefined") return;
	console.error(message, data);
};

/// Handle naming discrepancies between platforms.
var pointerDefs = {
	"msPointer": [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ],
	"touch": [ "touchstart", "touchmove", "touchend" ],
	"mouse": [ "mousedown", "mousemove", "mouseup" ]
};

var pointerDetect = {
	// MSPointer
	"MSPointerDown": 0, 
	"MSPointerMove": 1, 
	"MSPointerUp": 2,
	// Touch
	"touchstart": 0,
	"touchmove": 1,
	"touchend": 2,
	// Mouse
	"mousedown": 0,
	"mousemove": 1,
	"mouseup": 2
};

var getEventSupport = (function() {
	root.supports = {};
	if (window.navigator.msPointerEnabled) {
		root.supports.msPointer = true;
	}
	if (root.getEventSupport("touchstart")) {
		root.supports.touch = true;
	}
	if (root.getEventSupport("mousedown")) {
		root.supports.mouse = true;
	}
})();

var getEventList = (function() {
	return function(type) {
		var prefix = document.addEventListener ? "" : "on"; // IE
		var idx = pointerDetect[type];
		if (isFinite(idx)) {
			var types = [];
			for (var key in root.supports) {
				types.push(prefix + pointerDefs[key][idx]);
			}
			return types;
		} else {
			return [ prefix + type ];
		}
	};
})();

/// Event wrappers to keep track of all events placed in the window.
var wrappers = {};
var counter = 0;
var getID = function(object) {
	if (object === window) return "#window";
	if (object === document) return "#document";
	if (!object.uniqueID) object.uniqueID = "e" + counter ++;
	return object.uniqueID;
};

/// Detect platforms native *EventListener command.
var add = document.addEventListener ? "addEventListener" : "attachEvent";
var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";

/*
	Pointer.js
	----------------------------------------
	Modified from; https://github.com/borismus/pointer.js
*/

root.createPointerEvent = function (event, self, preventRecord) {
	var eventName = self.gesture;
	var target = self.target;
	var pts = event.changedTouches || root.proxy.getCoords(event);
	if (pts.length) {
		var pt = pts[0];
		self.pointers = preventRecord ? [] : pts;
		self.pageX = pt.pageX;
		self.pageY = pt.pageY;
		self.x = self.pageX;
		self.y = self.pageY;
	}
	///
	var newEvent = document.createEvent("Event");
	newEvent.initEvent(eventName, true, true);
	newEvent.originalEvent = event;
	for (var k in self) {
		if (k === "target") continue;
		newEvent[k] = self[k];
	}
	///
	var type = newEvent.type;
	if (root.Gesture && root.Gesture._gestureHandlers[type]) { // capture custom events.
//		target.dispatchEvent(newEvent);
		self.oldListener.call(target, newEvent, self, false);
	}
};

/// Allows *EventListener to use custom event proxies.
if (root.modifyEventListener && window.HTMLElement) (function() {
	var augmentEventListener = function(proto) {
		var recall = function(trigger) { // overwrite native *EventListener's
			var handle = trigger + "EventListener";
			var handler = proto[handle];
			proto[handle] = function (type, listener, useCapture) {
				if (root.Gesture && root.Gesture._gestureHandlers[type]) { // capture custom events.
					var configure = useCapture;
					if (typeof(useCapture) === "object") {
						configure.useCall = true;
					} else { // convert to configuration object.
						configure = {
							useCall: true,
							useCapture: useCapture
						};
					}
					eventManager(this, type, listener, configure, trigger, true);
//					handler.call(this, type, listener, useCapture);
				} else { // use native function.
					var types = getEventList(type);
					for (var n = 0; n < types.length; n ++) {
						handler.call(this, types[n], listener, useCapture);
					}
				}
			};
		};
		recall("add");
		recall("remove");
	};
	// NOTE: overwriting HTMLElement doesn't do anything in Firefox.
	if (navigator.userAgent.match(/Firefox/)) {
		// TODO: fix Firefox for the general case.
		augmentEventListener(HTMLDivElement.prototype);
		augmentEventListener(HTMLCanvasElement.prototype);
	} else {
		augmentEventListener(HTMLElement.prototype);
	}
	augmentEventListener(document);
	augmentEventListener(window);
})();

/// Allows querySelectorAll and other NodeLists to perform *EventListener commands in bulk.
if (root.modifySelectors) (function() {
	var proto = NodeList.prototype;
	proto.removeEventListener = function(type, listener, useCapture) {
		for (var n = 0, length = this.length; n < length; n ++) {
			this[n].removeEventListener(type, listener, useCapture);
		}
	};
	proto.addEventListener = function(type, listener, useCapture) {
		for (var n = 0, length = this.length; n < length; n ++) {
			this[n].addEventListener(type, listener, useCapture);
		}
	};
})();

return root;

})(eventjs);
/*:
	----------------------------------------------------
	eventjs.proxy : 0.4.2 : 2013/07/17 : MIT License
	----------------------------------------------------
	https://github.com/mudcube/eventjs.js
	----------------------------------------------------
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

/*
	Create a new pointer gesture instance.
*/

root.pointerSetup = function(conf, self) {
	/// Configure.
	conf.target = conf.target || window;
	conf.doc = conf.target.ownerDocument || conf.target; // Associated document.
	conf.minFingers = conf.minFingers || conf.fingers || 1; // Minimum required fingers.
	conf.maxFingers = conf.maxFingers || conf.fingers || Infinity; // Maximum allowed fingers.
	conf.position = conf.position || "relative"; // Determines what coordinate system points are returned.
	delete conf.fingers; //- 
	/// Convenience data.
	self = self || {};
	self.enabled = true;
	self.gesture = conf.gesture;
	self.target = conf.target;
	self.env = conf.env;
	///
	if (eventjs.modifyEventListener && conf.fromOverwrite) {
		conf.oldListener = conf.listener;
		conf.listener = eventjs.createPointerEvent;
	}
	/// Convenience commands.
	var fingers = 0;
	var type = self.gesture.indexOf("pointer") === 0 && eventjs.modifyEventListener ? "pointer" : "mouse";
	if (conf.oldListener) self.oldListener = conf.oldListener;
	///
	self.listener = conf.listener;
	self.proxy = function(listener) {
		self.defaultListener = conf.listener;
		conf.listener = listener;
		listener(conf.event, self);
	};
	self.add = function() {
		if (self.enabled === true) return;
		if (conf.onPointerDown) eventjs.add(conf.target, type + "down", conf.onPointerDown);
		if (conf.onPointerMove) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
		if (conf.onPointerUp) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
		self.enabled = true;
	};
	self.remove = function() {
		if (self.enabled === false) return;
		if (conf.onPointerDown) eventjs.remove(conf.target, type + "down", conf.onPointerDown);
		if (conf.onPointerMove) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
		if (conf.onPointerUp) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
		self.reset();
		self.enabled = false;
	};
	self.pause = function(opt) {
		if (conf.onPointerMove && (!opt || opt.move)) eventjs.remove(conf.doc, type + "move", conf.onPointerMove);
		if (conf.onPointerUp && (!opt || opt.up)) eventjs.remove(conf.doc, type + "up", conf.onPointerUp);
		fingers = conf.fingers;
		conf.fingers = 0;
	};
	self.resume = function(opt) {
		if (conf.onPointerMove && (!opt || opt.move)) eventjs.add(conf.doc, type + "move", conf.onPointerMove);
		if (conf.onPointerUp && (!opt || opt.up)) eventjs.add(conf.doc, type + "up", conf.onPointerUp);
		conf.fingers = fingers;
	};
	self.reset = function() {
		conf.tracker = {};
		conf.fingers = 0;
	};
	///
	return self;
};

/*
	Begin proxied pointer command.
*/

var sp = eventjs.supports; // Default pointerType
///
eventjs.isMouse = !!sp.mouse;
eventjs.isMSPointer = !!sp.touch;
eventjs.isTouch = !!sp.msPointer;
///
root.pointerStart = function(event, self, conf) {
	/// tracks multiple inputs
	var type = (event.type || "mousedown").toUpperCase();
	if (type.indexOf("MOUSE") === 0) {
		eventjs.isMouse = true;
		eventjs.isTouch = false;
		eventjs.isMSPointer = false;
	} else if (type.indexOf("TOUCH") === 0) {
		eventjs.isMouse = false;
		eventjs.isTouch = true;
		eventjs.isMSPointer = false;
	} else if (type.indexOf("MSPOINTER") === 0) {
		eventjs.isMouse = false;
		eventjs.isTouch = false;
		eventjs.isMSPointer = true;
	}
	///
	var addTouchStart = function(touch, sid) {	
		var bbox = conf.bbox;
		var pt = track[sid] = {};
		///
		switch(conf.position) {
			case "absolute": // Absolute from within window.
				pt.offsetX = 0;
				pt.offsetY = 0;
				break;
			case "differenceFromLast": // Since last coordinate recorded.
				pt.offsetX = touch.pageX;
				pt.offsetY = touch.pageY;
				break;
			case "difference": // Relative from origin.
				pt.offsetX = touch.pageX;
				pt.offsetY = touch.pageY;
				break;
			case "move": // Move target element.
				pt.offsetX = touch.pageX - bbox.x1;
				pt.offsetY = touch.pageY - bbox.y1;
				break;
			default: // Relative from within target.
				pt.offsetX = bbox.x1 - bbox.scrollLeft;
				pt.offsetY = bbox.y1 - bbox.scrollTop;
				break;
		}
		///
		var x = touch.pageX - pt.offsetX;
		var y = touch.pageY - pt.offsetY;
		///
		pt.rotation = 0;
		pt.scale = 1;
		pt.startTime = pt.moveTime = (new Date()).getTime();
		pt.move = { x: x, y: y };
		pt.start = { x: x, y: y };
		///
		conf.fingers ++;
	};
	///
	conf.event = event;
	if (self.defaultListener) {
		conf.listener = self.defaultListener;
		delete self.defaultListener;
	}
	///
	var isTouchStart = !conf.fingers;
	var track = conf.tracker;
	var touches = event.changedTouches || root.getCoords(event);
	var length = touches.length;
	// Adding touch events to tracking.
	for (var i = 0; i < length; i ++) {
		var touch = touches[i];
		var sid = touch.identifier || Infinity; // Touch ID.
		// Track the current state of the touches.
		if (conf.fingers) {
			if (conf.fingers >= conf.maxFingers) {
				var ids = [];
				for (var sid in conf.tracker) ids.push(sid);
				self.identifier = ids.join(",");
				return isTouchStart;
			}
			var fingers = 0; // Finger ID.
			for (var rid in track) {
				// Replace removed finger.
				if (track[rid].up) {
					delete track[rid];
					addTouchStart(touch, sid);
					conf.cancel = true;
					break;
				}
				fingers ++;
			}
			// Add additional finger.
			if (track[sid]) continue;
			addTouchStart(touch, sid);
		} else { // Start tracking fingers.
			track = conf.tracker = {};
			self.bbox = conf.bbox = root.getBoundingBox(conf.target);
			conf.fingers = 0;
			conf.cancel = false;
			addTouchStart(touch, sid);
		}
	}
	///
	var ids = [];
	for (var sid in conf.tracker) ids.push(sid);
	self.identifier = ids.join(",");
	///
	return isTouchStart;
};

/*
	End proxied pointer command.
*/

root.pointerEnd = function(event, self, conf, onPointerUp) {
	// Record changed touches have ended (iOS changedTouches is not reliable).
	var touches = event.touches || [];
	var length = touches.length;
	var exists = {};
	for (var i = 0; i < length; i ++) {
		var touch = touches[i];
		var sid = touch.identifier;
		exists[sid || Infinity] = true;
	}
	for (var sid in conf.tracker) {
		var track = conf.tracker[sid];
		if (exists[sid] || track.up) continue;
		if (onPointerUp) { // add changedTouches to mouse.
			onPointerUp({
				pageX: track.pageX,
				pageY: track.pageY,
				changedTouches: [{
					pageX: track.pageX,
					pageY: track.pageY,
					identifier: sid === "Infinity" ? Infinity : sid 
				}]
			}, "up");
		}
		track.up = true;
		conf.fingers --;
	}
/*	// This should work but fails in Safari on iOS4 so not using it.
	var touches = event.changedTouches || root.getCoords(event);
	var length = touches.length;
	// Record changed touches have ended (this should work).
	for (var i = 0; i < length; i ++) {
		var touch = touches[i];
		var sid = touch.identifier || Infinity;
		var track = conf.tracker[sid];
		if (track && !track.up) {
			if (onPointerUp) { // add changedTouches to mouse.
				onPointerUp({
					changedTouches: [{
						pageX: track.pageX,
						pageY: track.pageY,
						identifier: sid === "Infinity" ? Infinity : sid 
					}]
				}, "up");
			}
			track.up = true;
			conf.fingers --;
		}
	} */
	// Wait for all fingers to be released.
	if (conf.fingers !== 0) return false;
	// Record total number of fingers gesture used.
	var ids = [];
	conf.gestureFingers = 0;
	for (var sid in conf.tracker) {
		conf.gestureFingers ++;
		ids.push(sid);
	}
	self.identifier = ids.join(",");
	// Our pointer gesture has ended.
	return true;
};

/*
	Returns mouse coords in an array to match event.*Touches
	------------------------------------------------------------
	var touch = event.changedTouches || root.getCoords(event);
*/

root.getCoords = function(event) {
	if (typeof(event.pageX) !== "undefined") { // Desktop browsers.
		root.getCoords = function(event) {
			return Array({
				type: "mouse",
				x: event.pageX,
				y: event.pageY,
				pageX: event.pageX,
				pageY: event.pageY,
				identifier: event.pointerId || Infinity // pointerId is MS
			});
		};
	} else { // Internet Explorer <= 8.0
		root.getCoords = function(event) {
			var doc = document.documentElement;
			event = event || window.event;
			return Array({
				type: "mouse",
				x: event.clientX + doc.scrollLeft,
				y: event.clientY + doc.scrollTop,
				pageX: event.clientX + doc.scrollLeft,
				pageY: event.clientY + doc.scrollTop,
				identifier: Infinity
			});
		};
	}
	return root.getCoords(event);
};

/*
	Returns single coords in an object.
	------------------------------------------------------------
	var mouse = root.getCoord(event);
*/

root.getCoord = function(event) {
	if ("ontouchstart" in window) { // Mobile browsers.
		var pX = 0;
		var pY = 0;
		root.getCoord = function(event) {
			var touches = event.changedTouches;
			if (touches && touches.length) { // ontouchstart + ontouchmove
				return {
					x: pX = touches[0].pageX,
					y: pY = touches[0].pageY
				};
			} else { // ontouchend
				return {
					x: pX,
					y: pY
				};
			}
		};
	} else if(typeof(event.pageX) !== "undefined" && typeof(event.pageY) !== "undefined") { // Desktop browsers.
		root.getCoord = function(event) {
			return {
				x: event.pageX,
				y: event.pageY
			};
		};
	} else { // Internet Explorer <=8.0
		root.getCoord = function(event) {
			var doc = document.documentElement;
			event = event || window.event;
			return {
				x: event.clientX + doc.scrollLeft,
				y: event.clientY + doc.scrollTop
			};
		};
	}
	return root.getCoord(event);
};

/*
	Get target scale and position in space.	
*/

var getPropertyAsFloat = function(o, type) {
	var n = parseFloat(o.getPropertyValue(type), 10);
	return isFinite(n) ? n : 0;
};

root.getBoundingBox = function(o) { 
	if (o === window || o === document) o = document.body;
	///
	var bbox = {};
	var bcr = o.getBoundingClientRect();
	bbox.width = bcr.width;
	bbox.height = bcr.height;
	bbox.x1 = bcr.left;
	bbox.y1 = bcr.top;
	bbox.scaleX = bcr.width / o.offsetWidth || 1;
	bbox.scaleY = bcr.height / o.offsetHeight || 1;
	bbox.scrollLeft = 0;
	bbox.scrollTop = 0;
	///
	var style = window.getComputedStyle(o);
	var borderBox = style.getPropertyValue("box-sizing") === "border-box";
	///
	if (borderBox === false) {
		var left = getPropertyAsFloat(style, "border-left-width");
		var right = getPropertyAsFloat(style, "border-right-width");
		var bottom = getPropertyAsFloat(style, "border-bottom-width");
		var top = getPropertyAsFloat(style, "border-top-width");
		bbox.border = [ left, right, top, bottom ];
		bbox.x1 += left;
		bbox.y1 += top;
		bbox.width -= right + left;
		bbox.height -= bottom + top;
	}

/*	var left = getPropertyAsFloat(style, "padding-left");
	var right = getPropertyAsFloat(style, "padding-right");
	var bottom = getPropertyAsFloat(style, "padding-bottom");
	var top = getPropertyAsFloat(style, "padding-top");
	bbox.padding = [ left, right, top, bottom ];*/
	///
	bbox.x2 = bbox.x1 + bbox.width;
	bbox.y2 = bbox.y1 + bbox.height;
	
	/// Get the scroll of container element.
	var position = style.getPropertyValue("position");
	var tmp = position === "fixed" ? o : o.parentNode;
	while (tmp !== null) {
		if (tmp === document.body) break;
		if (tmp.scrollTop === undefined) break;
		var style = window.getComputedStyle(tmp);
		var position = style.getPropertyValue("position");
		if (position === "absolute") {

		} else if (position === "fixed") {
//			bbox.scrollTop += document.body.scrollTop;
//			bbox.scrollLeft += document.body.scrollLeft;
			bbox.scrollTop -= tmp.parentNode.scrollTop;
			bbox.scrollLeft -= tmp.parentNode.scrollLeft;
			break;
		} else {
			bbox.scrollLeft += tmp.scrollLeft;
			bbox.scrollTop += tmp.scrollTop;
		}
		///
		tmp = tmp.parentNode;
	};
	///
	bbox.scrollBodyLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	bbox.scrollBodyTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	///
	bbox.scrollLeft -= bbox.scrollBodyLeft;
	bbox.scrollTop -= bbox.scrollBodyTop;
	///
	return bbox;
};

/*
	Keep track of metaKey, the proper ctrlKey for users platform.
	----------------------------------------------------
	http://www.quirksmode.org/js/keys.html
*/

(function() {
	var agent = navigator.userAgent.toLowerCase();
	var mac = agent.indexOf("macintosh") !== -1;
	var metaKeys;
	if (mac && agent.indexOf("khtml") !== -1) { // chrome, safari.
		metaKeys = { 91: true, 93: true };
	} else if (mac && agent.indexOf("firefox") !== -1) {  // mac firefox.
		metaKeys = { 224: true };
	} else { // windows, linux, or mac opera.
		metaKeys = { 17: true };
	}
	(root.metaTrackerReset = function() {
		eventjs.fnKey = root.fnKey = false;
		eventjs.metaKey = root.metaKey = false;
		eventjs.ctrlKey = root.ctrlKey = false;
		eventjs.shiftKey = root.shiftKey = false;
		eventjs.altKey = root.altKey = false;
	})();
	root.metaTracker = function(event) {
		var metaCheck = !!metaKeys[event.keyCode];
		if (metaCheck) eventjs.metaKey = root.metaKey = event.type === "keydown";
		eventjs.ctrlKey = root.ctrlKey = event.ctrlKey;
		eventjs.shiftKey = root.shiftKey = event.shiftKey;
		eventjs.altKey = root.altKey = event.altKey;
		return metaCheck;
	};
})();

return root;

})(eventjs.proxy);
/*:
	----------------------------------------------------
	"MutationObserver" event proxy.
	----------------------------------------------------
	author: Selvakumar Arumugam - MIT LICENSE
	   src: http://stackoverflow.com/questions/10868104/can-you-have-a-javascript-hook-trigger-after-a-dom-elements-style-object-change
	----------------------------------------------------
*/
if (typeof(eventjs) === "undefined") var eventjs = {};

eventjs.MutationObserver = (function() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var DOMAttrModifiedSupported = !MutationObserver && (function() {
		var p = document.createElement("p");
		var flag = false;
		var fn = function() { flag = true };
		if (p.addEventListener) {
			p.addEventListener("DOMAttrModified", fn, false);
		} else if (p.attachEvent) {
			p.attachEvent("onDOMAttrModified", fn);
		} else {
			return false;
		}
		///
		p.setAttribute("id", "target");
		///
		return flag;
	})();
	///
	return function(container, callback) {
		if (MutationObserver) {
			var options = {
				subtree: false,
				attributes: true
			};
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(e) {
					callback.call(e.target, e.attributeName);
				});
			});
			observer.observe(container, options)
		} else if (DOMAttrModifiedSupported) {
			eventjs.add(container, "DOMAttrModified", function(e) {
				callback.call(container, e.attrName);
			});
		} else if ("onpropertychange" in document.body) {
			eventjs.add(container, "propertychange", function(e) {
				callback.call(container, window.event.propertyName);
			});
		}
	}
})();
/*:
	"Click" event proxy.
	----------------------------------------------------
	eventjs.add(window, "click", function(event, self) {});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.click = function(conf) {
	conf.gesture = conf.gesture || "click";
	conf.maxFingers = conf.maxFingers || conf.fingers || 1;
	/// Tracking the events.
	conf.onPointerDown = function (event) {
		if (root.pointerStart(event, self, conf)) {
			eventjs.add(conf.target, "mouseup", conf.onPointerUp);
		}
	};
	conf.onPointerUp = function(event) {
		if (root.pointerEnd(event, self, conf)) {
			eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
			var pointers = event.changedTouches || root.getCoords(event);
			var pointer = pointers[0];
			var bbox = conf.bbox;
			var newbbox = root.getBoundingBox(conf.target);
			var y = pointer.pageY - newbbox.scrollBodyTop;
			var x = pointer.pageX - newbbox.scrollBodyLeft;
			////
			if (x > bbox.x1 && y > bbox.y1 &&
				x < bbox.x2 && y < bbox.y2 &&
				bbox.scrollTop === newbbox.scrollTop) { // has not been scrolled
				///
				for (var key in conf.tracker) break; //- should be modularized? in dblclick too
				var point = conf.tracker[key];
				self.x = point.start.x;
				self.y = point.start.y;
				///
				conf.listener(event, self);
			}
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	self.state = "click";
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.click = root.click;

return root;

})(eventjs.proxy);
/*:
	"Double-Click" aka "Double-Tap" event proxy.
	----------------------------------------------------
	eventjs.add(window, "dblclick", function(event, self) {});
	----------------------------------------------------
	Touch an target twice for <= 700ms, with less than 25 pixel drift.
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.dbltap =
root.dblclick = function(conf) {
	conf.gesture = conf.gesture || "dbltap";
	conf.maxFingers = conf.maxFingers || conf.fingers || 1;
	// Setting up local variables.
	var delay = 700; // in milliseconds
	var time0, time1, timeout; 
	var pointer0, pointer1;
	// Tracking the events.
	conf.onPointerDown = function (event) {
		var pointers = event.changedTouches || root.getCoords(event);
		if (time0 && !time1) { // Click #2
			pointer1 = pointers[0];
			time1 = (new Date()).getTime() - time0;
		} else { // Click #1
			pointer0 = pointers[0];
			time0 = (new Date()).getTime();
			time1 = 0;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				time0 = 0;
			}, delay);
		}
		if (root.pointerStart(event, self, conf)) {
			eventjs.add(conf.target, "mousemove", conf.onPointerMove).listener(event);
			eventjs.add(conf.target, "mouseup", conf.onPointerUp);
		}
	};
	conf.onPointerMove = function (event) {
		if (time0 && !time1) {
			var pointers = event.changedTouches || root.getCoords(event);
			pointer1 = pointers[0];
		}
		var bbox = conf.bbox;
		var ax = (pointer1.pageX - bbox.x1);
		var ay = (pointer1.pageY - bbox.y1);
		if (!(ax > 0 && ax < bbox.width && // Within target coordinates..
			  ay > 0 && ay < bbox.height &&
			  Math.abs(pointer1.pageX - pointer0.pageX) <= 25 && // Within drift deviance.
			  Math.abs(pointer1.pageY - pointer0.pageY) <= 25)) {
			// Cancel out this listener.
			eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
			clearTimeout(timeout);
			time0 = time1 = 0;
		}
	};
	conf.onPointerUp = function(event) {
		if (root.pointerEnd(event, self, conf)) {
			eventjs.remove(conf.target, "mousemove", conf.onPointerMove);
			eventjs.remove(conf.target, "mouseup", conf.onPointerUp);
		}
		if (time0 && time1) {
			if (time1 <= delay) { // && !(event.cancelBubble && ++event.cancelBubbleCount > 1)) {
				self.state = conf.gesture;
				for (var key in conf.tracker) break;
				var point = conf.tracker[key];
				self.x = point.start.x;
				self.y = point.start.y;
				conf.listener(event, self);
			}
			clearTimeout(timeout);
			time0 = time1 = 0;
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	self.state = "dblclick";
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.dbltap = root.dbltap;
eventjs.Gesture._gestureHandlers.dblclick = root.dblclick;

return root;

})(eventjs.proxy);
/*:
	"Drag" event proxy (1+ fingers).
	----------------------------------------------------
	CONFIGURE: maxFingers, position.
	----------------------------------------------------
	eventjs.add(window, "drag", function(event, self) {
		console.log(self.gesture, self.state, self.start, self.x, self.y, self.bbox);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.dragElement = function(that, event) {
	root.drag({
		event: event,
		target: that,
		position: "move",
		listener: function(event, self) {
			that.style.left = self.x + "px";
			that.style.top = self.y + "px";
			eventjs.prevent(event);
		}
	});
};

root.drag = function(conf) {
	conf.gesture = "drag";
	conf.onPointerDown = function (event) {
		if (root.pointerStart(event, self, conf)) {
			if (!conf.monitor) {
				eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
				eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
			}
		}
		// Process event listener.
		conf.onPointerMove(event, "down");
	};
	conf.onPointerMove = function (event, state) {
		if (!conf.tracker) return conf.onPointerDown(event);
//alertify.log('move')
		var bbox = conf.bbox;
		var touches = event.changedTouches || root.getCoords(event);
		var length = touches.length;
		for (var i = 0; i < length; i ++) {
			var touch = touches[i];
			var identifier = touch.identifier || Infinity;
			var pt = conf.tracker[identifier];
			// Identifier defined outside of listener.
			if (!pt) continue;
			pt.pageX = touch.pageX;
			pt.pageY = touch.pageY;
			// Record data.
			self.state = state || "move";
			self.identifier = identifier;
			self.start = pt.start;
			self.fingers = conf.fingers;
			if (conf.position === "differenceFromLast") {
				self.x = (pt.pageX - pt.offsetX);
				self.y = (pt.pageY - pt.offsetY);
				pt.offsetX = pt.pageX;
				pt.offsetY = pt.pageY;
			} else {
				self.x = (pt.pageX - pt.offsetX);
				self.y = (pt.pageY - pt.offsetY);
			}
			///
			conf.listener(event, self);
		}
	};
	conf.onPointerUp = function(event) {
		// Remove tracking for touch.
		if (root.pointerEnd(event, self, conf, conf.onPointerMove)) {
			if (!conf.monitor) {
				eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
				eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
			}
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	// Attach events.
	if (conf.event) {
		conf.onPointerDown(conf.event);
	} else { //
		eventjs.add(conf.target, "mousedown", conf.onPointerDown);
		if (conf.monitor) {
			eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
			eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
		}
	}
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.drag = root.drag;

return root;

})(eventjs.proxy);
/*:
	"Gesture" event proxy (2+ fingers).
	----------------------------------------------------
	CONFIGURE: minFingers, maxFingers.
	----------------------------------------------------
	eventjs.add(window, "gesture", function(event, self) {
		console.log(
			self.x, // centroid 
			self.y,
			self.rotation,
			self.scale, 
			self.fingers, 
			self.state
		);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

var RAD_DEG = Math.PI / 180;
var getCentroid = function(self, points) {
	var centroidx = 0;
	var centroidy = 0;
	var length = 0;
	for (var sid in points) {
		var touch = points[sid];
		if (touch.up) continue;
		centroidx += touch.move.x;
		centroidy += touch.move.y;
		length ++;
	}
	self.x = centroidx /= length;
	self.y = centroidy /= length;
	return self;
};

root.gesture = function(conf) {
	conf.gesture = conf.gesture || "gesture";
	conf.minFingers = conf.minFingers || conf.fingers || 2;
	// Tracking the events.
	conf.onPointerDown = function (event) {
		var fingers = conf.fingers;
		if (root.pointerStart(event, self, conf)) {
			eventjs.add(conf.doc, "mousemove", conf.onPointerMove);
			eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
		}
		// Record gesture start.
		if (conf.fingers === conf.minFingers && fingers !== conf.fingers) {
			self.fingers = conf.minFingers;
			self.scale = 1;
			self.rotation = 0;
			self.state = "start";
			var sids = ""; //- FIXME(mud): can generate duplicate IDs.
			for (var key in conf.tracker) sids += key;
			self.identifier = parseInt(sids);
			getCentroid(self, conf.tracker);
			conf.listener(event, self);
		}
	};
	///
	conf.onPointerMove = function (event, state) {
		var bbox = conf.bbox;
		var points = conf.tracker;
		var touches = event.changedTouches || root.getCoords(event);
		var length = touches.length;
		// Update tracker coordinates.
		for (var i = 0; i < length; i ++) {
			var touch = touches[i];
			var sid = touch.identifier || Infinity;
			var pt = points[sid];
			// Check whether "pt" is used by another gesture.
			if (!pt) continue; 
			// Find the actual coordinates.
			pt.move.x = (touch.pageX - bbox.x1);
			pt.move.y = (touch.pageY - bbox.y1);
		}
		///
		if (conf.fingers < conf.minFingers) return;
		///
		var touches = [];
		var scale = 0;
		var rotation = 0;

		/// Calculate centroid of gesture.
		getCentroid(self, points);
		///
		for (var sid in points) {
			var touch = points[sid];
			if (touch.up) continue;
			var start = touch.start;
			if (!start.distance) {
				var dx = start.x - self.x;
				var dy = start.y - self.y;
				start.distance = Math.sqrt(dx * dx + dy * dy);
				start.angle = Math.atan2(dx, dy) / RAD_DEG;
			}
			// Calculate scale.
			var dx = touch.move.x - self.x;
			var dy = touch.move.y - self.y;
			var distance = Math.sqrt(dx * dx + dy * dy);
			scale += distance / start.distance;
			// Calculate rotation.
			var angle = Math.atan2(dx, dy) / RAD_DEG;
			var rotate = (start.angle - angle + 360) % 360 - 180;
			touch.DEG2 = touch.DEG1; // Previous degree.
			touch.DEG1 = rotate > 0 ? rotate : -rotate; // Current degree.
			if (typeof(touch.DEG2) !== "undefined") {
				if (rotate > 0) {
					touch.rotation += touch.DEG1 - touch.DEG2;
				} else {
					touch.rotation -= touch.DEG1 - touch.DEG2;
				}
				rotation += touch.rotation;
			}
			// Attach current points to self.
			touches.push(touch.move);
		}
		///
		self.touches = touches;
		self.fingers = conf.fingers;
		self.scale = scale / conf.fingers;
		self.rotation = rotation / conf.fingers;
		self.state = "change";
		conf.listener(event, self);
	};
	conf.onPointerUp = function(event) {
		// Remove tracking for touch.
		var fingers = conf.fingers;
		if (root.pointerEnd(event, self, conf)) {
			eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
			eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
		}
		// Check whether fingers has dropped below minFingers.
		if (fingers === conf.minFingers && conf.fingers < conf.minFingers) {
			self.fingers = conf.fingers;
			self.state = "end";
			conf.listener(event, self);
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.gesture = root.gesture;

return root;

})(eventjs.proxy);
/*:
	"Pointer" event proxy (1+ fingers).
	----------------------------------------------------
	CONFIGURE: minFingers, maxFingers.
	----------------------------------------------------
	eventjs.add(window, "gesture", function(event, self) {
		console.log(self.rotation, self.scale, self.fingers, self.state);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.pointerdown = 
root.pointermove = 
root.pointerup = function(conf) {
	conf.gesture = conf.gesture || "pointer";
	if (conf.target.isPointerEmitter) return;
	// Tracking the events.
	var isDown = true;
	conf.onPointerDown = function (event) {
		isDown = false;
		self.gesture = "pointerdown";
		conf.listener(event, self);
	};
	conf.onPointerMove = function (event) {
		self.gesture = "pointermove";
		conf.listener(event, self, isDown);
	};
	conf.onPointerUp = function (event) {
		isDown = true;
		self.gesture = "pointerup";
		conf.listener(event, self, true);
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	eventjs.add(conf.target, "mousemove", conf.onPointerMove);
	eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
	// Return this object.
	conf.target.isPointerEmitter = true;
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.pointerdown = root.pointerdown;
eventjs.Gesture._gestureHandlers.pointermove = root.pointermove;
eventjs.Gesture._gestureHandlers.pointerup = root.pointerup;

return root;

})(eventjs.proxy);
/*:
	"Device Motion" and "Shake" event proxy.
	----------------------------------------------------
	http://developer.android.com/reference/android/hardware/Sensoreventjs.html#values
	----------------------------------------------------
	eventjs.add(window, "shake", function(event, self) {});
	eventjs.add(window, "devicemotion", function(event, self) {
		console.log(self.acceleration, self.accelerationIncludingGravity);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.shake = function(conf) {
	// Externally accessible data.
	var self = {
		gesture: "devicemotion",
		acceleration: {},
		accelerationIncludingGravity: {},
		target: conf.target,
		listener: conf.listener,
		remove: function() {
			window.removeEventListener('devicemotion', onDeviceMotion, false);
		}
	};
	// Setting up local variables.
	var threshold = 4; // Gravitational threshold.
	var timeout = 1000; // Timeout between shake events.
	var timeframe = 200; // Time between shakes.
	var shakes = 3; // Minimum shakes to trigger event.
	var lastShake = (new Date()).getTime();
	var gravity = { x: 0, y: 0, z: 0 };
	var delta = {
		x: { count: 0, value: 0 },
		y: { count: 0, value: 0 },
		z: { count: 0, value: 0 }
	};
	// Tracking the events.
	var onDeviceMotion = function(e) {
		var alpha = 0.8; // Low pass filter.
		var o = e.accelerationIncludingGravity;
		gravity.x = alpha * gravity.x + (1 - alpha) * o.x;
		gravity.y = alpha * gravity.y + (1 - alpha) * o.y;
		gravity.z = alpha * gravity.z + (1 - alpha) * o.z; 
		self.accelerationIncludingGravity = gravity;
		self.acceleration.x = o.x - gravity.x;
		self.acceleration.y = o.y - gravity.y;
		self.acceleration.z = o.z - gravity.z;
		///
		if (conf.gesture === "devicemotion") {
			conf.listener(e, self);
			return;
		} 
		var data = "xyz";
		var now = (new Date()).getTime();
		for (var n = 0, length = data.length; n < length; n ++) {
			var letter = data[n];
			var ACCELERATION = self.acceleration[letter];
			var DELTA = delta[letter];
			var abs = Math.abs(ACCELERATION);
			/// Check whether another shake event was recently registered.
			if (now - lastShake < timeout) continue;
			/// Check whether delta surpasses threshold.
			if (abs > threshold) {
				var idx = now * ACCELERATION / abs;
				var span = Math.abs(idx + DELTA.value);
				// Check whether last delta was registered within timeframe.
				if (DELTA.value && span < timeframe) {
					DELTA.value = idx;
					DELTA.count ++;
					// Check whether delta count has enough shakes.
					if (DELTA.count === shakes) {
						conf.listener(e, self);
						// Reset tracking.
						lastShake = now;
						DELTA.value = 0;
						DELTA.count = 0;
					}
				} else {
					// Track first shake.
					DELTA.value = idx;
					DELTA.count = 1;
				}
			}
		}
	};
	// Attach events.
	if (!window.addEventListener) return;
	window.addEventListener('devicemotion', onDeviceMotion, false);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.shake = root.shake;

return root;

})(eventjs.proxy);
/*:
	"Swipe" event proxy (1+ fingers).
	----------------------------------------------------
	CONFIGURE: snap, threshold, maxFingers.
	----------------------------------------------------
	eventjs.add(window, "swipe", function(event, self) {
		console.log(self.velocity, self.angle);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

var RAD_DEG = Math.PI / 180;

root.swipe = function(conf) {
	conf.snap = conf.snap || 90; // angle snap.
	conf.threshold = conf.threshold || 1; // velocity threshold.
	conf.gesture = conf.gesture || "swipe";
	// Tracking the events.
	conf.onPointerDown = function (event) {
		if (root.pointerStart(event, self, conf)) {
			eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
			eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
		}
	};
	conf.onPointerMove = function (event) {
		var touches = event.changedTouches || root.getCoords(event);
		var length = touches.length;
		for (var i = 0; i < length; i ++) {
			var touch = touches[i];
			var sid = touch.identifier || Infinity;
			var o = conf.tracker[sid];
			// Identifier defined outside of listener.
			if (!o) continue; 
			o.move.x = touch.pageX;
			o.move.y = touch.pageY;
			o.moveTime = (new Date()).getTime();
		}
	};
	conf.onPointerUp = function(event) {
		if (root.pointerEnd(event, self, conf)) {
			eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
			eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
			///
			var velocity1;
			var velocity2
			var degree1;
			var degree2;
			/// Calculate centroid of gesture.
			var start = { x: 0, y: 0 };
			var endx = 0;
			var endy = 0;
			var length = 0;
			///
			for (var sid in conf.tracker) {
				var touch = conf.tracker[sid];
				var xdist = touch.move.x - touch.start.x;
				var ydist = touch.move.y - touch.start.y;
				///
				endx += touch.move.x;
				endy += touch.move.y;
				start.x += touch.start.x;
				start.y += touch.start.y;
				length ++;
				///
				var distance = Math.sqrt(xdist * xdist + ydist * ydist);
				var ms = touch.moveTime - touch.startTime;
				var degree2 = Math.atan2(xdist, ydist) / RAD_DEG + 180;
				var velocity2 = ms ? distance / ms : 0;
				if (typeof(degree1) === "undefined") {
					degree1 = degree2;
					velocity1 = velocity2;
				} else if (Math.abs(degree2 - degree1) <= 20) {
					degree1 = (degree1 + degree2) / 2;
					velocity1 = (velocity1 + velocity2) / 2;
				} else {
					return;
				}
			}
			///
			var fingers = conf.gestureFingers;
			if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
				if (velocity1 > conf.threshold) {
					start.x /= length;
					start.y /= length;
					self.start = start;
					self.x = endx / length;
					self.y = endy / length;
					self.angle = -((((degree1 / conf.snap + 0.5) >> 0) * conf.snap || 360) - 360);
					self.velocity = velocity1;
					self.fingers = fingers;
					self.state = "swipe";
					conf.listener(event, self);
				}
			}
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.swipe = root.swipe;

return root;

})(eventjs.proxy);
/*:
	"Tap" and "Longpress" event proxy.
	----------------------------------------------------
	CONFIGURE: delay (longpress), timeout (tap).
	----------------------------------------------------
	eventjs.add(window, "tap", function(event, self) {
		console.log(self.fingers);
	});
	----------------------------------------------------
	multi-finger tap // touch an target for <= 250ms.
	multi-finger longpress // touch an target for >= 500ms
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.longpress = function(conf) {
	conf.gesture = "longpress";
	return root.tap(conf);
};

root.tap = function(conf) {
	conf.delay = conf.delay || 500;
	conf.timeout = conf.timeout || 250;
	conf.driftDeviance = conf.driftDeviance || 10;
	conf.gesture = conf.gesture || "tap";
	// Setting up local variables.
	var timestamp, timeout;
	// Tracking the events.
	conf.onPointerDown = function (event) {
		if (root.pointerStart(event, self, conf)) {
			timestamp = (new Date()).getTime();
			// Initialize event listeners.
			eventjs.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
			eventjs.add(conf.doc, "mouseup", conf.onPointerUp);
			// Make sure this is a "longpress" event.
			if (conf.gesture !== "longpress") return;
			timeout = setTimeout(function() {
				if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
				// Make sure no fingers have been changed.
				var fingers = 0;
				for (var key in conf.tracker) {
					var point = conf.tracker[key];
					if (point.end === true) return;
					if (conf.cancel) return;
					fingers ++;
				}
				// Send callback.
				if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
					self.state = "start";
					self.fingers = fingers;
					self.x = point.start.x;
					self.y = point.start.y;
					conf.listener(event, self);
				}
			}, conf.delay);
		}
	};
	conf.onPointerMove = function (event) {
		var bbox = conf.bbox;
		var touches = event.changedTouches || root.getCoords(event);
		var length = touches.length;
		for (var i = 0; i < length; i ++) {
			var touch = touches[i];
			var identifier = touch.identifier || Infinity;
			var pt = conf.tracker[identifier];
			if (!pt) continue;
			var x = (touch.pageX - bbox.x1);
			var y = (touch.pageY - bbox.y1);
			///
			var dx = x - pt.start.x;
			var dy = y - pt.start.y;
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (!(x > 0 && x < bbox.width && // Within target coordinates..
				  y > 0 && y < bbox.height &&
				  distance <= conf.driftDeviance)) { // Within drift deviance.
				// Cancel out this listener.
				eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
				conf.cancel = true;
				return;
			}
		}
	};
	conf.onPointerUp = function(event) {
		if (root.pointerEnd(event, self, conf)) {
			clearTimeout(timeout);
			eventjs.remove(conf.doc, "mousemove", conf.onPointerMove);
			eventjs.remove(conf.doc, "mouseup", conf.onPointerUp);
			if (event.cancelBubble && ++event.cancelBubbleCount > 1) return;
			// Callback release on longpress.
			if (conf.gesture === "longpress") {
				if (self.state === "start") {
					self.state = "end";
					conf.listener(event, self);
				}
				return;
			}
			// Cancel event due to movement.
			if (conf.cancel) return;
			// Ensure delay is within margins.
			if ((new Date()).getTime() - timestamp > conf.timeout) return;
			// Send callback.
			var fingers = conf.gestureFingers;
			if (conf.minFingers <= fingers && conf.maxFingers >= fingers) {
				self.state = "tap";
				self.fingers = conf.gestureFingers;
				conf.listener(event, self);
			}
		}
	};
	// Generate maintenance commands, and other configurations.
	var self = root.pointerSetup(conf);
	// Attach events.
	eventjs.add(conf.target, "mousedown", conf.onPointerDown);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.tap = root.tap;
eventjs.Gesture._gestureHandlers.longpress = root.longpress;

return root;

})(eventjs.proxy);
/*:
	"Mouse Wheel" event proxy.
	----------------------------------------------------
	eventjs.add(window, "wheel", function(event, self) {
		console.log(self.state, self.wheelDelta);
	});
*/

if (typeof(eventjs) === "undefined") var eventjs = {};
if (typeof(eventjs.proxy) === "undefined") eventjs.proxy = {};

eventjs.proxy = (function(root) { "use strict";

root.wheelPreventElasticBounce = function(el) {
	if (!el) return;
	if (typeof(el) === "string") el = document.querySelector(el);
	eventjs.add(el, "wheel", function(event, self) {
		self.preventElasticBounce();
		eventjs.stop(event);
	});
};

root.wheel = function(conf) {
	// Configure event listener.
	var interval;
	var timeout = conf.timeout || 150;
	var count = 0;
	// Externally accessible data.
	var self = {
		gesture: "wheel",
		state: "start",
		wheelDelta: 0,
		target: conf.target,
		listener: conf.listener,
		preventElasticBounce: function(event) {
			var target = this.target;
			var scrollTop = target.scrollTop;
			var top = scrollTop + target.offsetHeight;
			var height = target.scrollHeight;
			if (top === height && this.wheelDelta <= 0) eventjs.cancel(event);
			else if (scrollTop === 0 && this.wheelDelta >= 0) eventjs.cancel(event);
			eventjs.stop(event);
		},
		add: function() {
			conf.target[add](type, onMouseWheel, false);
		},
		remove: function() {
			conf.target[remove](type, onMouseWheel, false);
		}
	};
	// Tracking the events.
	var onMouseWheel = function(event) {
		event = event || window.event;
		self.state = count++ ? "change" : "start";
		self.wheelDelta = event.detail ? event.detail * -20 : event.wheelDelta;
		conf.listener(event, self);
		clearTimeout(interval);
		interval = setTimeout(function() {
			count = 0;
			self.state = "end";
			self.wheelDelta = 0;
			conf.listener(event, self);
		}, timeout);
	};
	// Attach events.
	var add = document.addEventListener ? "addEventListener" : "attachEvent";
	var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
	var type = eventjs.getEventSupport("mousewheel") ? "mousewheel" : "DOMMouseScroll";
	conf.target[add](type, onMouseWheel, false);
	// Return this object.
	return self;
};

eventjs.Gesture = eventjs.Gesture || {};
eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
eventjs.Gesture._gestureHandlers.wheel = root.wheel;

return root;

})(eventjs.proxy);

///
var addEvent = eventjs.add;
var removeEvent = eventjs.remove;
///
(function() {
	for (var key in eventjs) {
		Event[key] = eventjs[key];
	}
	for (var key in eventjs.proxy) {
		addEvent[key] = eventjs.proxy[key];
	}
})();


/// Toggle between Pause and Play modes
export var pausePlayStop = function(stop) {
    var d = document.getElementById("pausePlayStop");
    if (stop) {
      MIDI.player.stop();
      d.src = "../../assets/dongmoon_images/play.png";
    } else if (MIDI.player.isPlaying) {
      d.src = "../../assets/dongmoon_images/play.png";
      MIDI.player.pause(true);
    } else {
      d.src = "../../assets/dongmoon_images/pause.png";
      MIDI.player.play();
    }
  };

  eventjs.add(window, "load", function(event) {
    
    MIDI.loader = new sketch.ui.Timer;
    MIDI.loadPlugin({
      soundfontUrl: "../../assets/dongmoon_soundfonts/",
      onprogress: function(state, progress) {
        MIDI.loader.setValue(progress * 100);
      },
      onsuccess: function() {

        /// this sets up the MIDI.player and gets things going...
        player = MIDI.player;
        player.timeWarp = 1; // speed the song is played back
        player.loadFile(song[songid++ % song.length], player.start);

        MIDIPlayerPercentage(player);
      }
    });
  });

  var MIDIPlayerPercentage = function(player) {
    // update the timestamp
    var time1 = document.getElementById("time1");
    var time2 = document.getElementById("time2");
    var capsule = document.getElementById("capsule");
    var timeCursor = document.getElementById("cursor");
    //
    eventjs.add(capsule, "drag", function(event, self) {
      eventjs.cancel(event);
      player.currentTime = (self.x) / 420 * player.duration;
      if (player.currentTime < 0) player.currentTime = 0;
      if (player.currentTime > player.duration) player.currentTime = player.duration;
      if (self.state === "down") {
        player.pause(true);
      } else if (self.state === "up") {
        player.play();
      }
    });
    //
    function timeFormatting(n) {
      var minutes = n / 60 >> 0;
      var seconds = String(n - (minutes * 60) >> 0);
      if (seconds.length == 1) seconds = "0" + seconds;
      return minutes + ":" + seconds;
    };
    player.getNextSong = function(n) {
      var id = Math.abs((songid += n) % song.length);
      player.loadFile(song[songid], player.start);
    };
    player.setAnimation(function(event, element) {
      var progress = event.progress;
      var currentTime = event.currentTime >> 0; // where we are now
      var duration = event.duration >> 0; // end of song
      ///
      if (currentTime === duration) { // go to next song
        var id = ++songid % song.length;
        player.loadFile(song[songid], player.start);
      }
      ///
      timeCursor.style.width = (progress * 100) + "%";
      time1.innerHTML = timeFormatting(currentTime);
      time2.innerHTML = "-" + timeFormatting(duration - currentTime);
    });
  };
    
  // Begin loading indication.
  export var player;
  // MIDI files from Disklavier World
  var songid = 0;
  var song = ['../../assets/midi_data/albeniz/alb_esp1.mid', '../../assets/midi_data/albeniz/alb_esp2.mid', '../../assets/midi_data/albeniz/alb_esp3.mid', '../../assets/midi_data/albeniz/alb_esp4.mid', '../../assets/midi_data/albeniz/alb_esp5.mid', '../../assets/midi_data/albeniz/alb_esp6.mid', '../../assets/midi_data/albeniz/alb_se1.mid', '../../assets/midi_data/albeniz/alb_se2.mid', '../../assets/midi_data/albeniz/alb_se3.mid', '../../assets/midi_data/albeniz/alb_se4.mid', '../../assets/midi_data/albeniz/alb_se5.mid', '../../assets/midi_data/albeniz/alb_se6.mid', '../../assets/midi_data/albeniz/alb_se7.mid', '../../assets/midi_data/albeniz/alb_se8.mid', '../../assets/midi_data/bach/bach_846.mid', '../../assets/midi_data/bach/bach_847.mid', '../../assets/midi_data/bach/bach_850.mid', '../../assets/midi_data/balakir/islamei.mid', '../../assets/midi_data/beeth/appass_1.mid', '../../assets/midi_data/beeth/appass_2.mid', '../../assets/midi_data/beeth/appass_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_1.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_2.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_4.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_1.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_2.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_3.mid', '../../assets/midi_data/beeth/beethoven_opus10_1.mid', '../../assets/midi_data/beeth/beethoven_opus10_2.mid', '../../assets/midi_data/beeth/beethoven_opus10_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_1.mid', '../../assets/midi_data/beeth/beethoven_opus22_2.mid', '../../assets/midi_data/beeth/beethoven_opus22_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_4.mid', '../../assets/midi_data/beeth/beethoven_opus90_1.mid', '../../assets/midi_data/beeth/beethoven_opus90_2.mid', '../../assets/midi_data/beeth/elise.mid', '../../assets/midi_data/beeth/mond_1.mid', '../../assets/midi_data/beeth/mond_2.mid', '../../assets/midi_data/beeth/mond_3.mid', '../../assets/midi_data/beeth/pathetique_1.mid', '../../assets/midi_data/beeth/pathetique_2.mid', '../../assets/midi_data/beeth/pathetique_3.mid', '../../assets/midi_data/beeth/waldstein_1.mid', '../../assets/midi_data/beeth/waldstein_2.mid', '../../assets/midi_data/beeth/waldstein_3.mid', '../../assets/midi_data/borodin/bor_ps1.mid', '../../assets/midi_data/borodin/bor_ps2.mid', '../../assets/midi_data/borodin/bor_ps3.mid', '../../assets/midi_data/borodin/bor_ps4.mid', '../../assets/midi_data/borodin/bor_ps5.mid', '../../assets/midi_data/borodin/bor_ps6.mid', '../../assets/midi_data/borodin/bor_ps7.mid', '../../assets/midi_data/brahms/brahms_opus117_1.mid', '../../assets/midi_data/brahms/brahms_opus117_2.mid', '../../assets/midi_data/brahms/brahms_opus1_1.mid', '../../assets/midi_data/brahms/brahms_opus1_2.mid', '../../assets/midi_data/brahms/brahms_opus1_3.mid', '../../assets/midi_data/brahms/brahms_opus1_4.mid', '../../assets/midi_data/brahms/br_im2.mid', '../../assets/midi_data/brahms/br_im5.mid', '../../assets/midi_data/brahms/BR_IM6.MID', '../../assets/midi_data/brahms/br_rhap.mid', '../../assets/midi_data/burgm/burg_agitato.mid', '../../assets/midi_data/burgm/burg_erwachen.mid', '../../assets/midi_data/burgm/burg_geschwindigkeit.mid', '../../assets/midi_data/burgm/burg_gewitter.mid', '../../assets/midi_data/burgm/burg_perlen.mid', '../../assets/midi_data/burgm/burg_quelle.mid', '../../assets/midi_data/burgm/burg_spinnerlied.mid', '../../assets/midi_data/burgm/burg_sylphen.mid', '../../assets/midi_data/burgm/burg_trennung.mid', '../../assets/midi_data/chopin/chpn_op10_e01.mid', '../../assets/midi_data/chopin/chpn_op10_e05.mid', '../../assets/midi_data/chopin/chpn_op10_e12.mid', '../../assets/midi_data/chopin/chpn_op23.mid', '../../assets/midi_data/chopin/chpn_op25_e11.mid', '../../assets/midi_data/chopin/chpn_op25_e12.mid', '../../assets/midi_data/chopin/chpn_op25_e1.mid', '../../assets/midi_data/chopin/chpn_op25_e2.mid', '../../assets/midi_data/chopin/chpn_op25_e3.mid', '../../assets/midi_data/chopin/chpn_op25_e4.mid', '../../assets/midi_data/chopin/chpn_op27_1.mid', '../../assets/midi_data/chopin/chpn_op27_2.mid', '../../assets/midi_data/chopin/chpn_op33_2.mid', '../../assets/midi_data/chopin/chpn_op33_4.mid', '../../assets/midi_data/chopin/chpn_op35_1.mid', '../../assets/midi_data/chopin/chpn_op35_2.mid', '../../assets/midi_data/chopin/chpn_op35_3.mid', '../../assets/midi_data/chopin/chpn_op35_4.mid', '../../assets/midi_data/chopin/chpn_op53.mid', '../../assets/midi_data/chopin/chpn_op66.mid', '../../assets/midi_data/chopin/chpn_op7_1.mid', '../../assets/midi_data/chopin/chpn_op7_2.mid', '../../assets/midi_data/chopin/chpn-p10.mid', '../../assets/midi_data/chopin/chpn-p11.mid', '../../assets/midi_data/chopin/chpn-p12.mid', '../../assets/midi_data/chopin/chpn-p13.mid', '../../assets/midi_data/chopin/chpn-p14.mid', '../../assets/midi_data/chopin/chpn-p15.mid', '../../assets/midi_data/chopin/chpn-p16.mid', '../../assets/midi_data/chopin/chpn-p17.mid', '../../assets/midi_data/chopin/chpn-p18.mid', '../../assets/midi_data/chopin/chpn-p19.mid', '../../assets/midi_data/chopin/chpn-p1.mid', '../../assets/midi_data/chopin/chpn-p20.mid', '../../assets/midi_data/chopin/chpn-p21.mid', '../../assets/midi_data/chopin/chpn-p22.mid', '../../assets/midi_data/chopin/chpn-p23.mid', '../../assets/midi_data/chopin/chpn-p24.mid', '../../assets/midi_data/chopin/chpn-p2.mid', '../../assets/midi_data/chopin/chpn-p3.mid', '../../assets/midi_data/chopin/chpn-p4.mid', '../../assets/midi_data/chopin/chpn-p5.mid', '../../assets/midi_data/chopin/chpn-p6.mid', '../../assets/midi_data/chopin/chpn-p7.mid', '../../assets/midi_data/chopin/chpn-p8.mid', '../../assets/midi_data/chopin/chpn-p9.mid', '../../assets/midi_data/chopin/chp_op18.mid', '../../assets/midi_data/chopin/chp_op31.mid', '../../assets/midi_data/debussy/DEB_CLAI.MID', '../../assets/midi_data/debussy/deb_menu.mid', '../../assets/midi_data/debussy/DEB_PASS.MID', '../../assets/midi_data/debussy/deb_prel.mid', '../../assets/midi_data/debussy/debussy_cc_1.mid', '../../assets/midi_data/debussy/debussy_cc_2.mid', '../../assets/midi_data/debussy/debussy_cc_3.mid', '../../assets/midi_data/debussy/debussy_cc_4.mid', '../../assets/midi_data/debussy/debussy_cc_6.mid', '../../assets/midi_data/granados/gra_esp_2.mid', '../../assets/midi_data/granados/gra_esp_3.mid', '../../assets/midi_data/granados/gra_esp_4.mid', '../../assets/midi_data/grieg/grieg_album.mid', '../../assets/midi_data/grieg/grieg_berceuse.mid', '../../assets/midi_data/grieg/grieg_brooklet.mid', '../../assets/midi_data/grieg/grieg_butterfly.mid', '../../assets/midi_data/grieg/grieg_elfentanz.mid', '../../assets/midi_data/grieg/grieg_halling.mid', '../../assets/midi_data/grieg/grieg_kobold.mid', '../../assets/midi_data/grieg/grieg_march.mid', '../../assets/midi_data/grieg/grieg_once_upon_a_time.mid', '../../assets/midi_data/grieg/grieg_spring.mid', '../../assets/midi_data/grieg/grieg_voeglein.mid', '../../assets/midi_data/grieg/grieg_waechter.mid', '../../assets/midi_data/grieg/grieg_walzer.mid', '../../assets/midi_data/grieg/grieg_wanderer.mid', '../../assets/midi_data/grieg/grieg_wedding.mid', '../../assets/midi_data/grieg/grieg_zwerge.mid', '../../assets/midi_data/haydn/hay_40_1.mid', '../../assets/midi_data/haydn/hay_40_2.mid', '../../assets/midi_data/haydn/haydn_33_1.mid', '../../assets/midi_data/haydn/haydn_33_2.mid', '../../assets/midi_data/haydn/haydn_33_3.mid', '../../assets/midi_data/haydn/haydn_35_1.mid', '../../assets/midi_data/haydn/haydn_35_2.mid', '../../assets/midi_data/haydn/haydn_35_3.mid', '../../assets/midi_data/haydn/haydn_43_1.mid', '../../assets/midi_data/haydn/haydn_43_2.mid', '../../assets/midi_data/haydn/haydn_43_3.mid', '../../assets/midi_data/haydn/haydn_7_1.mid', '../../assets/midi_data/haydn/haydn_7_2.mid', '../../assets/midi_data/haydn/haydn_7_3.mid', '../../assets/midi_data/haydn/haydn_8_1.mid', '../../assets/midi_data/haydn/haydn_8_2.mid', '../../assets/midi_data/haydn/haydn_8_3.mid', '../../assets/midi_data/haydn/haydn_8_4.mid', '../../assets/midi_data/haydn/haydn_9_1.mid', '../../assets/midi_data/haydn/haydn_9_2.mid', '../../assets/midi_data/haydn/haydn_9_3.mid', '../../assets/midi_data/liszt/liz_donjuan.mid', '../../assets/midi_data/liszt/liz_et1.mid', '../../assets/midi_data/liszt/liz_et2.mid', '../../assets/midi_data/liszt/liz_et3.mid', '../../assets/midi_data/liszt/liz_et4.mid', '../../assets/midi_data/liszt/liz_et5.mid', '../../assets/midi_data/liszt/liz_et6.mid', '../../assets/midi_data/liszt/liz_et_trans4.mid', '../../assets/midi_data/liszt/liz_et_trans5.mid', '../../assets/midi_data/liszt/liz_et_trans8.mid', '../../assets/midi_data/liszt/liz_liebestraum.mid', '../../assets/midi_data/liszt/liz_rhap02.mid', '../../assets/midi_data/liszt/liz_rhap09.mid', '../../assets/midi_data/liszt/liz_rhap10.mid', '../../assets/midi_data/liszt/liz_rhap12.mid', '../../assets/midi_data/liszt/liz_rhap15.mid', '../../assets/midi_data/mendelssohn/mendel_op19_1.mid', '../../assets/midi_data/mendelssohn/mendel_op19_2.mid', '../../assets/midi_data/mendelssohn/mendel_op19_3.mid', '../../assets/midi_data/mendelssohn/mendel_op19_4.mid', '../../assets/midi_data/mendelssohn/mendel_op19_5.mid', '../../assets/midi_data/mendelssohn/mendel_op19_6.mid', '../../assets/midi_data/mendelssohn/mendel_op30_1.mid', '../../assets/midi_data/mendelssohn/mendel_op30_2.mid', '../../assets/midi_data/mendelssohn/mendel_op30_3.mid', '../../assets/midi_data/mendelssohn/mendel_op30_4.mid', '../../assets/midi_data/mendelssohn/mendel_op30_5.mid', '../../assets/midi_data/mendelssohn/mendel_op53_5.mid', '../../assets/midi_data/mendelssohn/mendel_op62_3.mid', '../../assets/midi_data/mendelssohn/mendel_op62_4.mid', '../../assets/midi_data/mendelssohn/mendel_op62_5.mid', '../../assets/midi_data/mozart/mz_311_1.mid', '../../assets/midi_data/mozart/mz_311_2.mid', '../../assets/midi_data/mozart/mz_311_3.mid', '../../assets/midi_data/mozart/mz_330_1.mid', '../../assets/midi_data/mozart/mz_330_2.mid', '../../assets/midi_data/mozart/mz_330_3.mid', '../../assets/midi_data/mozart/mz_331_1.mid', '../../assets/midi_data/mozart/mz_331_2.mid', '../../assets/midi_data/mozart/mz_331_3.mid', '../../assets/midi_data/mozart/mz_332_1.mid', '../../assets/midi_data/mozart/mz_332_2.mid', '../../assets/midi_data/mozart/mz_332_3.mid', '../../assets/midi_data/mozart/mz_333_1.mid', '../../assets/midi_data/mozart/mz_333_2.mid', '../../assets/midi_data/mozart/mz_333_3.mid', '../../assets/midi_data/mozart/mz_545_1.mid', '../../assets/midi_data/mozart/mz_545_2.mid', '../../assets/midi_data/mozart/mz_545_3.mid', '../../assets/midi_data/mozart/mz_570_1.mid', '../../assets/midi_data/mozart/mz_570_2.mid', '../../assets/midi_data/mozart/mz_570_3.mid', '../../assets/midi_data/muss/muss_1.mid', '../../assets/midi_data/muss/muss_2.mid', '../../assets/midi_data/muss/muss_3.mid', '../../assets/midi_data/muss/muss_4.mid', '../../assets/midi_data/muss/muss_5.mid', '../../assets/midi_data/muss/muss_6.mid', '../../assets/midi_data/muss/muss_7.mid', '../../assets/midi_data/muss/muss_8.mid', '../../assets/midi_data/schubert/schu_143_1.mid', '../../assets/midi_data/schubert/schu_143_2.mid', '../../assets/midi_data/schubert/schu_143_3.mid', '../../assets/midi_data/schubert/schub_d760_1.mid', '../../assets/midi_data/schubert/schub_d760_2.mid', '../../assets/midi_data/schubert/schub_d760_3.mid', '../../assets/midi_data/schubert/schub_d760_4.mid', '../../assets/midi_data/schubert/schub_d960_1.mid', '../../assets/midi_data/schubert/schub_d960_2.mid', '../../assets/midi_data/schubert/schub_d960_3.mid', '../../assets/midi_data/schubert/schub_d960_4.mid', '../../assets/midi_data/schubert/schubert_D850_1.mid', '../../assets/midi_data/schubert/schubert_D850_2.mid', '../../assets/midi_data/schubert/schubert_D850_3.mid', '../../assets/midi_data/schubert/schubert_D850_4.mid', '../../assets/midi_data/schubert/schubert_D935_1.mid', '../../assets/midi_data/schubert/schubert_D935_2.mid', '../../assets/midi_data/schubert/schubert_D935_3.mid', '../../assets/midi_data/schubert/schubert_D935_4.mid', '../../assets/midi_data/schubert/schuim-1.mid', '../../assets/midi_data/schubert/schuim-2.mid', '../../assets/midi_data/schubert/schuim-3.mid', '../../assets/midi_data/schubert/schuim-4.mid', '../../assets/midi_data/schubert/schumm-1.mid', '../../assets/midi_data/schubert/schumm-2.mid', '../../assets/midi_data/schubert/schumm-3.mid', '../../assets/midi_data/schubert/schumm-4.mid', '../../assets/midi_data/schubert/schumm-5.mid', '../../assets/midi_data/schubert/schumm-6.mid', '../../assets/midi_data/schumann/schum_abegg.mid', '../../assets/midi_data/schumann/scn15_10.mid', '../../assets/midi_data/schumann/scn15_11.mid', '../../assets/midi_data/schumann/scn15_12.mid', '../../assets/midi_data/schumann/scn15_13.mid', '../../assets/midi_data/schumann/scn15_1.mid', '../../assets/midi_data/schumann/scn15_2.mid', '../../assets/midi_data/schumann/scn15_3.mid', '../../assets/midi_data/schumann/scn15_4.mid', '../../assets/midi_data/schumann/scn15_5.mid', '../../assets/midi_data/schumann/scn15_6.mid', '../../assets/midi_data/schumann/scn15_7.mid', '../../assets/midi_data/schumann/scn15_8.mid', '../../assets/midi_data/schumann/scn15_9.mid', '../../assets/midi_data/schumann/scn16_1.mid', '../../assets/midi_data/schumann/scn16_2.mid', '../../assets/midi_data/schumann/scn16_3.mid', '../../assets/midi_data/schumann/scn16_4.mid', '../../assets/midi_data/schumann/scn16_5.mid', '../../assets/midi_data/schumann/scn16_6.mid', '../../assets/midi_data/schumann/scn16_7.mid', '../../assets/midi_data/schumann/scn16_8.mid', '../../assets/midi_data/schumann/scn68_10.mid', '../../assets/midi_data/schumann/scn68_12.mid', '../../assets/midi_data/tschai/ty_april.mid', '../../assets/midi_data/tschai/ty_august.mid', '../../assets/midi_data/tschai/ty_dezember.mid', '../../assets/midi_data/tschai/ty_februar.mid', '../../assets/midi_data/tschai/ty_januar.mid', '../../assets/midi_data/tschai/ty_juli.mid', '../../assets/midi_data/tschai/ty_juni.mid', '../../assets/midi_data/tschai/ty_maerz.mid', '../../assets/midi_data/tschai/ty_mai.mid', '../../assets/midi_data/tschai/ty_november.mid', '../../assets/midi_data/tschai/ty_oktober.mid', '../../assets/midi_data/tschai/ty_september.mid'];

  if (typeof(MIDI) === "undefined") var MIDI = {};
  if (typeof(MIDI.Soundfont) === "undefined") MIDI.Soundfont = {};
  
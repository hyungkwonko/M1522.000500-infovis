import { Component, OnInit, NgModule, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dongmoon',
  templateUrl: './dongmoon.component.html',
  styleUrls: ['./dongmoon.component.css']
})
export class DongmoonComponent implements OnInit {

  constructor(
    private renderer2: Renderer2,
    @Inject (DOCUMENT) private _document
  ) {
  }

  ngOnInit() {
    // load .js files
    const js_files = ["../../assets/dongmoon_sources/Base64.js", "../../assets/dongmoon_sources/Base64binary.js", "../../assets/dongmoon_sources/WebAudioAPI.js", "../../assets/dongmoon_sources/WebMIDIAPI.js", "../../assets/dongmoon_sources/stream.js", "../../assets/dongmoon_sources/midifile.js", "../../assets/dongmoon_sources/replayer.js", "../../assets/dongmoon_sources/audioDetect.js", "../../assets/dongmoon_sources/gm.js", "../../assets/dongmoon_sources/loader.js", "../../assets/dongmoon_sources/plugin.audiotag.js", "../../assets/dongmoon_sources/plugin.webaudio.js", "../../assets/dongmoon_sources/plugin.webmidi.js", "../../assets/dongmoon_sources/player.js", "../../assets/dongmoon_sources/synesthesia.js", "../../assets/dongmoon_sources/dom_request_xhr.js", "../../assets/dongmoon_sources/dom_request_script.js", "../../assets/dongmoon_sources/timer.js", "../../assets/dongmoon_sources/colorspace.js", "../../assets/dongmoon_sources/event.js"];
    for (var i:any = 0; i < js_files.length; i++) {
      let s = this.renderer2.createElement ('script');
      s.type = 'text/javascript';
      s.src = js_files[i];
      s.text = ``;
      this.renderer2.appendChild (this._document.head, s);
    }

    let script = this.renderer2.createElement ('script');
    script.text = `

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
      var pausePlayStop = function(stop) {
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
      var player;
      // MIDI files from Disklavier World
      var songid = 0;
      var song = ['../../assets/midi_data/albeniz/alb_esp1.mid', '../../assets/midi_data/albeniz/alb_esp2.mid', '../../assets/midi_data/albeniz/alb_esp3.mid', '../../assets/midi_data/albeniz/alb_esp4.mid', '../../assets/midi_data/albeniz/alb_esp5.mid', '../../assets/midi_data/albeniz/alb_esp6.mid', '../../assets/midi_data/albeniz/alb_se1.mid', '../../assets/midi_data/albeniz/alb_se2.mid', '../../assets/midi_data/albeniz/alb_se3.mid', '../../assets/midi_data/albeniz/alb_se4.mid', '../../assets/midi_data/albeniz/alb_se5.mid', '../../assets/midi_data/albeniz/alb_se6.mid', '../../assets/midi_data/albeniz/alb_se7.mid', '../../assets/midi_data/albeniz/alb_se8.mid', '../../assets/midi_data/bach/bach_846.mid', '../../assets/midi_data/bach/bach_847.mid', '../../assets/midi_data/bach/bach_850.mid', '../../assets/midi_data/balakir/islamei.mid', '../../assets/midi_data/beeth/appass_1.mid', '../../assets/midi_data/beeth/appass_2.mid', '../../assets/midi_data/beeth/appass_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_1.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_2.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_3.mid', '../../assets/midi_data/beeth/beethoven_hammerklavier_4.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_1.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_2.mid', '../../assets/midi_data/beeth/beethoven_les_adieux_3.mid', '../../assets/midi_data/beeth/beethoven_opus10_1.mid', '../../assets/midi_data/beeth/beethoven_opus10_2.mid', '../../assets/midi_data/beeth/beethoven_opus10_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_1.mid', '../../assets/midi_data/beeth/beethoven_opus22_2.mid', '../../assets/midi_data/beeth/beethoven_opus22_3.mid', '../../assets/midi_data/beeth/beethoven_opus22_4.mid', '../../assets/midi_data/beeth/beethoven_opus90_1.mid', '../../assets/midi_data/beeth/beethoven_opus90_2.mid', '../../assets/midi_data/beeth/elise.mid', '../../assets/midi_data/beeth/mond_1.mid', '../../assets/midi_data/beeth/mond_2.mid', '../../assets/midi_data/beeth/mond_3.mid', '../../assets/midi_data/beeth/pathetique_1.mid', '../../assets/midi_data/beeth/pathetique_2.mid', '../../assets/midi_data/beeth/pathetique_3.mid', '../../assets/midi_data/beeth/waldstein_1.mid', '../../assets/midi_data/beeth/waldstein_2.mid', '../../assets/midi_data/beeth/waldstein_3.mid', '../../assets/midi_data/borodin/bor_ps1.mid', '../../assets/midi_data/borodin/bor_ps2.mid', '../../assets/midi_data/borodin/bor_ps3.mid', '../../assets/midi_data/borodin/bor_ps4.mid', '../../assets/midi_data/borodin/bor_ps5.mid', '../../assets/midi_data/borodin/bor_ps6.mid', '../../assets/midi_data/borodin/bor_ps7.mid', '../../assets/midi_data/brahms/brahms_opus117_1.mid', '../../assets/midi_data/brahms/brahms_opus117_2.mid', '../../assets/midi_data/brahms/brahms_opus1_1.mid', '../../assets/midi_data/brahms/brahms_opus1_2.mid', '../../assets/midi_data/brahms/brahms_opus1_3.mid', '../../assets/midi_data/brahms/brahms_opus1_4.mid', '../../assets/midi_data/brahms/br_im2.mid', '../../assets/midi_data/brahms/br_im5.mid', '../../assets/midi_data/brahms/BR_IM6.MID', '../../assets/midi_data/brahms/br_rhap.mid', '../../assets/midi_data/burgm/burg_agitato.mid', '../../assets/midi_data/burgm/burg_erwachen.mid', '../../assets/midi_data/burgm/burg_geschwindigkeit.mid', '../../assets/midi_data/burgm/burg_gewitter.mid', '../../assets/midi_data/burgm/burg_perlen.mid', '../../assets/midi_data/burgm/burg_quelle.mid', '../../assets/midi_data/burgm/burg_spinnerlied.mid', '../../assets/midi_data/burgm/burg_sylphen.mid', '../../assets/midi_data/burgm/burg_trennung.mid', '../../assets/midi_data/chopin/chpn_op10_e01.mid', '../../assets/midi_data/chopin/chpn_op10_e05.mid', '../../assets/midi_data/chopin/chpn_op10_e12.mid', '../../assets/midi_data/chopin/chpn_op23.mid', '../../assets/midi_data/chopin/chpn_op25_e11.mid', '../../assets/midi_data/chopin/chpn_op25_e12.mid', '../../assets/midi_data/chopin/chpn_op25_e1.mid', '../../assets/midi_data/chopin/chpn_op25_e2.mid', '../../assets/midi_data/chopin/chpn_op25_e3.mid', '../../assets/midi_data/chopin/chpn_op25_e4.mid', '../../assets/midi_data/chopin/chpn_op27_1.mid', '../../assets/midi_data/chopin/chpn_op27_2.mid', '../../assets/midi_data/chopin/chpn_op33_2.mid', '../../assets/midi_data/chopin/chpn_op33_4.mid', '../../assets/midi_data/chopin/chpn_op35_1.mid', '../../assets/midi_data/chopin/chpn_op35_2.mid', '../../assets/midi_data/chopin/chpn_op35_3.mid', '../../assets/midi_data/chopin/chpn_op35_4.mid', '../../assets/midi_data/chopin/chpn_op53.mid', '../../assets/midi_data/chopin/chpn_op66.mid', '../../assets/midi_data/chopin/chpn_op7_1.mid', '../../assets/midi_data/chopin/chpn_op7_2.mid', '../../assets/midi_data/chopin/chpn-p10.mid', '../../assets/midi_data/chopin/chpn-p11.mid', '../../assets/midi_data/chopin/chpn-p12.mid', '../../assets/midi_data/chopin/chpn-p13.mid', '../../assets/midi_data/chopin/chpn-p14.mid', '../../assets/midi_data/chopin/chpn-p15.mid', '../../assets/midi_data/chopin/chpn-p16.mid', '../../assets/midi_data/chopin/chpn-p17.mid', '../../assets/midi_data/chopin/chpn-p18.mid', '../../assets/midi_data/chopin/chpn-p19.mid', '../../assets/midi_data/chopin/chpn-p1.mid', '../../assets/midi_data/chopin/chpn-p20.mid', '../../assets/midi_data/chopin/chpn-p21.mid', '../../assets/midi_data/chopin/chpn-p22.mid', '../../assets/midi_data/chopin/chpn-p23.mid', '../../assets/midi_data/chopin/chpn-p24.mid', '../../assets/midi_data/chopin/chpn-p2.mid', '../../assets/midi_data/chopin/chpn-p3.mid', '../../assets/midi_data/chopin/chpn-p4.mid', '../../assets/midi_data/chopin/chpn-p5.mid', '../../assets/midi_data/chopin/chpn-p6.mid', '../../assets/midi_data/chopin/chpn-p7.mid', '../../assets/midi_data/chopin/chpn-p8.mid', '../../assets/midi_data/chopin/chpn-p9.mid', '../../assets/midi_data/chopin/chp_op18.mid', '../../assets/midi_data/chopin/chp_op31.mid', '../../assets/midi_data/debussy/DEB_CLAI.MID', '../../assets/midi_data/debussy/deb_menu.mid', '../../assets/midi_data/debussy/DEB_PASS.MID', '../../assets/midi_data/debussy/deb_prel.mid', '../../assets/midi_data/debussy/debussy_cc_1.mid', '../../assets/midi_data/debussy/debussy_cc_2.mid', '../../assets/midi_data/debussy/debussy_cc_3.mid', '../../assets/midi_data/debussy/debussy_cc_4.mid', '../../assets/midi_data/debussy/debussy_cc_6.mid', '../../assets/midi_data/granados/gra_esp_2.mid', '../../assets/midi_data/granados/gra_esp_3.mid', '../../assets/midi_data/granados/gra_esp_4.mid', '../../assets/midi_data/grieg/grieg_album.mid', '../../assets/midi_data/grieg/grieg_berceuse.mid', '../../assets/midi_data/grieg/grieg_brooklet.mid', '../../assets/midi_data/grieg/grieg_butterfly.mid', '../../assets/midi_data/grieg/grieg_elfentanz.mid', '../../assets/midi_data/grieg/grieg_halling.mid', '../../assets/midi_data/grieg/grieg_kobold.mid', '../../assets/midi_data/grieg/grieg_march.mid', '../../assets/midi_data/grieg/grieg_once_upon_a_time.mid', '../../assets/midi_data/grieg/grieg_spring.mid', '../../assets/midi_data/grieg/grieg_voeglein.mid', '../../assets/midi_data/grieg/grieg_waechter.mid', '../../assets/midi_data/grieg/grieg_walzer.mid', '../../assets/midi_data/grieg/grieg_wanderer.mid', '../../assets/midi_data/grieg/grieg_wedding.mid', '../../assets/midi_data/grieg/grieg_zwerge.mid', '../../assets/midi_data/haydn/hay_40_1.mid', '../../assets/midi_data/haydn/hay_40_2.mid', '../../assets/midi_data/haydn/haydn_33_1.mid', '../../assets/midi_data/haydn/haydn_33_2.mid', '../../assets/midi_data/haydn/haydn_33_3.mid', '../../assets/midi_data/haydn/haydn_35_1.mid', '../../assets/midi_data/haydn/haydn_35_2.mid', '../../assets/midi_data/haydn/haydn_35_3.mid', '../../assets/midi_data/haydn/haydn_43_1.mid', '../../assets/midi_data/haydn/haydn_43_2.mid', '../../assets/midi_data/haydn/haydn_43_3.mid', '../../assets/midi_data/haydn/haydn_7_1.mid', '../../assets/midi_data/haydn/haydn_7_2.mid', '../../assets/midi_data/haydn/haydn_7_3.mid', '../../assets/midi_data/haydn/haydn_8_1.mid', '../../assets/midi_data/haydn/haydn_8_2.mid', '../../assets/midi_data/haydn/haydn_8_3.mid', '../../assets/midi_data/haydn/haydn_8_4.mid', '../../assets/midi_data/haydn/haydn_9_1.mid', '../../assets/midi_data/haydn/haydn_9_2.mid', '../../assets/midi_data/haydn/haydn_9_3.mid', '../../assets/midi_data/liszt/liz_donjuan.mid', '../../assets/midi_data/liszt/liz_et1.mid', '../../assets/midi_data/liszt/liz_et2.mid', '../../assets/midi_data/liszt/liz_et3.mid', '../../assets/midi_data/liszt/liz_et4.mid', '../../assets/midi_data/liszt/liz_et5.mid', '../../assets/midi_data/liszt/liz_et6.mid', '../../assets/midi_data/liszt/liz_et_trans4.mid', '../../assets/midi_data/liszt/liz_et_trans5.mid', '../../assets/midi_data/liszt/liz_et_trans8.mid', '../../assets/midi_data/liszt/liz_liebestraum.mid', '../../assets/midi_data/liszt/liz_rhap02.mid', '../../assets/midi_data/liszt/liz_rhap09.mid', '../../assets/midi_data/liszt/liz_rhap10.mid', '../../assets/midi_data/liszt/liz_rhap12.mid', '../../assets/midi_data/liszt/liz_rhap15.mid', '../../assets/midi_data/mendelssohn/mendel_op19_1.mid', '../../assets/midi_data/mendelssohn/mendel_op19_2.mid', '../../assets/midi_data/mendelssohn/mendel_op19_3.mid', '../../assets/midi_data/mendelssohn/mendel_op19_4.mid', '../../assets/midi_data/mendelssohn/mendel_op19_5.mid', '../../assets/midi_data/mendelssohn/mendel_op19_6.mid', '../../assets/midi_data/mendelssohn/mendel_op30_1.mid', '../../assets/midi_data/mendelssohn/mendel_op30_2.mid', '../../assets/midi_data/mendelssohn/mendel_op30_3.mid', '../../assets/midi_data/mendelssohn/mendel_op30_4.mid', '../../assets/midi_data/mendelssohn/mendel_op30_5.mid', '../../assets/midi_data/mendelssohn/mendel_op53_5.mid', '../../assets/midi_data/mendelssohn/mendel_op62_3.mid', '../../assets/midi_data/mendelssohn/mendel_op62_4.mid', '../../assets/midi_data/mendelssohn/mendel_op62_5.mid', '../../assets/midi_data/mozart/mz_311_1.mid', '../../assets/midi_data/mozart/mz_311_2.mid', '../../assets/midi_data/mozart/mz_311_3.mid', '../../assets/midi_data/mozart/mz_330_1.mid', '../../assets/midi_data/mozart/mz_330_2.mid', '../../assets/midi_data/mozart/mz_330_3.mid', '../../assets/midi_data/mozart/mz_331_1.mid', '../../assets/midi_data/mozart/mz_331_2.mid', '../../assets/midi_data/mozart/mz_331_3.mid', '../../assets/midi_data/mozart/mz_332_1.mid', '../../assets/midi_data/mozart/mz_332_2.mid', '../../assets/midi_data/mozart/mz_332_3.mid', '../../assets/midi_data/mozart/mz_333_1.mid', '../../assets/midi_data/mozart/mz_333_2.mid', '../../assets/midi_data/mozart/mz_333_3.mid', '../../assets/midi_data/mozart/mz_545_1.mid', '../../assets/midi_data/mozart/mz_545_2.mid', '../../assets/midi_data/mozart/mz_545_3.mid', '../../assets/midi_data/mozart/mz_570_1.mid', '../../assets/midi_data/mozart/mz_570_2.mid', '../../assets/midi_data/mozart/mz_570_3.mid', '../../assets/midi_data/muss/muss_1.mid', '../../assets/midi_data/muss/muss_2.mid', '../../assets/midi_data/muss/muss_3.mid', '../../assets/midi_data/muss/muss_4.mid', '../../assets/midi_data/muss/muss_5.mid', '../../assets/midi_data/muss/muss_6.mid', '../../assets/midi_data/muss/muss_7.mid', '../../assets/midi_data/muss/muss_8.mid', '../../assets/midi_data/schubert/schu_143_1.mid', '../../assets/midi_data/schubert/schu_143_2.mid', '../../assets/midi_data/schubert/schu_143_3.mid', '../../assets/midi_data/schubert/schub_d760_1.mid', '../../assets/midi_data/schubert/schub_d760_2.mid', '../../assets/midi_data/schubert/schub_d760_3.mid', '../../assets/midi_data/schubert/schub_d760_4.mid', '../../assets/midi_data/schubert/schub_d960_1.mid', '../../assets/midi_data/schubert/schub_d960_2.mid', '../../assets/midi_data/schubert/schub_d960_3.mid', '../../assets/midi_data/schubert/schub_d960_4.mid', '../../assets/midi_data/schubert/schubert_D850_1.mid', '../../assets/midi_data/schubert/schubert_D850_2.mid', '../../assets/midi_data/schubert/schubert_D850_3.mid', '../../assets/midi_data/schubert/schubert_D850_4.mid', '../../assets/midi_data/schubert/schubert_D935_1.mid', '../../assets/midi_data/schubert/schubert_D935_2.mid', '../../assets/midi_data/schubert/schubert_D935_3.mid', '../../assets/midi_data/schubert/schubert_D935_4.mid', '../../assets/midi_data/schubert/schuim-1.mid', '../../assets/midi_data/schubert/schuim-2.mid', '../../assets/midi_data/schubert/schuim-3.mid', '../../assets/midi_data/schubert/schuim-4.mid', '../../assets/midi_data/schubert/schumm-1.mid', '../../assets/midi_data/schubert/schumm-2.mid', '../../assets/midi_data/schubert/schumm-3.mid', '../../assets/midi_data/schubert/schumm-4.mid', '../../assets/midi_data/schubert/schumm-5.mid', '../../assets/midi_data/schubert/schumm-6.mid', '../../assets/midi_data/schumann/schum_abegg.mid', '../../assets/midi_data/schumann/scn15_10.mid', '../../assets/midi_data/schumann/scn15_11.mid', '../../assets/midi_data/schumann/scn15_12.mid', '../../assets/midi_data/schumann/scn15_13.mid', '../../assets/midi_data/schumann/scn15_1.mid', '../../assets/midi_data/schumann/scn15_2.mid', '../../assets/midi_data/schumann/scn15_3.mid', '../../assets/midi_data/schumann/scn15_4.mid', '../../assets/midi_data/schumann/scn15_5.mid', '../../assets/midi_data/schumann/scn15_6.mid', '../../assets/midi_data/schumann/scn15_7.mid', '../../assets/midi_data/schumann/scn15_8.mid', '../../assets/midi_data/schumann/scn15_9.mid', '../../assets/midi_data/schumann/scn16_1.mid', '../../assets/midi_data/schumann/scn16_2.mid', '../../assets/midi_data/schumann/scn16_3.mid', '../../assets/midi_data/schumann/scn16_4.mid', '../../assets/midi_data/schumann/scn16_5.mid', '../../assets/midi_data/schumann/scn16_6.mid', '../../assets/midi_data/schumann/scn16_7.mid', '../../assets/midi_data/schumann/scn16_8.mid', '../../assets/midi_data/schumann/scn68_10.mid', '../../assets/midi_data/schumann/scn68_12.mid', '../../assets/midi_data/tschai/ty_april.mid', '../../assets/midi_data/tschai/ty_august.mid', '../../assets/midi_data/tschai/ty_dezember.mid', '../../assets/midi_data/tschai/ty_februar.mid', '../../assets/midi_data/tschai/ty_januar.mid', '../../assets/midi_data/tschai/ty_juli.mid', '../../assets/midi_data/tschai/ty_juni.mid', '../../assets/midi_data/tschai/ty_maerz.mid', '../../assets/midi_data/tschai/ty_mai.mid', '../../assets/midi_data/tschai/ty_november.mid', '../../assets/midi_data/tschai/ty_oktober.mid', '../../assets/midi_data/tschai/ty_september.mid', ];
    
      if (typeof(MIDI) === "undefined") var MIDI = {};
      if (typeof(MIDI.Soundfont) === "undefined") MIDI.Soundfont = {};
      
      `;
    this.renderer2.appendChild(this._document.body, script);
  }


}

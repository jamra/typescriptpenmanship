/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var signature_1 = __webpack_require__(1);
	var canvas;
	var sign;
	window.onload = function () {
	    canvas = document.getElementById('canvas');
	    sign = new signature_1.Signature(canvas);
	};
	var genImage = function () {
	    var dataURL = canvas.toDataURL();
	    // var img : HTMLImageElement = <HTMLImageElement>document.getElementById("snapshot");
	    // img.style.border = "2px solid";
	    // img.src = dataURL;
	    // img.setAttribute("style", "display: none;");
	};
	window['genImage'] = genImage;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var point_1 = __webpack_require__(2);
	var Signature = (function () {
	    function Signature(canvas, _a) {
	        var _b = (_a === void 0 ? {} : _a).bgColor, bgColor = _b === void 0 ? "#EEE" : _b;
	        var _this = this;
	        this.canvas = canvas;
	        this.points = new Array();
	        this._isDrawing = false;
	        this.getCurr = function () { return _this.points[_this.points.length - 1]; };
	        this.getPrev = function () { return _this.points[_this.points.length - 2]; };
	        this.getFirst = function () { return _this.points[0]; };
	        this.ctx = canvas.getContext("2d");
	        this.ctx.fillStyle = bgColor;
	        this.ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	        canvas.addEventListener("mousemove", function (e) { return _this.move(e.clientX, e.clientY, e.timeStamp); }, false);
	        canvas.addEventListener("touchmove", function (e) {
	            var touch = e.touches.item(0);
	            _this.move(touch.clientX, touch.clientY, e.timeStamp);
	        }, false);
	        canvas.addEventListener("mousedown", function (e) { return _this.start(e.clientX, e.clientY, e.timeStamp); }, false);
	        canvas.addEventListener("touchdown", function (e) {
	            var touch = e.touches.item(0);
	            _this.move(touch.clientX, touch.clientY, e.timeStamp);
	        }, false);
	        var leave = function (e) { return _this.stop(); };
	        canvas.addEventListener("mouseup", leave, false);
	        canvas.addEventListener("mouseout", leave, false);
	        canvas.addEventListener("touchend", leave, false);
	    }
	    Signature.prototype.start = function (x, y, timeStamp) {
	        var curr = new point_1.Point(x - this.canvas.offsetLeft, y - this.canvas.offsetTop, timeStamp, 0);
	        this.points.push(curr);
	        this._isDrawing = true;
	    };
	    Signature.prototype.stop = function () {
	        this._isDrawing = false;
	        this.points = new Array();
	    };
	    Signature.prototype.move = function (x, y, timeStamp) {
	        if (this._isDrawing) {
	            var curr = new point_1.Point(x - this.canvas.offsetLeft, y - this.canvas.offsetTop, timeStamp, 0);
	            this.points.push(curr);
	            if (this.points.length > 2) {
	                //Optimization borrowed from https://github.com/szimek/signature_pad/blob/master/signature_pad.js
	                if (this.points.length === 3) {
	                    this.points.unshift(this.getFirst());
	                }
	                var vel = Math.abs(curr.velocityFrom(this.getPrev()));
	                var strokeWidth = Math.max(5.0 / (vel + 1), 2);
	                this.draw(strokeWidth);
	                this.points.shift();
	            }
	        }
	    };
	    Signature.prototype.draw = function (strokeWidth) {
	        //TODO: Use cubic bezier for smoothe curves
	        var ctx = this.ctx;
	        var points = this.points;
	        ctx.beginPath();
	        ctx.moveTo(points[2].x, points[2].y);
	        ctx.lineTo(points[3].x, points[3].y);
	        ctx.strokeStyle = "#333";
	        ctx.lineWidth = strokeWidth;
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Signature.prototype.getImageUrl = function () {
	        return this.canvas.toDataURL();
	    };
	    return Signature;
	}());
	exports.Signature = Signature;
	;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var VELOCITY_FILTER_WEIGHT = 0.7;
	var Point = (function () {
	    function Point(x, y, timeStamp, v) {
	        this.x = x;
	        this.y = y;
	        this.timeStamp = timeStamp;
	        this.v = v;
	    }
	    Point.prototype.distanceFrom = function (p2) {
	        return Math.sqrt((this.x - p2.x) * (this.x - p2.x) + (this.y - p2.y) * (this.y - p2.y));
	    };
	    Point.prototype.velocityFrom = function (last) {
	        this.v = this.distanceFrom(last) / (this.timeStamp - last.timeStamp);
	        this.v = VELOCITY_FILTER_WEIGHT * this.v + (1 - VELOCITY_FILTER_WEIGHT) * last.v;
	        return this.v;
	    };
	    ;
	    return Point;
	}());
	exports.Point = Point;
	;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
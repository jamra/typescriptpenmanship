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
	var bezier_1 = __webpack_require__(3);
	var Signature = (function () {
	    function Signature(canvas, _a) {
	        var _b = _a === void 0 ? {} : _a, _c = _b.bgColor, bgColor = _c === void 0 ? "#EEE" : _c, _d = _b.strokeColor, strokeColor = _d === void 0 ? "#333" : _d;
	        var _this = this;
	        this.canvas = canvas;
	        this.points = new Array();
	        this._isDrawing = false;
	        this.getCurr = function () { return _this.points[_this.points.length - 1]; };
	        this.getPrev = function () { return _this.points[_this.points.length - 2]; };
	        this.getFirst = function () { return _this.points[0]; };
	        this.getImageUrl = function () { return _this.canvas.toDataURL(); };
	        this.ctx = canvas.getContext("2d");
	        this.ctx.fillStyle = bgColor;
	        this.ctx.strokeStyle = strokeColor;
	        this.ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	        canvas.addEventListener("mousemove", function (e) { return _this.move(e.clientX, e.clientY, e.timeStamp); }, false);
	        canvas.addEventListener("touchmove", function (e) {
	            var touch = e.changedTouches[0];
	            e.preventDefault();
	            _this.move(touch.clientX, touch.clientY, e.timeStamp);
	        }, false);
	        canvas.addEventListener("mousedown", function (e) { return _this.start(e.clientX, e.clientY, e.timeStamp); }, false);
	        canvas.addEventListener("touchstart", function (e) {
	            var touch = e.changedTouches[0];
	            e.preventDefault();
	            _this.start(touch.clientX, touch.clientY, e.timeStamp);
	        }, false);
	        var leave = function (e) { return _this.stop(); };
	        canvas.addEventListener("mouseup", leave, false);
	        canvas.addEventListener("mouseout", leave, false);
	        canvas.addEventListener("touchend", leave, false);
	    }
	    Signature.prototype.start = function (x, y, timeStamp) {
	        var curr = new point_1.Point(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
	        this.points.push(curr);
	        this._isDrawing = true;
	        this._lastTimeStamp = timeStamp;
	        this._lastVelocity = 0;
	    };
	    Signature.prototype.stop = function () {
	        this._isDrawing = false;
	        this.points = new Array();
	    };
	    Signature.prototype.move = function (x, y, timeStamp) {
	        if (this._isDrawing) {
	            var curr = new point_1.Point(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
	            this.points.push(curr);
	            if (this.points.length > 2) {
	                //Optimization borrowed from https://github.com/szimek/signature_pad/blob/master/signature_pad.js
	                if (this.points.length === 3) {
	                    this.points.unshift(this.points[0]);
	                }
	                var first = bezier_1.Bezier.CalculateControlPoints(this.points[0], this.points[1], this.points[2]);
	                var second = bezier_1.Bezier.CalculateControlPoints(this.points[1], this.points[2], this.points[3]);
	                var bezier = new bezier_1.Bezier(this.points[0], first.c2, second.c1, this.points[2]);
	                var vel = curr.velocityFrom(bezier.p1, timeStamp, this._lastTimeStamp, this._lastVelocity);
	                var strokeWidth = Math.max(4.0 / (vel + 1), 1.0);
	                this.draw(strokeWidth, bezier);
	                this._lastWidth = strokeWidth;
	                this._lastVelocity = vel;
	                this._lastTimeStamp = timeStamp;
	                this.points.shift();
	            }
	        }
	    };
	    Signature.prototype.draw = function (strokeWidth, bezier) {
	        var ctx = this.ctx;
	        var points = this.points;
	        var widthDelta = Math.max(Math.sqrt(strokeWidth - this._lastWidth), 0);
	        var width, i, t, tt, ttt, u, uu, uuu, x, y;
	        var drawSteps = Math.floor(bezier.length());
	        ctx.beginPath();
	        for (var i_1 = 0; i_1 < drawSteps; i_1++) {
	            t = i_1 / drawSteps;
	            tt = t * t;
	            ttt = tt * t;
	            u = 1 - t;
	            uu = u * u;
	            uuu = uu * u;
	            x = uuu * bezier.p1.x;
	            x += 3 * uu * t * bezier.c1.x;
	            x += 3 * u * tt * bezier.c2.x;
	            x += ttt * bezier.p2.x;
	            y = uuu * bezier.p1.y;
	            y += 3 * uu * t * bezier.c1.y;
	            y += 3 * u * tt * bezier.c2.y;
	            y += ttt * bezier.p2.y;
	            width = this._lastWidth + ttt * widthDelta;
	            this.drawPoint(x, y, width);
	        }
	        // ctx.moveTo(points[2].x, points[2].y);
	        // ctx.lineTo(points[3].x, points[3].y);
	        // ctx.lineWidth = strokeWidth;
	        // ctx.stroke();
	        ctx.closePath();
	    };
	    Signature.prototype.drawPoint = function (x, y, size) {
	        //this.ctx.lineWidth = size;
	        this.ctx.strokeStyle = "#222";
	        this.ctx.moveTo(x, y);
	        this.ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	        this.ctx.stroke();
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
	    function Point(x, y) {
	        var _this = this;
	        this.x = x;
	        this.y = y;
	        this.toString = function () {
	            return "x: " + _this.x + ", y: " + _this.y;
	        };
	    }
	    Point.prototype.distanceFrom = function (p2) {
	        var dx = this.x - p2.x;
	        var dy = this.y - p2.y;
	        return Math.sqrt(dx * dx + dy * dy);
	    };
	    ;
	    Point.prototype.velocityFrom = function (last, endTime, startTime, lastVel) {
	        var v = this.distanceFrom(last) / (endTime - startTime);
	        v = VELOCITY_FILTER_WEIGHT * v + (1 - VELOCITY_FILTER_WEIGHT) * lastVel;
	        return Math.abs(v);
	    };
	    ;
	    return Point;
	}());
	exports.Point = Point;
	;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var point_1 = __webpack_require__(2);
	var Bezier = (function () {
	    function Bezier(p1, c1, c2, p2) {
	        this.p1 = p1;
	        this.c1 = c1;
	        this.c2 = c2;
	        this.p2 = p2;
	    }
	    Bezier.prototype.length = function () {
	        var steps = 10, len = 0, t, cx, cy, px, py, dx, dy;
	        for (var i = 0; i <= steps; i++) {
	            t = i / steps;
	            cx = Bezier.PointAt(t, this.p1.x, this.c1.x, this.c2.x, this.p2.x);
	            cy = Bezier.PointAt(t, this.p1.y, this.c1.y, this.c2.y, this.p2.y);
	            if (i > 0) {
	                dx = cx - px;
	                dy = cy - py;
	                len += Math.sqrt(dx * dx + dy * dy);
	            }
	            px = cx;
	            py = cy;
	        }
	        return len;
	    };
	    Bezier.PointAt = function (t, start, c1, c2, end) {
	        var rT = 1.0 - t;
	        var t2 = t * t;
	        return (start * rT * rT * rT) + (3.0 * c1 * rT * rT * t) + (3.0 * c2 * rT * t2) + end * t2 * t;
	    };
	    Bezier.CalculateControlPoints = function (s1, s2, s3) {
	        var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y, dx2 = s2.x - s3.x, dy2 = s2.y - s3.y, m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 }, m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 }, l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1), l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2), dxm = (m1.x - m2.x), dym = (m1.y - m2.y), k = l2 / (l1 + l2) || 0, cm = { x: m2.x + dxm * k, y: m2.y + dym * k }, tx = s2.x - cm.x, ty = s2.y - cm.y;
	        return {
	            c1: new point_1.Point(m1.x + tx, m1.y + ty),
	            c2: new point_1.Point(m2.x + tx, m2.y + ty)
	        };
	    };
	    ;
	    return Bezier;
	}());
	exports.Bezier = Bezier;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
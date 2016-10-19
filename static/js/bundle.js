/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var canvas;
	var ctx;
	var prevX = 0, currX = 0, prevY = 0, currY = 0, flag = false;
	window.onload = function () {
	    canvas = document.getElementById('canvas');
	    ctx = canvas.getContext("2d");
	    ctx.fillStyle = "#EEE";
	    ctx.fillRect(0, 0, 1280, 720);
	    canvas.addEventListener("mousemove", function (e) {
	        findxy('move', e);
	    }, false);
	    canvas.addEventListener("mousedown", function (e) {
	        findxy('down', e);
	    }, false);
	    canvas.addEventListener("mouseup", function (e) {
	        findxy('up', e);
	    }, false);
	    canvas.addEventListener("mouseout", function (e) {
	        findxy('out', e);
	    }, false);
	};
	var findxy = function (res, e) {
	    if (res == 'down') {
	        prevX = currX;
	        prevY = currY;
	        currX = e.clientX - canvas.offsetLeft;
	        currY = e.clientY - canvas.offsetTop;
	        flag = true;
	    }
	    if (res == 'up' || res == "out") {
	        flag = false;
	    }
	    if (res == 'move') {
	        if (flag) {
	            //TODO: Add acceleration
	            //Perhaps use e.timestamp to measure the change between the delta of the timestamps
	            prevX = currX;
	            prevY = currY;
	            currX = e.clientX - canvas.offsetLeft;
	            currY = e.clientY - canvas.offsetTop;
	            draw(2);
	        }
	    }
	};
	var draw = function (stroke) {
	    //TODO: investigate changing lineTo into arcTo/bezierTo in the case that I want less choppy lines
	    //alternative: use the 2nd previous position to position the arc/bezier
	    ctx.beginPath();
	    ctx.moveTo(prevX, prevY);
	    ctx.lineTo(currX, currY);
	    ctx.strokeStyle = "#333";
	    ctx.lineWidth = stroke;
	    ctx.stroke();
	    ctx.closePath();
	};
	var genImage = function () {
	    var dataURL = canvas.toDataURL();
	    var img = document.getElementById("snapshot");
	    img.style.border = "2px solid";
	    img["src"] = dataURL;
	    img.setAttribute("style", "display: none;");
	    console.log(dataURL);
	};
	window['genImage'] = genImage;


/***/ }
/******/ ]);
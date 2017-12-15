/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js??ref--0-2!./main.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js??ref--0-2!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n  display: block; }\n\nbody {\n  line-height: 1; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after {\n  content: '';\n  content: none; }\n\nq:before, q:after {\n  content: '';\n  content: none; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.grid {\n  display: flex;\n  width: 100%; }\n  .grid > * {\n    width: 100%;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .grid > *.pull-right {\n      margin-left: auto; }\n\n.uppercase {\n  text-transform: uppercase; }\n\n.bold {\n  font-weight: bold; }\n\nbody {\n  margin: 0;\n  padding: 0;\n  background-color: black;\n  color: #7d8d9a;\n  font-family: 'Roboto', sans-serif;\n  font-size: 16px; }\n\n.container {\n  width: 1366px;\n  min-width: 1366px;\n  margin: 0 auto; }\n\n.text-blue {\n  color: #3594e6; }\n\na {\n  color: #7d8d9a; }\n  a:hover {\n    color: #3594e6; }\n\n.clear {\n  clear: both; }\n\n.page-header {\n  background-color: #171e2e;\n  min-width: 1366px;\n  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);\n  position: relative;\n  z-index: 100; }\n  .page-header .grid {\n    width: 100%;\n    align-items: center; }\n    .page-header .grid .pull-right {\n      margin-left: auto;\n      width: auto;\n      flex-grow: 1;\n      flex-shrink: 0;\n      display: flex;\n      align-items: center; }\n    .page-header .grid .logo {\n      display: inline-block;\n      padding: 19px 11px 12px;\n      width: auto;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box;\n      flex-shrink: 0;\n      flex-grow: 0; }\n    .page-header .grid .header-links {\n      display: flex;\n      align-items: center; }\n      .page-header .grid .header-links li {\n        margin-left: 30px; }\n        .page-header .grid .header-links li:first-child {\n          margin-left: 33px; }\n        .page-header .grid .header-links li a {\n          color: #7d8d9a; }\n          .page-header .grid .header-links li a.active {\n            color: #3594e6;\n            text-shadow: 0 0 19px #3594e6; }\n    .page-header .grid .wallet {\n      padding: 7px;\n      font-size: 12px;\n      background-color: #242c3e;\n      border-radius: 25px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .page-header .grid .wallet span, .page-header .grid .wallet a {\n        display: inline-block;\n        padding: 7px 10px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none; }\n      .page-header .grid .wallet .refill {\n        background-color: #3594e6;\n        color: #171e2e;\n        border-radius: 25px;\n        text-decoration: none;\n        transition: 0.1s background; }\n        .page-header .grid .wallet .refill:hover {\n          background-color: #1a7bce; }\n\n.page-content {\n  padding-top: 29px;\n  padding-bottom: 29px;\n  background-color: #171e2e;\n  position: relative;\n  z-index: 99;\n  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .page-content .page-content-container {\n    width: 100%;\n    padding: 0 20px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .page-content .page-content-container .content-block {\n      box-shadow: 0 3px 24px rgba(0, 0, 0, 0.3);\n      background-color: #1e2537;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n  .page-content .content-page-header {\n    text-align: center;\n    font-size: 20px;\n    text-transform: uppercase;\n    text-shadow: 0 1px 1px black; }\n\n.form {\n  display: block;\n  width: 100%; }\n  .form.form-compact {\n    width: 450px;\n    margin: 0 auto; }\n  .form .form-group {\n    display: flex;\n    align-items: center;\n    width: 100%;\n    margin-top: 20px; }\n    .form .form-group.reverse {\n      flex-direction: row-reverse;\n      align-items: flex-start; }\n      .form .form-group.reverse label {\n        padding-right: 0 !important;\n        width: 19px !important; }\n        .form .form-group.reverse label .checkbox-placeholder {\n          margin-right: 0 !important; }\n    .form .form-group.inline label.checkbox-wrapper {\n      width: 30px;\n      flex-grow: 0;\n      flex-shrink: 0; }\n    .form .form-group.inline div {\n      font-size: 14px;\n      line-height: 17.5px;\n      margin-right: 7.5px; }\n    .form .form-group.content-center {\n      justify-content: center; }\n    .form .form-group:first-of-type {\n      margin-top: 0; }\n    .form .form-group label:not(.checkbox-wrapper), .form .form-group label:not(.radio-wrapper), .form .form-group input, .form .form-group select {\n      flex-shrink: 0;\n      flex-grow: 0; }\n    .form .form-group label:not(.checkbox-wrapper), .form .form-group label:not(.radio-wrapper) {\n      width: 50%;\n      text-align: right;\n      padding-right: 15px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n    .form .form-group input, .form .form-group select {\n      width: 50%;\n      padding: 10px;\n      color: white;\n      background-color: #242c3e;\n      border: none;\n      outline: none;\n      border-radius: 3px;\n      box-shadow: 0 3px 16px rgba(0, 0, 0, 0.17);\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n  .form input[type=\"button\"], .form input[type=\"submit\"] {\n    border: none;\n    border-radius: 5px;\n    padding: 11.25px;\n    padding-left: 15px;\n    padding-right: 15px;\n    background: #3594e6;\n    width: auto;\n    font-size: 14px;\n    text-transform: uppercase;\n    color: #171e2e;\n    outline: none;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .form .checkbox-wrapper {\n    width: auto; }\n    .form .checkbox-wrapper input[type=\"checkbox\"] {\n      display: none; }\n      .form .checkbox-wrapper input[type=\"checkbox\"]:checked + .checkbox-placeholder {\n        background-color: #3594e6; }\n    .form .checkbox-wrapper .checkbox-placeholder {\n      width: 15px;\n      height: 15px;\n      background-color: #34405a;\n      border: 2px solid #242c3e; }\n\n.button {\n  border: none;\n  border-radius: 5px;\n  padding: 11.25px;\n  padding-left: 15px;\n  padding-right: 15px;\n  background: #3594e6;\n  width: auto;\n  font-size: 14px;\n  text-transform: uppercase;\n  color: #171e2e;\n  outline: none;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n.home-page {\n  padding: 0; }\n  .home-page .page-content-container {\n    padding: 0; }\n    .home-page .page-content-container .section.section-header {\n      position: relative; }\n      .home-page .page-content-container .section.section-header .background-image {\n        width: 100%;\n        height: 250px;\n        background-position: center;\n        background-size: cover; }\n      .home-page .page-content-container .section.section-header .exchange-rates {\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        overflow-x: hidden;\n        display: flex;\n        padding: 15px;\n        background-color: rgba(0, 0, 0, 0.4);\n        color: white;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n        .home-page .page-content-container .section.section-header .exchange-rates .rate {\n          display: flex;\n          align-items: center;\n          margin-right: 30px;\n          font-size: 12px; }\n          .home-page .page-content-container .section.section-header .exchange-rates .rate:last-of-type {\n            margin-right: 0; }\n          .home-page .page-content-container .section.section-header .exchange-rates .rate .direction {\n            width: 15px;\n            height: 15px;\n            position: relative; }\n            .home-page .page-content-container .section.section-header .exchange-rates .rate .direction.direction-up:before {\n              content: \"\";\n              width: 0;\n              height: 0;\n              border-style: solid;\n              border-width: 0 5px 10px 5px;\n              border-color: transparent transparent #27ae60 transparent;\n              position: absolute;\n              top: 2px;\n              left: 0; }\n            .home-page .page-content-container .section.section-header .exchange-rates .rate .direction.direction-down::before {\n              content: \"\";\n              width: 0;\n              height: 0;\n              border-style: solid;\n              border-width: 10px 5px 0 5px;\n              border-color: #e74c3c transparent transparent transparent;\n              position: absolute;\n              top: 2px;\n              left: 0; }\n          .home-page .page-content-container .section.section-header .exchange-rates .rate .pair {\n            margin-right: 7.5px; }\n          .home-page .page-content-container .section.section-header .exchange-rates .rate .exchange-rate.rate-green {\n            color: #27ae60; }\n    .home-page .page-content-container .section.section-about-us {\n      padding-top: 15px; }\n      .home-page .page-content-container .section.section-about-us .section-content {\n        margin-top: 15px; }\n      .home-page .page-content-container .section.section-about-us .about-us-grid {\n        flex-wrap: wrap;\n        width: 900px;\n        margin: 0 auto; }\n        .home-page .page-content-container .section.section-about-us .about-us-grid > .col {\n          width: 50%;\n          flex-shrink: 0;\n          flex-grow: 0;\n          margin-top: 15px;\n          margin-bottom: 30px; }\n          .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle {\n            flex-shrink: 0;\n            flex-grow: 0;\n            width: 120px;\n            height: 120px;\n            margin-right: 15px; }\n            .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle {\n              width: 120px;\n              height: 120px;\n              display: block;\n              border-radius: 120px;\n              position: relative; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle.circle-green {\n                background-color: #3bc97e; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle.circle-red {\n                background-color: #c6315e; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle.circle-yellow {\n                background-color: #fec722; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle.circle-blue {\n                background-color: #2a71cd; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle::before {\n                content: \"\";\n                position: absolute;\n                width: 100px;\n                height: 100px;\n                background-color: #171e2e;\n                border-radius: 100px;\n                left: 10px;\n                top: 10px; }\n              .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-circle .circle::after {\n                content: \"100\";\n                position: absolute;\n                top: 10px;\n                left: 10px;\n                text-align: center;\n                width: 100px;\n                height: 50px;\n                padding-top: 30px;\n                line-height: 40px;\n                font-size: 32px;\n                color: white; }\n          .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-about-us-item .about-us-item-title {\n            font-size: 18px;\n            text-transform: uppercase;\n            color: white;\n            font-weight: bold;\n            margin-bottom: 15px; }\n          .home-page .page-content-container .section.section-about-us .about-us-grid > .col .col-about-us-item .about-us-item-content {\n            font-size: 16px;\n            line-height: 20px; }\n    .home-page .page-content-container .section.section-registration {\n      padding-top: 75px;\n      padding-bottom: 45px;\n      margin-bottom: 45px;\n      background-image: url(\"/assets/images/home_registration_background.png\");\n      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .home-page .page-content-container .section.section-registration .form {\n        display: flex;\n        flex-wrap: wrap;\n        width: 1000px;\n        margin: 0 auto; }\n        .home-page .page-content-container .section.section-registration .form .form-group {\n          width: 33.333%;\n          margin-top: 0;\n          margin-bottom: 20px; }\n          .home-page .page-content-container .section.section-registration .form .form-group.full-width {\n            width: 100%; }\n    .home-page .page-content-container .section.section-possible-trades {\n      padding-bottom: 60px; }\n      .home-page .page-content-container .section.section-possible-trades .grid {\n        width: 1000px;\n        margin: 0 auto; }\n        .home-page .page-content-container .section.section-possible-trades .grid .col {\n          margin-left: 15px;\n          margin-right: 15px; }\n          .home-page .page-content-container .section.section-possible-trades .grid .col .circle-image {\n            text-align: center;\n            width: 140px;\n            height: 140px;\n            border-radius: 100px;\n            overflow: hidden;\n            margin: auto;\n            border: 6px solid transparent;\n            background-size: cover; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .circle-image.circle-red {\n              border-color: #c6315e; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .circle-image.circle-yellow {\n              border-color: #fec722; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .circle-image.circle-blue {\n              border-color: #2a71cd; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .circle-image.circle-green {\n              border-color: #3bc97e; }\n          .home-page .page-content-container .section.section-possible-trades .grid .col .description-title {\n            font-size: 20px;\n            color: white;\n            font-weight: bold;\n            text-align: center;\n            text-transform: uppercase;\n            margin-top: 15px;\n            margin-bottom: 30px;\n            position: relative; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .description-title::after {\n              content: \"\";\n              width: 100px;\n              height: 4px;\n              background-color: red;\n              position: absolute;\n              bottom: -15px;\n              left: 50%;\n              margin-left: -50px; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .description-title.line-blue::after {\n              background-color: #2a71cd; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .description-title.line-red::after {\n              background-color: #c6315e; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .description-title.line-yellow::after {\n              background-color: #fec722; }\n            .home-page .page-content-container .section.section-possible-trades .grid .col .description-title.line-green::after {\n              background-color: #3bc97e; }\n          .home-page .page-content-container .section.section-possible-trades .grid .col .description-content {\n            font-size: 14px;\n            line-height: 17.5px;\n            text-align: center; }\n    .home-page .page-content-container .section.section-incredible-trading-rules {\n      padding-top: 60px;\n      padding-bottom: 90px;\n      background-image: url(\"/assets/images/home_incredible_trading.png\");\n      background-size: cover;\n      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3); }\n      .home-page .page-content-container .section.section-incredible-trading-rules .section-title {\n        font-size: 36px;\n        font-weight: normal; }\n      .home-page .page-content-container .section.section-incredible-trading-rules .start-trading-link {\n        text-align: center;\n        margin-top: 75px; }\n        .home-page .page-content-container .section.section-incredible-trading-rules .start-trading-link a {\n          font-size: 24px;\n          text-decoration: none;\n          padding: 22.5px 30px;\n          color: white; }\n          .home-page .page-content-container .section.section-incredible-trading-rules .start-trading-link a:hover {\n            color: white; }\n    .home-page .page-content-container .section.section-contact-us .form {\n      display: flex;\n      flex-wrap: wrap;\n      width: 1000px;\n      margin: 0 auto; }\n      .home-page .page-content-container .section.section-contact-us .form .form-group {\n        width: 33.3333%;\n        margin-bottom: 20px;\n        margin-top: 0;\n        display: block;\n        padding-right: 15px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group.full-width {\n          width: 100%; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group.content-center {\n          text-align: center; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group label {\n          display: block;\n          text-align: left;\n          margin-bottom: 7.5px; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group input {\n          width: 100%; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group textarea {\n          width: 100%;\n          height: 250px;\n          background-color: #242c3e;\n          border: none;\n          font-size: 16px;\n          font-family: 'Roboto', sans-serif;\n          color: white;\n          padding: 10px;\n          resize: none;\n          outline: none;\n          -webkit-box-sizing: border-box;\n          -moz-box-sizing: border-box;\n          box-sizing: border-box; }\n        .home-page .page-content-container .section.section-contact-us .form .form-group input[type=\"submit\"] {\n          color: white;\n          font-size: 16px;\n          width: auto;\n          padding: 15px 22.5px; }\n    .home-page .page-content-container .section.section-footer {\n      padding: 15px;\n      background-color: #232b3d;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .home-page .page-content-container .section.section-footer p {\n        text-align: center;\n        font-size: 14px;\n        line-height: 17.5px; }\n      .home-page .page-content-container .section.section-footer a {\n        color: #3594e6;\n        text-decoration: none; }\n        .home-page .page-content-container .section.section-footer a:hover {\n          text-decoration: underline; }\n    .home-page .page-content-container .section .section-title {\n      font-size: 72px;\n      font-weight: bold;\n      color: white;\n      text-align: center;\n      width: 100%;\n      font-family: 'Impact', sans-serif;\n      margin-top: 15px;\n      margin-bottom: 15px; }\n\n.guide-page .guide-content {\n  margin-top: 22.5px; }\n  .guide-page .guide-content .guide-navigation {\n    width: 320px;\n    flex-shrink: 0;\n    flex-grow: 0;\n    margin-right: 30px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .guide-page .guide-content .guide-navigation .guide-navigation-wrapper {\n      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); }\n      .guide-page .guide-content .guide-navigation .guide-navigation-wrapper .guide-navigation-section {\n        margin-top: 5px;\n        margin-bottom: 5px;\n        padding: 11.25px 15px;\n        background-color: rgba(0, 0, 0, 0.2);\n        color: #3594e6;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n        .guide-page .guide-content .guide-navigation .guide-navigation-wrapper .guide-navigation-section:first-child {\n          margin-top: 0; }\n      .guide-page .guide-content .guide-navigation .guide-navigation-wrapper .guide-navigation-links li {\n        padding: 15px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n        .guide-page .guide-content .guide-navigation .guide-navigation-wrapper .guide-navigation-links li a {\n          color: #7d8d9a;\n          text-decoration: none; }\n  .guide-page .guide-content .guide-page-content .guide-page-content-wrapper {\n    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); }\n    .guide-page .guide-content .guide-page-content .guide-page-content-wrapper .guide-title {\n      margin-bottom: 5px;\n      padding: 15px;\n      background-color: rgba(0, 0, 0, 0.2);\n      color: #3594e6;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n    .guide-page .guide-content .guide-page-content .guide-page-content-wrapper .guide-text {\n      padding: 15px;\n      line-height: 18.75px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .guide-page .guide-content .guide-page-content .guide-page-content-wrapper .guide-text p {\n        margin-bottom: 15px; }\n        .guide-page .guide-content .guide-page-content .guide-page-content-wrapper .guide-text p:last-child {\n          margin-bottom: 0; }\n\n.registration-page .registration-content {\n  margin-top: 22.5px; }\n  .registration-page .registration-content form {\n    width: 840px;\n    margin: 0 auto; }\n  .registration-page .registration-content .registration-grid {\n    display: flex; }\n    .registration-page .registration-content .registration-grid .col {\n      width: 50%;\n      flex-shrink: 0;\n      flex-grow: 0; }\n      .registration-page .registration-content .registration-grid .col:first-child {\n        padding-right: 30px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n\n.trading-page .trading-terminal .graph-container {\n  width: 100%; }\n\n.trading-page .trading-terminal .exchanges-container {\n  width: 380px;\n  flex-shrink: 0;\n  flex-grow: 0;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .trading-page .trading-terminal .exchanges-container .exchanges-table-with-filters-container, .trading-page .trading-terminal .exchanges-container .place-a-bet {\n    background-color: #1e2537;\n    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4); }\n  .trading-page .trading-terminal .exchanges-container .exchanges-table-with-filters-container {\n    padding-top: 8px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .trading-page .trading-terminal .exchanges-container .exchange-filter {\n    justify-content: center;\n    margin-bottom: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .trading-page .trading-terminal .exchanges-container .exchange-filter a.button {\n      padding: 8px 12px;\n      margin-left: 7.5px;\n      text-decoration: none;\n      border-radius: 25px;\n      background-color: #141a27;\n      color: #7d8d9a; }\n      .trading-page .trading-terminal .exchanges-container .exchange-filter a.button:first-child {\n        margin-left: 0; }\n      .trading-page .trading-terminal .exchanges-container .exchange-filter a.button.button-small {\n        font-size: 12px; }\n      .trading-page .trading-terminal .exchanges-container .exchange-filter a.button.active {\n        background-color: #7d8d9a;\n        color: #171e2e; }\n  .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper {\n    max-height: 300px;\n    overflow-y: auto; }\n    .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table {\n      width: 100%; }\n      .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table thead tr th {\n        text-align: left;\n        text-transform: uppercase;\n        color: #3594e6;\n        font-size: 12px;\n        padding: 7.5px 15px; }\n      .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table tbody tr:nth-child(2n) td {\n        background-color: rgba(0, 0, 0, 0.2); }\n      .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table tbody tr td {\n        padding: 7.5px 15px;\n        font-size: 12px; }\n        .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table tbody tr td:last-of-type {\n          font-weight: bold; }\n        .trading-page .trading-terminal .exchanges-container .exchanges-table-wrapper .exchanges-table tbody tr td.time-ends {\n          color: #e74c3c; }\n  .trading-page .trading-terminal .exchanges-container .place-a-bet {\n    margin-top: 15px; }\n    .trading-page .trading-terminal .exchanges-container .place-a-bet .grid {\n      position: relative; }\n      .trading-page .trading-terminal .exchanges-container .place-a-bet .grid a {\n        padding: 22.5px 15px;\n        text-align: center;\n        text-decoration: none;\n        border-radius: 10px;\n        text-transform: uppercase;\n        color: #1e2537;\n        margin: 15px;\n        font-size: 20px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n        .trading-page .trading-terminal .exchanges-container .place-a-bet .grid a.sell {\n          background-color: #3bc97e;\n          margin-right: 3.75px; }\n        .trading-page .trading-terminal .exchanges-container .place-a-bet .grid a.buy {\n          background-color: #c6315e;\n          margin-left: 3.75px; }\n      .trading-page .trading-terminal .exchanges-container .place-a-bet .grid div {\n        position: absolute;\n        padding: 5px 7.5px;\n        border: 2px solid #1e2537;\n        border-radius: 8px;\n        background-color: #2a71cd;\n        color: #171e2e;\n        width: auto;\n        left: 50%;\n        top: 50%;\n        transform: translateX(-50%) translateY(-50%);\n        font-size: 12px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n    .trading-page .trading-terminal .exchanges-container .place-a-bet .place-a-bet-form > * {\n      margin: 0 15px 15px;\n      font-size: 12px; }\n      .trading-page .trading-terminal .exchanges-container .place-a-bet .place-a-bet-form > *:first-child {\n        margin-right: 3.75px; }\n      .trading-page .trading-terminal .exchanges-container .place-a-bet .place-a-bet-form > *:last-child {\n        margin-left: 3.75px; }\n    .trading-page .trading-terminal .exchanges-container .place-a-bet .place-a-bet-form .input-field {\n      outline: none;\n      border-radius: 3px;\n      border: 2px solid #999999;\n      text-align: right;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n    .trading-page .trading-terminal .exchanges-container .place-a-bet .place-a-bet-form .submit-button {\n      padding: 11.25px 5px;\n      border: none;\n      background: #3594e6;\n      text-transform: uppercase;\n      outline: none;\n      border-radius: 8px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n\n.trading-page .trading-additional-information {\n  margin-top: 30px; }\n  .trading-page .trading-additional-information .tabs.grid a {\n    text-align: center;\n    text-decoration: none;\n    background-color: #232b3d;\n    padding: 15px;\n    margin-right: 15px;\n    border-radius: 8px;\n    outline: none;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .trading-page .trading-additional-information .tabs.grid a:last-child {\n      margin-right: 0; }\n    .trading-page .trading-additional-information .tabs.grid a.active {\n      background-color: #7d8d9a;\n      color: #1f2739;\n      text-shadow: 0 0 15px #1f2739; }\n\n.graph-container .area {\n  fill: url(#linear-gradient);\n  clip-path: url(#clip); }\n\n.graph-container .zoom {\n  cursor: move;\n  fill: none;\n  pointer-events: all; }\n\n.graph-container .axis--x {\n  color: white; }\n\n.graph-container .axisWhite text {\n  fill: white; }\n\n.graph-container .axisWhite line, .graph-container .axisWhite path {\n  stroke: white; }\n", ""]);

// exports


/***/ })
/******/ ]);
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(3)(content, options);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n  display: block; }\n\nbody {\n  line-height: 1; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after {\n  content: '';\n  content: none; }\n\nq:before, q:after {\n  content: '';\n  content: none; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.grid {\n  display: flex;\n  width: 100%; }\n  .grid > * {\n    width: 100%;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .grid > *.pull-right {\n      margin-left: auto; }\n\n.uppercase {\n  text-transform: uppercase; }\n\n.bold {\n  font-weight: bold; }\n\nbody {\n  font-family: 'Roboto', sans-serif;\n  font-size: 14px; }\n\n.app-page-wrapper {\n  height: 100vh; }\n\na {\n  color: #44A4FF; }\n  a:hover {\n    color: #2b98ff; }\n\n.offset-bottom {\n  margin-bottom: 15px; }\n\n.offset-top {\n  margin-top: 15px; }\n\n.app-sidebar-wrapper {\n  width: 275px;\n  flex-grow: 0;\n  flex-shrink: 0;\n  box-shadow: 0 0 25px rgba(0, 0, 0, 0.07);\n  position: relative;\n  z-index: 200;\n  background-color: white;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .app-sidebar-wrapper .app-sidebar {\n    padding-top: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .app-sidebar-wrapper .app-sidebar a {\n      display: block;\n      padding: 15px 52px;\n      color: rgba(51, 51, 51, 0.7);\n      text-decoration: none;\n      font-size: 14px;\n      font-weight: 500;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .app-sidebar-wrapper .app-sidebar a:hover, .app-sidebar-wrapper .app-sidebar a.active {\n        background-color: rgba(0, 0, 0, 0.05); }\n      .app-sidebar-wrapper .app-sidebar a.active {\n        color: rgba(0, 0, 0, 0.7); }\n        .app-sidebar-wrapper .app-sidebar a.active[data-badge]::after {\n          background-color: rgba(0, 0, 0, 0.7); }\n      .app-sidebar-wrapper .app-sidebar a[data-icon], .app-sidebar-wrapper .app-sidebar a[data-badge] {\n        position: relative; }\n      .app-sidebar-wrapper .app-sidebar a[data-icon]::before {\n        position: absolute;\n        content: attr(data-icon);\n        font-size: 16px;\n        font-family: 'Material Icons', sans-serif;\n        top: 50%;\n        margin-top: -9px;\n        left: 18.75px; }\n      .app-sidebar-wrapper .app-sidebar a[data-badge]::after {\n        position: absolute;\n        content: attr(data-badge);\n        top: 50%;\n        margin-top: -11px;\n        right: 15px;\n        font-size: 10px;\n        padding: 7px 7px 5px 6px;\n        border-radius: 15px;\n        background-color: rgba(64, 64, 64, 0.7);\n        color: white;\n        display: block;\n        line-height: 10px;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box; }\n\n.app-content-wrapper {\n  background-color: rgba(0, 0, 0, 0.03);\n  position: relative;\n  z-index: 100;\n  overflow-y: scroll;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .app-content-wrapper .app-content {\n    padding: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .app-content-wrapper .app-content.no-paddings {\n      padding: 0; }\n\nh1, h2, h3, h4, h5, h6 {\n  line-height: 1.1;\n  font-weight: 500; }\n  h1 small, h2 small, h3 small, h4 small, h5 small, h6 small {\n    font-size: 80%;\n    font-weight: 400;\n    color: rgba(0, 0, 0, 0.7); }\n    h1 small.new-line, h2 small.new-line, h3 small.new-line, h4 small.new-line, h5 small.new-line, h6 small.new-line {\n      display: block; }\n      h1 small.new-line.with-offset, h2 small.new-line.with-offset, h3 small.new-line.with-offset, h4 small.new-line.with-offset, h5 small.new-line.with-offset, h6 small.new-line.with-offset {\n        margin-top: 7.5px; }\n\nh1, .h1 {\n  font-size: 2.5rem; }\n\nh2, .h2 {\n  font-size: 2rem; }\n\nh3, .h3 {\n  font-size: 1.75rem; }\n\nh4, .h4 {\n  font-size: 1.5rem; }\n\nh5, .h5 {\n  font-size: 2rem; }\n\nh5, .h5 {\n  font-size: 1.25rem; }\n\nh6, .h6 {\n  font-size: 1rem; }\n\n.card {\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.17);\n  border-radius: 3px; }\n\n.app-header {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  padding-left: 15px;\n  padding-right: 15px;\n  min-height: 52.5px;\n  background-color: rgba(0, 0, 0, 0.8);\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .app-header.no-left-padding {\n    padding-left: 0; }\n  .app-header.no-right-padding {\n    padding-right: 0; }\n  .app-header .pull-right {\n    display: flex; }\n  .app-header .item {\n    display: inline-block;\n    padding: 7.5px;\n    color: white;\n    text-decoration: none;\n    border-radius: 3px;\n    margin-left: 7.5px;\n    margin-right: 7.5px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .app-header .item:first-of-type {\n      margin-left: 0; }\n    .app-header .item:last-of-type {\n      margin-right: 0; }\n    .app-header .item.no-background:hover {\n      background-color: transparent; }\n    .app-header .item:hover {\n      background-color: rgba(0, 0, 0, 0.1); }\n    .app-header .item.static-item {\n      cursor: default;\n      -webkit-user-select: none;\n      -moz-user-select: none;\n      -ms-user-select: none;\n      user-select: none; }\n      .app-header .item.static-item:hover {\n        background-color: transparent; }\n  .app-header .search-block {\n    padding: 7.5px 15px;\n    width: 100%;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .app-header .search-block form .global-search-field {\n      display: block;\n      border: none;\n      padding: 11.25px 15px;\n      outline: none;\n      border-radius: 3px;\n      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);\n      max-width: 400px;\n      min-width: 150px;\n      width: 100%;\n      transition: 0.2s box-shadow;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box;\n      -webkit-user-select: none;\n      -moz-user-select: none;\n      -ms-user-select: none;\n      user-select: none; }\n      .app-header .search-block form .global-search-field:focus {\n        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2); }\n\n.button {\n  display: inline-block;\n  padding: 11.25px 15px;\n  text-decoration: none;\n  color: white;\n  border-radius: 3px;\n  background-color: #44A4FF;\n  transition: 0.2s box-shadow, 0.2s background-color;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  text-transform: none;\n  background: #5eb0ff;\n  /* Old browsers */\n  background: -moz-linear-gradient(top, #5eb0ff 0%, #118bff 100%);\n  /* FF3.6+ */\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #5eb0ff), color-stop(100%, #118bff));\n  /* Chrome,Safari4+ */\n  background: -webkit-linear-gradient(top, #5eb0ff 0%, #118bff 100%);\n  /* Chrome10+,Safari5.1+ */\n  background: -o-linear-gradient(top, #5eb0ff 0%, #118bff 100%);\n  /* Opera 11.10+ */\n  background: -ms-linear-gradient(top, #5eb0ff 0%, #118bff 100%);\n  /* IE10+ */\n  background: linear-gradient(to bottom, #5eb0ff 0%, #118bff 100%);\n  /* W3C */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#000000',GradientType=0 );\n  /* IE6-9 */\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .button:hover {\n    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n    background-color: #44a4ff;\n    color: white; }\n  .button.button-danger {\n    background: #e52d27;\n    /* fallback for old browsers */\n    background: -webkit-linear-gradient(to top, #b31217, #e52d27);\n    /* Chrome 10-25, Safari 5.1-6 */\n    background: linear-gradient(to top, #b31217, #e52d27);\n    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ }\n    .button.button-danger:hover {\n      background: #d14233;\n      /* Old browsers */\n      background: -moz-linear-gradient(top, #d14233 0%, #e43725 100%);\n      /* FF3.6+ */\n      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d14233), color-stop(100%, #e43725));\n      /* Chrome,Safari4+ */\n      background: -webkit-linear-gradient(top, #d14233 0%, #e43725 100%);\n      /* Chrome10+,Safari5.1+ */\n      background: -o-linear-gradient(top, #d14233 0%, #e43725 100%);\n      /* Opera 11.10+ */\n      background: -ms-linear-gradient(top, #d14233 0%, #e43725 100%);\n      /* IE10+ */\n      background: linear-gradient(to bottom, #d14233 0%, #e43725 100%);\n      /* W3C */\n      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#000000',GradientType=0 );\n      /* IE6-9 */ }\n  .button.button-small {\n    padding: 7.5px 11.25px; }\n\n.alert {\n  padding-left: 15px;\n  background-color: white;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .alert.alert-compact {\n    max-width: 450px; }\n  .alert[data-icon] {\n    padding-left: 70px;\n    position: relative; }\n    .alert[data-icon]::before {\n      content: attr(data-icon);\n      position: absolute;\n      top: 15px;\n      left: 15px;\n      font-family: 'Material Icons', sans-serif;\n      font-size: 2.5rem;\n      color: rgba(0, 0, 0, 0.8); }\n  .alert .alert-title, .alert .alert-content, .alert .alert-footer {\n    padding-bottom: 15px;\n    padding-right: 15px; }\n  .alert .alert-title {\n    padding-top: 15px;\n    color: rgba(0, 0, 0, 0.8);\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .alert .alert-content {\n    color: rgba(0, 0, 0, 0.7);\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .alert .alert-footer.links-list {\n    display: flex; }\n    .alert .alert-footer.links-list > * {\n      margin-left: 11.25px; }\n      .alert .alert-footer.links-list > *:first-of-type {\n        margin-left: 0; }\n\n.table {\n  width: 100%;\n  background-color: white; }\n  .table thead tr th {\n    text-align: left;\n    text-transform: uppercase;\n    background-color: rgba(0, 0, 0, 0.015);\n    color: rgba(0, 0, 0, 0.7); }\n  .table thead tr th, .table tbody tr td, .table tfoot tr td {\n    padding: 15px;\n    vertical-align: middle;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .table thead tr th.labels-list, .table thead tr th.contains-button, .table tbody tr td.labels-list, .table tbody tr td.contains-button, .table tfoot tr td.labels-list, .table tfoot tr td.contains-button {\n      padding: 0; }\n    .table thead tr th.contains-button, .table tbody tr td.contains-button, .table tfoot tr td.contains-button {\n      padding-right: 15px; }\n    .table thead tr th.pull-right, .table tbody tr td.pull-right, .table tfoot tr td.pull-right {\n      text-align: right; }\n    .table thead tr th.no-paddings, .table tbody tr td.no-paddings, .table tfoot tr td.no-paddings {\n      padding: 0; }\n  .table tbody tr td {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.03); }\n  .table tbody tr.highlight-row-as-error td {\n    background-color: rgba(255, 113, 97, 0.56); }\n  .table tbody tr:last-of-type td {\n    border-bottom: none; }\n\n.text-label {\n  font-size: 10px;\n  padding: 7.5px;\n  background-color: #44A4FF;\n  color: white;\n  text-decoration: none;\n  display: block;\n  float: left;\n  width: auto;\n  border-radius: 3px;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n  margin-left: 10px;\n  transition: 0.15s background-color, 0.15s box-shadow;\n  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .text-label:hover {\n    color: white;\n    background-color: #2b98ff;\n    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.2); }\n  .text-label[data-badge]:not([data-badge=\"\"]) {\n    padding-right: 0; }\n    .text-label[data-badge]:not([data-badge=\"\"])::after {\n      content: attr(data-badge);\n      color: white;\n      background-color: rgba(0, 0, 0, 0.1);\n      padding: 7.5px;\n      padding-bottom: 6.5px;\n      padding-left: 11.25px;\n      padding-right: 11.25px;\n      position: relative;\n      margin-left: 7.5px;\n      margin-right: -1px;\n      top: 1px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n  .text-label.text-label-top-offset {\n    margin-top: 7.5px; }\n  .text-label.text-label-top-offset {\n    margin-bottom: 7.5px; }\n\nform.form {\n  padding: 15px;\n  width: 100%;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.17);\n  background-color: white;\n  border-radius: 3px;\n  max-width: 750px;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  form.form .form-group {\n    display: flex;\n    width: 100%;\n    align-items: center;\n    margin-bottom: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    form.form .form-group:last-of-type {\n      margin-bottom: 0; }\n    form.form .form-group[data-label-position=\"top\"] {\n      align-items: flex-start; }\n      form.form .form-group[data-label-position=\"top\"] .input-wrapper .input-container[data-required]::after {\n        display: none; }\n    form.form .form-group.no-top-offset .input-wrapper .buttons-list {\n      margin-top: 0; }\n    form.form .form-group.no-label > .label {\n      display: none; }\n    form.form .form-group.no-label .input-wrapper {\n      margin-left: 250px; }\n    form.form .form-group .label {\n      display: block;\n      width: 250px;\n      flex-grow: 0;\n      flex-shrink: 0;\n      text-align: right;\n      padding-right: 15px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n    form.form .form-group .input-wrapper {\n      width: 100%; }\n      form.form .form-group .input-wrapper .buttons-list {\n        margin-top: 15px; }\n      form.form .form-group .input-wrapper .input-container {\n        width: 100%;\n        /* CHOICE */\n        /* END CHOICE */\n        /* CHECKBOXES */\n        /* END CHECKBOXES */ }\n        form.form .form-group .input-wrapper .input-container[data-required] {\n          position: relative; }\n          form.form .form-group .input-wrapper .input-container[data-required]::after {\n            content: \"\";\n            position: absolute;\n            display: block;\n            width: 4px;\n            height: 4px;\n            border-radius: 10px;\n            background-color: #44A4FF;\n            box-shadow: 0 0 0 4px #e7f3ff;\n            top: 50%;\n            margin-top: -2px;\n            right: 11.25px; }\n        form.form .form-group .input-wrapper .input-container .form-group > .label {\n          width: 150px;\n          text-align: left; }\n        form.form .form-group .input-wrapper .input-container input[type=\"text\"],\n        form.form .form-group .input-wrapper .input-container input[type=\"password\"],\n        form.form .form-group .input-wrapper .input-container input[type=\"email\"],\n        form.form .form-group .input-wrapper .input-container select {\n          background-color: white;\n          display: block;\n          padding: 11.25px;\n          padding-right: 26.5px;\n          border-radius: 3px;\n          outline: none;\n          width: 100%;\n          border: 1px solid #ebebeb;\n          transition: 0.1s border;\n          -webkit-box-sizing: border-box;\n          -moz-box-sizing: border-box;\n          box-sizing: border-box; }\n          form.form .form-group .input-wrapper .input-container input[type=\"text\"]:focus,\n          form.form .form-group .input-wrapper .input-container input[type=\"password\"]:focus,\n          form.form .form-group .input-wrapper .input-container input[type=\"email\"]:focus,\n          form.form .form-group .input-wrapper .input-container select:focus {\n            border-color: #44A4FF; }\n        form.form .form-group .input-wrapper .input-container .choice-expanded .choice-widget {\n          display: flex;\n          align-items: center;\n          margin-bottom: 7.5px; }\n          form.form .form-group .input-wrapper .input-container .choice-expanded .choice-widget:last-of-type {\n            margin-bottom: 0; }\n          form.form .form-group .input-wrapper .input-container .choice-expanded .choice-widget label, form.form .form-group .input-wrapper .input-container .choice-expanded .choice-widget .checkbox-container {\n            cursor: pointer; }\n        form.form .form-group .input-wrapper .input-container .checkbox-container input[type=\"checkbox\"] {\n          display: none; }\n          form.form .form-group .input-wrapper .input-container .checkbox-container input[type=\"checkbox\"]:checked + .checkbox-placeholder::after {\n            content: 'check';\n            font-family: 'Material Icons', sans-serif;\n            color: #44A4FF;\n            font-size: 18px;\n            display: block;\n            width: 12px;\n            height: 12px;\n            position: absolute;\n            top: 0;\n            left: 0;\n            font-weight: bold; }\n        form.form .form-group .input-wrapper .input-container .checkbox-container .checkbox-placeholder {\n          width: 22px;\n          height: 22px;\n          display: block;\n          margin-right: 7.5px;\n          border: 2px solid #44A4FF;\n          position: relative;\n          -webkit-box-sizing: border-box;\n          -moz-box-sizing: border-box;\n          box-sizing: border-box; }\n  form.form .markdown-row > .form-group {\n    align-items: flex-start; }\n    form.form .markdown-row > .form-group > .label {\n      margin-top: 15px; }\n    form.form .markdown-row > .form-group .CodeMirror {\n      height: 400px; }\n\n.pagination {\n  display: flex;\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .pagination.with-paddings {\n    padding: 15px; }\n  .pagination.with-top-offset {\n    margin-top: 15px; }\n  .pagination.with-bottom-offset {\n    margin-bottom: 15px; }\n  .pagination.with-left-offset {\n    margin-left: 15px; }\n  .pagination.with-right-offset {\n    margin-right: 15px; }\n  .pagination > a.pagination-item {\n    display: block;\n    padding: 11.25px;\n    border: 1px solid #ebebeb;\n    border-radius: 3px;\n    text-decoration: none;\n    transition: 0.1s border-color;\n    color: rgba(0, 0, 0, 0.7);\n    position: relative;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .pagination > a.pagination-item:not(.disabled) {\n      background-color: white; }\n      .pagination > a.pagination-item:not(.disabled):hover {\n        border-color: #44A4FF;\n        color: #44A4FF; }\n    .pagination > a.pagination-item:first-of-type {\n      margin-right: 7.5px; }\n    .pagination > a.pagination-item.disabled {\n      cursor: not-allowed; }\n    .pagination > a.pagination-item.navigate-backward {\n      padding-left: 34.5px; }\n      .pagination > a.pagination-item.navigate-backward::after {\n        content: 'keyboard_arrow_left';\n        font-size: 20px;\n        font-family: 'Material Icons', sans-serif;\n        position: absolute;\n        top: 50%;\n        left: 7.25px;\n        transform: translateY(-50%); }\n    .pagination > a.pagination-item.navigate-forward {\n      padding-right: 34.5px; }\n      .pagination > a.pagination-item.navigate-forward::after {\n        content: 'keyboard_arrow_right';\n        font-size: 20px;\n        font-family: 'Material Icons', sans-serif;\n        position: absolute;\n        top: 50%;\n        right: 7.25px;\n        transform: translateY(-50%); }\n\n.tabs-container {\n  width: 100%; }\n  .tabs-container .tabs-navigation-header {\n    padding: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .tabs-container .tabs-navigation {\n    display: flex;\n    align-items: flex-start;\n    padding-left: 15px;\n    padding-right: 15px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .tabs-container .tabs-navigation .tab-item {\n      padding: 15px;\n      position: relative;\n      z-index: 99;\n      text-decoration: none;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box;\n      border-top: 2px solid transparent; }\n      .tabs-container .tabs-navigation .tab-item.active {\n        z-index: 101;\n        background-color: white;\n        border-top: 2px solid #44A4FF; }\n  .tabs-container .tabs-content {\n    padding: 15px;\n    background-color: white;\n    position: relative;\n    z-index: 100;\n    border-radius: 3px;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n    .tabs-container .tabs-content > form {\n      box-shadow: none;\n      padding: 0; }\n    .tabs-container .tabs-content > table.table thead tr th {\n      background-color: white; }\n\n.table thead tr th.set-trade-result-buttons, .table tbody tr td.set-trade-result-buttons, .table tfoot tr td.set-trade-result-buttons {\n  padding-right: 15px; }\n  .table thead tr th.set-trade-result-buttons .trade-result-buttons-container, .table tbody tr td.set-trade-result-buttons .trade-result-buttons-container, .table tfoot tr td.set-trade-result-buttons .trade-result-buttons-container {\n    display: flex;\n    justify-content: flex-end; }\n    .table thead tr th.set-trade-result-buttons .trade-result-buttons-container > a, .table tbody tr td.set-trade-result-buttons .trade-result-buttons-container > a, .table tfoot tr td.set-trade-result-buttons .trade-result-buttons-container > a {\n      color: rgba(0, 0, 0, 0.7);\n      display: inline-block;\n      padding: 3.75px;\n      border-radius: 3px;\n      -webkit-box-sizing: border-box;\n      -moz-box-sizing: border-box;\n      box-sizing: border-box; }\n      .table thead tr th.set-trade-result-buttons .trade-result-buttons-container > a:first-of-type, .table tbody tr td.set-trade-result-buttons .trade-result-buttons-container > a:first-of-type, .table tfoot tr td.set-trade-result-buttons .trade-result-buttons-container > a:first-of-type {\n        margin-right: 7.5px; }\n      .table thead tr th.set-trade-result-buttons .trade-result-buttons-container > a:hover, .table tbody tr td.set-trade-result-buttons .trade-result-buttons-container > a:hover, .table tfoot tr td.set-trade-result-buttons .trade-result-buttons-container > a:hover {\n        color: white;\n        background-color: rgba(0, 0, 0, 0.7); }\n\n.balance-history-type {\n  font-weight: bold;\n  color: rgba(0, 0, 0, 0.8); }\n  .balance-history-type > .type-income {\n    color: #27ae60; }\n  .balance-history-type > .type-bonus {\n    color: #f39c12; }\n  .balance-history-type > .type-outgoing {\n    color: #c0392b; }\n\n.editor-toolbar.fullscreen {\n  z-index: 9999; }\n  .editor-toolbar.fullscreen * {\n    z-index: 9999; }\n", ""]);

// exports


/***/ }),
/* 2 */
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
/* 3 */
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

var	fixUrls = __webpack_require__(4);

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
/* 4 */
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


/***/ })
/******/ ]);
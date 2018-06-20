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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

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
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
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

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Model = _interopRequireDefault(__webpack_require__(3));

var _View = _interopRequireDefault(__webpack_require__(4));

var _Controller = _interopRequireDefault(__webpack_require__(5));

var _initSwiper = _interopRequireDefault(__webpack_require__(6));

var _autoSlideUp = _interopRequireDefault(__webpack_require__(7));

var _stickyTopbar = _interopRequireDefault(__webpack_require__(8));

var _smoothlyNavigation = _interopRequireDefault(__webpack_require__(9));

var _message = _interopRequireDefault(__webpack_require__(10));

__webpack_require__(11);

__webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.Model = function (options) {
  var resourceName = options.resourceName;
  return {
    init: function init() {
      var APP_ID = 'e6VBXAwRkldfhC2vMQos77XR-gzGzoHsz';
      var APP_KEY = 'qen3v1q2121xwg6ahm1Ynvcd';
      AV.init({
        appId: APP_ID,
        appKey: APP_KEY
      });
    },
    fetch: function fetch() {
      var query = new AV.Query(resourceName);
      return query.find(); //promise对象
    },
    save: function save(object) {
      var X = AV.Object.extend(resourceName);
      var x = new X();
      return x.save(object);
    }
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.View = function (selector) {
  return document.querySelector(selector);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.Controller = function (options) {
  var _init = options.init;
  var object = {
    view: null,
    model: null,
    init: function init(view, model) {
      this.view = view;
      this.model = model;
      this.model.init();

      _init.call(this, view, model);

      this.bindEvents.call(this);
    }
  };

  for (var key in options) {
    if (key !== 'init') {
      object[key] = options[key];
    }
  }

  return object;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function () {
  var view = View('#mySlides');
  var controller = {
    view: null,
    swiper: null,
    swiperOptions: {
      loop: true,
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    },
    init: function init(view) {
      this.view = view;
      this.initSwiper();
    },
    initSwiper: function initSwiper() {
      this.swiper = new Swiper(this.view.querySelector('.swiper-container'), this.swiperOptions);
    }
  };
  controller.init(view);
}.call();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function () {
  //添加 offSet 类
  var specialTags = document.querySelectorAll('[data-x]');

  for (var i = 0; i < specialTags.length; i++) {
    specialTags[i].classList.add('offSet');
  }

  findClosestAndRemoveOffset();
  window.addEventListener('scroll', function (x) {
    findClosestAndRemoveOffset();
  }); //helper

  function findClosestAndRemoveOffset() {
    var specialTags = document.querySelectorAll('[data-x]');
    var minIndex = 0;

    for (var _i = 0; _i < specialTags.length; _i++) {
      if (Math.abs(specialTags[_i].offsetTop - window.scrollY) < Math.abs(specialTags[minIndex].offsetTop - window.scrollY)) {
        minIndex = _i;
      }
    } //minIndex 就是离窗口顶部最近的元素


    specialTags[minIndex].classList.remove('offSet');
    var tagsName = specialTags[minIndex].id;
    var nameOfA = document.querySelector('a[href="#' + tagsName + '"]');
    var li = nameOfA.parentNode;
    var brothersAndMe = li.parentNode.children;

    for (var _i2 = 0; _i2 < brothersAndMe.length; _i2++) {
      brothersAndMe[_i2].classList.remove('highLight');
    }

    li.classList.add('highLight');
  }

  var liTags = document.querySelectorAll('nav.menu > ul > li');

  for (var _i3 = 0; _i3 < liTags.length; _i3++) {
    liTags[_i3].onmouseenter = function (x) {
      x.currentTarget.classList.add('active');
    };

    liTags[_i3].onmouseleave = function (x) {
      x.currentTarget.classList.remove('active');
    };
  }
}.call();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function () {
  var view = View('#topNavBar');
  var controller = {
    view: null,
    init: function init(view) {
      this.view = view;
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      var _this = this;

      var view = this.view;
      window.addEventListener('scroll', function (x) {
        if (window.scrollY > 0) {
          _this.active();
        } else {
          _this.deactive();
        }
      }); //箭头函数没有 this
    },
    active: function active() {
      this.view.classList.add('sticky');
    },
    deactive: function deactive() {
      this.view.classList.remove('sticky');
    }
  };
  controller.init(view);
}.call();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function () {
  var view = View('nav.menu');
  var controller = {
    view: null,
    aTags: null,
    init: function init(view) {
      this.view = view;
      this.initAnimation();
      this.bindEvents();
    },
    initAnimation: function initAnimation() {
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }

      requestAnimationFrame(animate);
    },
    scrollToElement: function scrollToElement(element) {
      var top = element.offsetTop;
      var currentTop = window.scrollY;
      var targetTop = top - 80;
      var s = targetTop - currentTop;
      var t = Math.abs(s / 100 * 300);

      if (t > 500) {
        t = 500;
      }

      var coords = {
        y: currentTop
      }; //初始位置

      var tween = new TWEEN.Tween(coords).to({
        y: targetTop
      }, t) //结束位置  ， 时间
      .easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function () {
        window.scrollTo(0, coords.y);
      }).start();
    },
    bindEvents: function bindEvents() {
      var _this = this;

      var aTags = this.view.querySelectorAll('nav.menu > ul > li > a');

      for (var i = 0; i < aTags.length; i++) {
        aTags[i].onclick = function (x) {
          x.preventDefault(); //阻止默认动作

          var a = x.currentTarget;
          var href = a.getAttribute('href'); //'#siteAbout'

          var element = document.querySelector(href);

          _this.scrollToElement(element);
        };
      }
    }
  };
  controller.init(view);
}.call();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function () {
  var view = View('section.message');
  var model = Model({
    resourceName: 'Message'
  });
  var controller = Controller({
    init: function init(view, controller) {
      this.messageList = view.querySelector('#messageList');
      this.form = view.querySelector('form');
      this.loadMessages();
    },
    loadMessages: function loadMessages() {
      var _this = this;

      this.model.fetch().then(function (messages) {
        var array = messages.map(function (item) {
          return item.attributes;
        });
        array.forEach(function (item) {
          var li = document.createElement('li');
          li.innerText = "".concat(item.name, ": ").concat(item.content);

          _this.messageList.appendChild(li);
        });
      });
    },
    bindEvents: function bindEvents() {
      var _this2 = this;

      this.form.addEventListener('submit', function (e) {
        e.preventDefault();

        _this2.modifyContent();
      });
    },
    modifyContent: function modifyContent() {
      var myForm = this.form;
      var content = myForm.querySelector('input[name=content]').value.trim();
      var name = myForm.querySelector('input[name=name]').value.replace(" ", "");

      if (content !== '' && name !== '') {
        this.model.save({
          'name': name,
          'content': content
        }).then(function (object) {
          var li = document.createElement('li');
          li.innerText = "".concat(object.attributes.name, ": ").concat(object.attributes.content);
          var messageList = document.querySelector('#messageList');
          messageList.appendChild(li);
          myForm.querySelector('input[name=content]').value = '';
        });
      }
    }
  });
  controller.init(view, model);
}.call();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(12);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!../../node_modules/sass-loader/lib/loader.js??ref--1-3!./loading.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!../../node_modules/sass-loader/lib/loader.js??ref--1-3!./loading.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".site-welcome {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #888;\n  z-index: 20;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.site-welcome.active {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n.loading {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 200px;\n  height: 200px;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: relative; }\n\n.loading::before,\n.loading::after {\n  content: '';\n  position: absolute;\n  border-radius: 50%;\n  background: black;\n  -webkit-animation: scale 1.5s linear infinite;\n          animation: scale 1.5s linear infinite;\n  -ms-flex-item-align: center;\n      align-self: center; }\n\n.loading::after {\n  content: '';\n  -webkit-animation-delay: 0.75s;\n          animation-delay: 0.75s; }\n\n@-webkit-keyframes scale {\n  0% {\n    width: 0;\n    height: 0;\n    opacity: 0.95; }\n  100% {\n    width: 100px;\n    height: 100px;\n    opacity: 0; } }\n\n@keyframes scale {\n  0% {\n    width: 0;\n    height: 0;\n    opacity: 0.95; }\n  100% {\n    width: 100px;\n    height: 100px;\n    opacity: 0; } }\n", ""]);

// exports


/***/ }),
/* 13 */
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
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(15);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(1)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!../../node_modules/sass-loader/lib/loader.js??ref--1-3!./main.scss", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!../../node_modules/sass-loader/lib/loader.js??ref--1-3!./main.scss");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "body {\n  background-color: #efefef;\n  margin: 0; }\n\nli {\n  list-style-type: none; }\n\na {\n  color: inherit;\n  text-decoration: none; }\n\nh1, h2, h3, h4, h5, h6, p {\n  margin: 0;\n  padding: 0; }\n\nhr {\n  height: 0;\n  border: none;\n  border-top: 1px solid #dedede; }\n\n/*[data-x].active{\n    outline: 1px solid red;\n}*/\n\n[data-x].offSet {\n  -webkit-transform: translateY(100px);\n          transform: translateY(100px); }\n\n[data-x] {\n  -webkit-transform: translateY(0);\n          transform: translateY(0);\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s; }\n\n@-webkit-keyframes slideUp {\n  0% {\n    -webkit-transform: translateY(-30px);\n            transform: translateY(-30px); }\n  100% {\n    -webkit-transform: translateY(0px);\n            transform: translateY(0px); } }\n\n@keyframes slideUp {\n  0% {\n    -webkit-transform: translateY(-30px);\n            transform: translateY(-30px); }\n  100% {\n    -webkit-transform: translateY(0px);\n            transform: translateY(0px); } }\n\n.topNavBar {\n  color: #B7B7B7;\n  padding-top: 28px;\n  padding-bottom: 20px;\n  padding-left: 0px;\n  padding-right: 0px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s; }\n\n.topNavBar nav > ul {\n    list-style: none;\n    margin: 0;\n    padding: 0; }\n\n.topNavBar nav > ul > li {\n      float: right;\n      margin-left: 17px;\n      margin-right: 17px;\n      position: relative; }\n\n.topNavBar nav > ul > li > a {\n        display: block;\n        color: inherit;\n        font-size: 12px;\n        text-decoration: none;\n        font-weight: bold;\n        border-bottom: 3px solid transparent;\n        border-top: 3px solid transparent;\n        padding-bottom: 2px;\n        padding-top: 6px;\n        position: relative;\n        -webkit-transition: all 0.5s linear;\n        transition: all 0.5s linear; }\n\n.topNavBar nav > ul > li > a::before {\n        content: '';\n        display: block;\n        position: absolute;\n        top: 100%;\n        left: 0;\n        width: 0%;\n        background: #e06567;\n        height: 3px;\n        -webkit-transition: all 0.5s linear;\n        transition: all 0.5s linear; }\n\n.topNavBar li.active > .subMenu {\n    display: block;\n    -webkit-animation: subMenuSlide .5s;\n            animation: subMenuSlide .5s; }\n\n.topNavBar .subMenu {\n    display: none;\n    position: absolute;\n    right: 0;\n    top: 100%;\n    padding: 5px 10px;\n    background: white;\n    color: #3d4451;\n    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, .5);\n            box-shadow: 0 0 5px rgba(0, 0, 0, .5); }\n\n.topNavBar .subMenu > li {\n      white-space: nowrap;\n      padding: 10px; }\n\n.topNavBar .logo .card {\n    font-size: 30px;\n    font-family: \"Fredoka One\";\n    color: #9a9da2;\n    padding-top: 2px;\n    padding-bottom: 2px; }\n\n.topNavBar .logo .rs {\n    font-size: 30px;\n    font-family: \"Fredoka One\";\n    margin-right: 4px;\n    color: #E6686A;\n    padding-top: 2px;\n    padding-bottom: 2px; }\n\n.topNavBar .clearfix2 > li {\n    float: right;\n    margin-left: 11px;\n    margin-right: 10px; }\n\n.topNavBar.sticky {\n  background: white;\n  padding: 10px 0;\n  z-index: 19;\n  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .5);\n          box-shadow: 0 0 10px rgba(0, 0, 0, .5);\n  color: #3d4451; }\n\n.topNavBar-inner {\n  padding: 0 16px; }\n\n.clearfix::after {\n  content: '';\n  display: block;\n  clear: both; }\n\n@-webkit-keyframes subMenuSlide {\n  0% {\n    margin-right: 100%;\n    opacity: 0; }\n  100% {\n    margin-right: 0;\n    opacity: 1; } }\n\n@keyframes subMenuSlide {\n  0% {\n    margin-right: 100%;\n    opacity: 0; }\n  100% {\n    margin-right: 0;\n    opacity: 1; } }\n\n/*.clearfix2::after{\n    content: '';\n    display: block;\n    clear: both;\n}*/\n\n/*.topNavBar>nav>.clearfix2>li>.EN{\n    display:block;\n    -webkit-transition: opacity 1s ease-in-out;\n    -moz-transition: opacity 1s ease-in-out;\n    -ms-transition: opacity 1s ease-in-out;\n    -o-transition: opacity 1s ease-in-out;\n    transition: opacity 1s ease-in-out;\n    opacity: 0;\n    font-size: 8px ;\n    color:#B7B7B7;\n    text-decoration: none;\n    font-weight: normal ;\n    border-bottom: none;\n}*/\n\n.topNavBar nav > ul > li.active > a::before,\n.topNavBar nav > ul > li.highLight > a::before {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background: #e06567;\n  height: 3px;\n  -webkit-transition: all 0.5s linear;\n  transition: all 0.5s linear; }\n\n/*li>a:hover a.EN{\n    border-bottom: none !important;\n    zoom: 1;\n    filter: alpha(opacity=100);\n    opacity: 1;\n}*/\n\n.banner {\n  height: 515px;\n  background-position: center center;\n  background-size: cover; }\n\n.banner .mask {\n    height: 515px;\n    background-color: rgba(0, 0, 0, .5); }\n\nmain {\n  margin-top: -340px; }\n\n.userCard {\n  max-width: 940px;\n  height: 450px;\n  background-color: white;\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n  -webkit-box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, .5);\n          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, .5); }\n\n.userCard .welcome {\n    background: #E6686A;\n    color: white;\n    display: inline-block;\n    padding: 4px 16px;\n    line-height: 22px;\n    margin-bottom: 10px;\n    position: relative; }\n\n.userCard .welcome .triangle {\n      display: block;\n      border: 10px solid transparent;\n      width: 0px;\n      border-left-color: #E6686A;\n      border-top-width: 0px;\n      position: absolute;\n      left: 4px;\n      top: 100%; }\n\n.userCard .picture {\n    float: left; }\n\n.userCard .text {\n    float: left;\n    margin-left: 65px;\n    width: 500px; }\n\n.userCard .text h1 {\n      margin-top: 18px;\n      font-weight: 500; }\n\n.userCard .text h2 {\n      margin: 20,0; }\n\n.userCard .pictureAndText {\n    padding: 50px; }\n\n.userCard dl dt, .userCard dl dd {\n    float: left;\n    padding: 5px 0; }\n\n.userCard dl dt {\n    width: 30%;\n    font-weight: bold; }\n\n.userCard dl dd {\n    width: 70%;\n    -webkit-margin-start: 0px;\n    color: #9da0a7; }\n\n.userCard > footer.media {\n    background: #E6686A;\n    position: absolute;\n    top: 100%;\n    left: 0;\n    right: 0;\n    text-align: center; }\n\n.userCard svg {\n    width: 30px;\n    height: 30px;\n    fill: white;\n    vertical-align: top; }\n\n.userCard > footer {\n    -webkit-box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, .5);\n            box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, .5); }\n\n.userCard > footer.media > a {\n    display: inline-block;\n    border-radius: 50%;\n    padding: 5px 0;\n    width: 40px;\n    line-height: 30px;\n    margin: 20px; }\n\n.userCard > footer.media > a:hover {\n    background-color: #CF5D5F;\n    -webkit-transition: 0.3s linear;\n    transition: 0.3s linear; }\n\nmain > .description a.button {\n  font-size: 15px;\n  font-weight: bold;\n  padding: 15px 36px;\n  border: 1px solid #cbcdcf;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 0px;\n  margin-bottom: 20px; }\n\nmain > .description a.button:hover {\n  -webkit-box-shadow: 4px 4px 17px 1px rgba(0, 0, 0, .3);\n          box-shadow: 4px 4px 17px 1px rgba(0, 0, 0, .3);\n  -webkit-transition: 0.3s linear;\n  transition: 0.3s linear; }\n\n.buttonBox {\n  display: block;\n  text-align: center;\n  margin-top: 130px;\n  margin-bottom: 45px; }\n\np.crap {\n  display: block;\n  text-align: center;\n  font-size: 20px;\n  padding: 0; }\n\nsection > h2 {\n  display: block;\n  text-align: center;\n  font-family: sans-serif;\n  font-size: 37px;\n  font-weight: 300; }\n\nsection > .processBar {\n  display: block;\n  text-align: left;\n  border: 1px solid #cbcdcf;\n  background-color: white;\n  max-width: 940px;\n  margin-left: auto;\n  margin-right: auto;\n  padding: 25px 0px 45px 0;\n  margin-top: 30px; }\n\nsection > .processBar:hover {\n  -webkit-box-shadow: 4px 4px 17px 1px rgba(0, 0, 0, .3);\n          box-shadow: 4px 4px 17px 1px rgba(0, 0, 0, .3);\n  -webkit-transition: 0.3s linear;\n  transition: 0.3s linear; }\n\nsection > .processBar > li {\n  width: 42%;\n  display: block;\n  float: left;\n  margin: 20px 0px 20px 50px; }\n\nsection > .processBar > li .process {\n  height: 5px;\n  width: 100%;\n  background-color: rgba(232, 103, 107, .3);\n  border-radius: 2px;\n  overflow: hidden; }\n\nsection.skill.offSet .process > div {\n  -webkit-transform: translateX(-100%);\n          transform: translateX(-100%); }\n\nsection.skill .process > div {\n  -webkit-transform: translateX(0);\n          transform: translateX(0);\n  -webkit-transition: all 1s;\n  transition: all 1s; }\n\nsection > .processBar > li .process .rank1 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 20%;\n  border-radius: 2px; }\n\nsection > .processBar > li .process .rank2 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 30%;\n  border-radius: 2px; }\n\nsection > .processBar > li .process .rank3 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 8%;\n  border-radius: 2px; }\n\nsection > .processBar > li .process .rank4 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 4%;\n  border-radius: 2px; }\n\nsection > .processBar > li .process .rank5 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 1%;\n  border-radius: 2px; }\n\nsection > .processBar > li .process .rank6 {\n  background-color: #e8676b;\n  height: 100%;\n  width: 30%;\n  border-radius: 2px; }\n\nsection.skill > h2,\nsection.Portfolio > h2 {\n  text-align: center;\n  color: #3d4451;\n  line-height: 1.2; }\n\nsection.skill,\nsection.Portfolio {\n  max-width: 940px;\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 60px; }\n\nsection.Portfolio {\n  text-align: center; }\n\nsection.Portfolio > nav {\n  text-align: center;\n  display: inline-block;\n  vertical-align: top;\n  margin-top: 32px; }\n\nsection.Portfolio > nav > ol {\n  display: inline-block;\n  padding: 0;\n  vertical-align: top;\n  margin: 0 0; }\n\nsection.Portfolio > nav > ol > li {\n  float: left;\n  font-weight: 500;\n  list-style-type: none;\n  margin-left: 40px;\n  cursor: pointer; }\n\nsection.Portfolio > nav > ol > li:nth-child(1) {\n  margin-left: 0; }\n\nsection.Portfolio > nav .bar {\n  margin-top: 5px;\n  background-color: white;\n  display: block;\n  height: 5px;\n  border-radius: 2px;\n  margin-bottom: 30px; }\n\nsection.Portfolio > nav .bar-inner {\n  height: 100%;\n  background: #e6686a;\n  width: 10%;\n  border-radius: 2px;\n  -webkit-transition: all 0.3s;\n  transition: all 0.3s; }\n\nsection.Portfolio > nav .bar.state-1 .bar-inner {\n  margin-left: 0px;\n  width: 30px; }\n\nsection.Portfolio > nav .bar.state-2 .bar-inner {\n  margin-left: 73px;\n  width: 30px; }\n\nsection.Portfolio > nav .bar.state-3 .bar-inner {\n  margin-left: 145px;\n  width: 90px; }\n\nsection.Portfolio .Projects {\n  position: relative;\n  margin-bottom: 100px; }\n\nsection.Portfolio .swiper-container {\n  width: 668px;\n  height: 501px; }\n\nsection.Portfolio .swiper-slide {\n  background: white; }\n\n.swiper-button-prev {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23e8676b'%2F%3E%3C%2Fsvg%3E\"); }\n\n.swiper-button-next {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23e8676b'%2F%3E%3C%2Fsvg%3E\"); }\n\n.swiper-pagination-bullet-active {\n  background: #e8676b; }\n\n.icon {\n  width: 1em;\n  height: 1em;\n  vertical-align: -0.15em;\n  fill: currentColor;\n  overflow: hidden; }\n\n.postMessage {\n  width: 668px;\n  margin: 50px auto;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start; }\n\n.postMessage > .content {\n  width: 100%; }\n\n.postMessage > :nth-child(2) {\n  margin: 0 8px; }\n\n.postMessage > :nth-child(4) {\n  margin: 0 0 0 8px; }\n\nsection.message {\n  margin-top: 60px; }\n\nsection.message > #messageList {\n  max-width: 668px;\n  margin: 30px auto;\n  padding: 0;\n  background: #f4f4f4; }\n\nsection.message > #messageList > li {\n  padding: 16px;\n  border: 1px 0;\n  border-top: 1px solid #efefef;\n  border-bottom: 1px solid #efefef; }\n", ""]);

// exports


/***/ })
/******/ ]);
exports.ids = [0];
exports.modules = {

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer = __webpack_require__(92);

var _createReducer2 = _interopRequireDefault(_createReducer);

var _constants = __webpack_require__(340);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initialState = {
  counter: 0
};

exports.default = (0, _createReducer2.default)(initialState, {
  [_constants.ABOUT_SWITCH]: state => Object.assign({}, state, { counter: state.counter + 1 })
});

/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(10);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(93);

var _constants = __webpack_require__(340);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hoc = (0, _reactRedux.connect)(state => ({
  text: state && state.about && state.about.counter
}), dispatch => ({
  change: () => dispatch({ type: _constants.ABOUT_SWITCH })
}));

const About = ({ text, change }) => _react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    'h2',
    null,
    'About'
  ),
  _react2.default.createElement(
    'p',
    null,
    'Counter is ',
    text
  ),
  _react2.default.createElement(
    'button',
    { onClick: change },
    ' trigger action '
  )
);

exports.default = hoc(About);

/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const ABOUT_SWITCH = exports.ABOUT_SWITCH = 'about/SWITCH';

/***/ })

};;
//# sourceMappingURL=about.chunk.js.map
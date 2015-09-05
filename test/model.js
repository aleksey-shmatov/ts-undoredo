var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
var ts_observable_1 = require('ts-observable');
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.propertyChanged = new ts_observable_1.PropertyChangeEvent();
        this.x = x;
        this.y = y;
    }
    __decorate([
        ts_observable_1.observable
    ], Point.prototype, "x");
    __decorate([
        ts_observable_1.observable
    ], Point.prototype, "y");
    return Point;
})();
exports.Point = Point;
var Style = (function () {
    function Style() {
        this.propertyChanged = new ts_observable_1.PropertyChangeEvent();
        this.color = 0;
        this.alpha = 1.0;
    }
    __decorate([
        ts_observable_1.observable
    ], Style.prototype, "color");
    __decorate([
        ts_observable_1.observable
    ], Style.prototype, "alpha");
    __decorate([
        ts_observable_1.observable
    ], Style.prototype, "thickness");
    __decorate([
        ts_observable_1.observable
    ], Style.prototype, "offset");
    return Style;
})();
exports.Style = Style;
var Polyline = (function () {
    function Polyline() {
        this.propertyChanged = new ts_observable_1.PropertyChangeEvent();
        this.points = new ts_observable_1.ObservableCollection();
    }
    __decorate([
        ts_observable_1.observable
    ], Polyline.prototype, "style");
    __decorate([
        ts_observable_1.observable
    ], Polyline.prototype, "points");
    return Polyline;
})();
exports.Polyline = Polyline;
//# sourceMappingURL=model.js.map
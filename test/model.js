var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ts_observable_1 = require('ts-observable');
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        _super.call(this);
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
})(ts_observable_1.ObservableObject);
exports.Point = Point;
var Style = (function (_super) {
    __extends(Style, _super);
    function Style() {
        _super.call(this);
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
})(ts_observable_1.ObservableObject);
exports.Style = Style;
var Polyline = (function (_super) {
    __extends(Polyline, _super);
    function Polyline() {
        _super.call(this);
        this.points = new ts_observable_1.ObservableCollection();
    }
    __decorate([
        ts_observable_1.observable
    ], Polyline.prototype, "style");
    __decorate([
        ts_observable_1.observable
    ], Polyline.prototype, "points");
    return Polyline;
})(ts_observable_1.ObservableObject);
exports.Polyline = Polyline;
//# sourceMappingURL=model.js.map
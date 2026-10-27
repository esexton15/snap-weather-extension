SnapExtensions.primitives.set(
    'wth_settemperature(value)',
    function (value) {
        this.weatherTemperature = value;
    }
);

SnapExtensions.primitives.set(
    'wth_temperature()',
    function () {
        return this.weatherTemperature ?? 0;
    }
);

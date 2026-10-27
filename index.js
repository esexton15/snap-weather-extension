
(() => {
    let temperature = null;
    let loading = false;
    let error = null;

    // Command: get temperature
    SnapExtensions.primitives.set(
        'wth_gettemperature()',
        function () {
            // Avoid starting duplicate requests.
            if (loading) return;

            loading = true;
            error = null;

            const url =
                'https://api.open-meteo.com/v1/forecast' +
                '?latitude=39.4667' +
                '&longitude=-87.4139' +
                '&current=temperature_2m' +
                '&temperature_unit=fahrenheit';

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(
                            'Weather request failed: ' + response.status
                        );
                    }
                    return response.json();
                })
                .then(data => {
                    const value = data?.current?.temperature_2m;

                    if (typeof value !== 'number') {
                        throw new Error('Temperature missing from response');
                    }

                    temperature = value;
                })
                .catch(err => {
                    error = err.message || 'Unknown error';
                })
                .finally(() => {
                    loading = false;
                });
        }
    );

    // Reporter: temperature
    SnapExtensions.primitives.set(
        'wth_temperature()',
        function () {
            if (error !== null) {
                return 'Weather error: ' + error;
            }

            if (temperature === null) {
                return loading ? 'Loading...' : 'Not loaded';
            }

            return temperature;
        }
    );
})();

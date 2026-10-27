
(() => {
    let temperature = null;
    let loading = false;
    let error = null;

    // Command: get temperature
    SnapExtensions.primitives.set(
        'wth_gettemperature(latitude,longitude)',
        function (latitude,longitude) {
            // Avoid starting duplicate requests.
            if (loading) return;

            loading = true;
            error = null;

            const url = new URL("https://api.open-meteo.com/v1/forecast")
            url.searchParams.set('latitude', encodeURIComponent(latitude));
            url.searchParams.set('longitude', encodeURIComponent(longitude));
            url.searchParams.set('current', 'temperature_2m');
            url.searchParams.set('temperature_unit', 'fahrenheit');

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

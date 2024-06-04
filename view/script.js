document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const days = document.getElementById('days').value;
    const url = `http://localhost:8005/api/fetch-weather?city=${city}&days=${days}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather data:', data);
        const tableBody = document.querySelector('#forecast-table tbody');
        tableBody.innerHTML = '';

        // Handling the single object response
        data.forecasts.forEach(dayForecast => {
            const row = `
                        <tr>
                            <td>${data.country}</td>
                            <td>${data.city}</td>
                            <td>${new Date(dayForecast.date).toLocaleDateString()}</td>
                            <td>${dayForecast.day.maxtemp_c}</td>
                            <td>${dayForecast.day.mintemp_c}</td>
                            <td>${data.current.temp_c}</td>
                            <td>${data.current.feelslike_c}</td>
                            <td>${data.current.condition.text}</td>
                            
                        </tr>
                    `;
            tableBody.innerHTML += row;
        });

        // Setting the PDF header with the city name
        document.getElementById('pdf-title').textContent = `Weather Forecast - ${data.city}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');

        
    }
});

document.getElementById('download-pdf').addEventListener('click', function () {
    const element = document.getElementById('forecast-table');
    const city = document.getElementById('city').value;


    // Options for the PDF generation
    const options = {
        margin: [10, 10, 10, 10], 
        filename: `weather-forecast - ${city}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {   
         pdf.save(options.filename);
        });

        
});


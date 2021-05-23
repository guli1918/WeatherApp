const express = require('express');
const app = express();
const port = 8000;

app.use(express.urlencoded({extended: true}));

const https = require('https');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
    console.log(req.body.cityName)
    const query = req.body.cityName;
    const apiKey = "ENTER YOUR OWN API KEY";
    const unit = 'metric'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;
    
    https.get(url, (respond) => {
        respond.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;

            res.write("<p>The weather is currently " + description + "</p>");
            res.write(`<h1>The temperature in ${req.body.cityName} is ${temp} degrees!</h1>`);
            res.write(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`)
        })
        process.on('uncaughtException', (err) => {
            res.write(`<h1 style="color:red"> You entered ${req.body.cityName} but it is not a city!</h1>`);
            res.write(`<a href="/">Go Back</a>`);
        })
    });
    

})

app.listen(port, () =>{
    console.log(`Server is running on ${port}`);
})


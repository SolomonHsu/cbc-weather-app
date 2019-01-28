import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';

const apiURI = 'http://api.openweathermap.org/data/2.5/weather?id=6167865&mode=xml&APPID=';
const apiKey = '9d681caf6079abf92b6e73366c9516c0';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            city : '',
            temperature : '',
            humidity : '',
            pressure : '',
            windDirection : '',
            windSpeed : '',
            clouds : '',
            visibility : '',
            precipitation : '',
            weather : '',
            lastupdate : '',
            isLoaded: false,
            error: null,
        }
    }

    componentDidMount(){
        //XML can't be converted to JSON directly. Need to use xml-js library.
        const convertXMLtoJSon = require('xml-js');
        var options = {ignoreComment: true, alwaysChildren: false, compact: true};
        //fetching the API in XML format. Using the Current city, Toronto's ID
        fetch(apiURI+apiKey)
            //in XML string right now
            .then(res => res.text())
            .then(res => {
                //parsing XML and need to convert to JSON string
                var jsonParse = convertXMLtoJSon.xml2js(res, options);
                //City JSON
                var cityJSON = jsonParse.current;
                //Check the JSON format in Console
                console.log(cityJSON);
                //Set the JSON data to the React states
                this.setState({
                    city : cityJSON.city._attributes.name,
                    temperature : cityJSON.temperature._attributes,
                    humidity : cityJSON.humidity._attributes.value + ' ' + cityJSON.humidity._attributes.unit,
                    pressure : cityJSON.pressure._attributes.value,
                    windDirection : cityJSON.wind.direction._attributes.value + ' ' + cityJSON.wind.direction._attributes.code,
                    windSpeed : cityJSON.wind.speed._attributes.value + ' ' + cityJSON.wind.speed._attributes.name,
                    clouds : cityJSON.clouds._attributes.name,
                    visibility : cityJSON.visibility._attributes.value,
                    precipitation : cityJSON.precipitation._attributes.mode,
                    weather : cityJSON.weather._attributes.value,
                    lastupdate : cityJSON.lastupdate._attributes.value,
                    isLoaded: true,
                })
            }).
            catch(error => this.setState({error, isLoaded: false}));
    }

    //Each time when the button is clicked, the ComponentDidMount will function and update new data
    refreshWeatherData = e =>{
        e.preventDefault();
        this.componentDidMount(e);
        console.log('button clicked!');
    }

    render() {
        var { isLoaded, city } = this.state;
        if (!isLoaded) {
          return <p>Loading ...</p>;
        }
        else{
            return (
            <div className="App">
                <Header />
                <p>City Name: {this.state.city}</p>
                <p>Weather: {this.state.weather}</p>
                <p>Average temperature: {this.state.temperature.value} {this.state.temperature.unit}</p>
                <p>Temperature Range:  {this.state.temperature.min} to {this.state.temperature.max} {this.state.temperature.unit}</p>
                <p>Humidity: {this.state.humidity}</p>
                <p>Pressure: {this.state.pressure}</p>
                <p>Wind: {this.state.windDirection}</p>
                <p>Wind Speed{this.state.windSpeed}</p>
                <p>Cloud: {this.state.clouds}</p>
                <p>Visibility: {this.state.visibility}</p>
                <p>Precipitation: {this.state.precipitation}</p>
                <p>Last Updated Time: {this.state.lastupdate}</p>
                <button onClick={this.refreshWeatherData}>
                    <span className="buttonText">Refresh Weather Information</span>
                </button>
            </div>
            );
        }
    }
}

export default App;

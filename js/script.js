"use strict";

(function() {
	const url = "http://api.openweathermap.org/data/2.5/weather?q=";
	const apiKey = "1c2a6ff5c40f6d0ab5fabcdea12a93fe"; // Replace "APIKEY" with your own API key; otherwise, your HTTP request will not work
	const activities = {
		teamIn: ['basketball','hockey','volleyball'],
		teamOutWarm: ['softball/baseball','football/soccer','American football','rowing','tennis','volleyball','ultimate frisbee','rugby'],
		teamOutCold: ['hockey'],
		soloIn: ['rock climbing','swimming','ice skating'],
		soloOutWarm: ['rowing','running','hiking','cycling','rock climbing'],
		soloOutCold: ['snowshoeing','downhill skiing','cross-country skiing','ice skating']
	}
	let state = {};
	let category = 'all';

	// get weather data when user clicks Forecast button, then add temp & conditions to view
	document.querySelector('.forecast-button').addEventListener('click', function(e){
		e.preventDefault();

		const location = document.querySelector('#location').value
		document.querySelector('#location').textContent = ''

		fetch(url + location + '&appid=' + apiKey).then(function(response){
			response.json().then(function(data){
				updateUISuccess(data)
			}).catch(function(err){
				updateUIFailure()
			})
		}).catch(function(error){
			updateUIFailure()
		})
	});

	// update list of sports when user selects a different category (solo/team/all)
	document.querySelectorAll('.options div').forEach(function(el){
		el.addEventListener('click', updateActivityList)
	})

	// handle ajax success
	function updateUISuccess(response) {
		const degC = response.main.temp - 273.15;
		const degCInt = Math.floor(degC);
		const degF = degC * 1.8 + 32;
		const degFInt = Math.floor(degF);
		state = {
			condition: response.weather[0].main,
			icon: "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
			degCInt: Math.floor(degCInt),
			degFInt: Math.floor(degFInt),
			city: response.name
		};

		const into = document.querySelector('.conditions')

		const cityP = document.createElement('p')
		cityP.setAttribute('class','city')
		cityP.textContent = state.city


		const conditionImg = document.createElement('img')
		conditionImg.setAttribute('src', state.icon)
		conditionImg.setAttribute('alt', state.condition)

		const conditionsP = document.createElement('p')
		conditionsP.textContent = `${state.degCInt} ${String.fromCharCode(176)}C / ${state.degFInt}${String.fromCharCode(176)}F`
		conditionsP.appendChild(conditionImg)

		const forecastDiv = document.createElement('div')
		forecastDiv.appendChild(cityP)
		forecastDiv.appendChild(conditionsP)

		//Clear previous results from the screen
		if(into.childNodes[0]){
			into.removeChild(into.childNodes[0])
		}
		
		into.appendChild(forecastDiv)

		// ReactDOM.render(<Forecast {...state} />, into);

		// function Forecast(props) {
		// 	return (
		// 		<div>
		// 			<p className="city">{props.city}</p>
		// 			<p>{props.degCInt}&#176; C / {props.degFInt}&#176; F <img src={props.icon} alt={props.condition} /></p>
		// 		</div>
		// 	)
		// }

		updateActivityList();
	}

	// handle selection of a new category (team/solo/all) 
	function updateActivityList(event) {

		if(event !== undefined && event.target.classList.contains('selected')){
			// if the 'event' parameter is defined, then a tab has been clicked; if not, then this is the
			//   default case and the view simply needs to be updated
			// if the clicked tab has the class 'selected', then no need to change location of 'selected' class
			//   or change the DOM
			return true;

		} else if(event !== undefined && !event.target.classList.contains('selected')){
			// if the 'event' parameter is defined, then a tab has been clicked
			// if the clicked tab does not have the class 'selected', then location of 'selected' class must be added
			//   to the clicked element and removed from its siblings
			category = event.target.id

			document.querySelectorAll('.options div').forEach(function(el){
				el.classList = []
			})

			event.target.classList.add('selected')
		} 

		state.activities = [];
		if (state.condition === "Rain") {
			updateState('In');
		} else if (state.condition === "Snow" || state.degFInt < 50) {
			updateState('OutCold');
		} else {
			updateState('OutWarm');
		}

		function updateState(type) {
			if (category === "solo") {
				state.activities.push(...activities['solo' + type]);
			} else if (category === "team") {
				state.activities.push(...activities['team' + type]);
			} else {
				state.activities.push(...activities['solo' + type]);
				state.activities.push(...activities['team' + type]);
			}
		}

		const into = document.querySelector('.activities')
		
		if(into.childNodes[0]){
			into.removeChild(into.childNodes[0])
		}

		const activitiesDiv = document.createElement('div')
		const activitiesList = document.createElement('ul')

		state.activities.forEach(function(activity, index){
			const listItem = document.createElement('li')
			listItem.setAttribute('key', index)
			listItem.textContent = activity
			activitiesList.appendChild(listItem)
		})

		activitiesDiv.appendChild(activitiesList)
		into.appendChild(activitiesDiv)


		$('.results').slideDown(300);
	}

	// handle ajax failure
	function updateUIFailure() {
		document.querySelector('.conditions').textContent = 'Weather information unavailable';
	}
})();
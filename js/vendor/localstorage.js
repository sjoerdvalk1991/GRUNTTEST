
// ----------------------------------------------------- //
// APP JS DEELTOETS 1 - SJOERD VALK

// De namespace zorgt ervoor dat je geen conflicten krijgt met eventuele andere javascript bestanden met dezelfde soort objecten.

var APP = APP || {};

(function() {

	APP.settings = {
		movieUrl : 'http://www.dennistel.nl/movies'
	}



	APP.controller = {
		init: function() {
			console.log ('kickoff app');
			APP.router.init(); // start de init methode van het router object
			APP.sections.init();
			if (APP.localStorage.getData('movies')) {
			APP.sections.movies();
			}else{
			APP.localStorage.init();
			}
			}							 // start de init methode van het sections object
		}


	APP.xhr = {
	trigger: function (type, url, success, data) {
		var req = new XMLHttpRequest;
		req.open(type, url, true);

		req.setRequestHeader('Content-type','application/json');

		type === 'POST' ? req.send(data) : req.send(null);

		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status === 200 || req.status === 201) {
					success(req.responseText);
				}
			}
		}
	}
}







	APP.moviecontent = {
		// DATA OBJECT MET 2 modules
		about: {
			title: "About this app",
			description: "All of the content on this app and the website has been requested directly by young people.  The Your Questions are real questions from real young people as are the words in the Sextionary – and therefore we believe they are valid aspects of the site."
		},

		movies: {
		}
	}


	APP.router = {
		init: function() {
			console.log("kickoff router"); // runs router function to initialize hashes
	
			routie({
				'about': function() {
					APP.sections.toggle('section[data-route="about"]'); // start de toggle met de geselecteerde section
					console.log('about pagina geladen');
				},
				'movies': function() {
					APP.sections.toggle('section[data-route="movies"]'); // start de toggle met de geselecteerde section
					console.log('moviespagina geladen');
				},

				'*': function() {
					APP.sections.toggle('section[data-route="movies"]'); // start de toggle met de geselecteerde section
					console.log('moviespagina geladen');
				}
			});
		}
	}

	APP.sections = {
		init: function() {
			console.log('kickoff sections');
			this.about(); // kickoff about section
		},
		about: function() {
			// selecteer de juiste section in de html als variabele
			var aboutSection = document.querySelector('section[data-route="about"]');
				// transparancy wordt aangeroepen om de data te koppelen aan de section in de html
			Transparency.render(aboutSection, APP.moviecontent.about) 
		},
		movies: function() {
			//selecteer de juiste section in de html als variabele
			var moviesSection = document.querySelector('[data-route=movies]');
			Transparency.render(moviesSection, APP.localStorage.data.movies, {
				cover: {
			// Dit zorgt ervoor dat de waarde van cover in het src="" attribuut terecht komt.
					src: function() {
						return this.cover;
				    }
			}
			});

		},

		toggle: function(section) {
			// voegt alle sections in de #content toe aan deze variabele
			var sections = document.querySelectorAll('#content section');
			// Loopt door alle sections in de HTML, daar wordt bij alle sections de class 'active' verwijderd
			for(i=0; i<sections.length; i++) {
				sections[i].classList.remove('active');
			}
			// show the current section by add class util function
			    document.querySelector(section).classList.add('active');
		}
	}



APP.localStorage = {

	data: { movies: '' },

	init: function(){

		this.getData();
		this.setData();
	},

	getData: function() {
		var _this = this;
		var jsonData = localStorage.getItem('movies');
			APP.xhr.trigger('GET', APP.settings.movieUrl, function(response){
				console.log(response);
				_this.data.movies = JSON.parse(response);

				APP.sections.movies();
			});
		},

	setData: function (response) {
		localStorage.getItem('movies', response);
	}

}



// APP.worker = {

// init: function(){

// this.newWorker();

// },

// newWorker: function(){

// var worker = new Worker('js/vendor/task.js');

// worker.addEventListener('message', function(e) {
//   console.log('Worker said: ', e.data);
// }, false);

// worker.postMessage('Hello World');

// }

// }

APP.controller.init(); // initialiseer de app - start de app

})();
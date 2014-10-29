
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

			APP.menu.init();
			APP.router.init(); // start de init methode van het router object
			APP.gestures.init();
			APP.sections.init();
			if (!(localStorage.getItem('movies'))) { //check of er data in localstorage zit zo niet start splashscreen en setdata
			APP.splashscreen.init();
			APP.localStorage.setData();
				console.log('Made a new data request');
			} else {

				APP.localStorage.getData();
				console.log('Got data from Local Storage');
			}

			// APP.localStorage.init();
			}							 // start de init methode van het sections object
	}

	//visualiseer dat de data moet worden opgehaald start een loader van 2 seconden
	APP.splashscreen = {
		init: function() {
			this.spinner();
			this.splashscreen();
		},
		splashscreen: function() {
			document.getElementById('splashscreen').classList.add('showsplashscreen');
			setTimeout(function(){
				document.getElementById('splashscreen').classList.add('hide');
			}, 2000);
		},
		spinner: function() {
			var target = document.getElementById('spinner');
			var spinner = new Spinner().spin(target);
		}
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
	//manipuleer de data en geef hem daarna  door aan de transparency
	APP.underscore = {
		dataManipulate: function () {
			//console.log(data);
			parsedData = APP.localStorage.data.movies;
			//console.log(parsedData);
			for (i = 0; i < parsedData.length; i++) {
				//console.log(parsedData[i].reviews);
										// _.map( function(num, key){ return num * 3; });
			    parsedData[i].reviews = _.map(parsedData[i].reviews, function(num, key) {
			    	//console.log(num);
				    return { 
				        reviewScore: num.score,
				    };
				});
				parsedData[i].reviews = _.reduce(parsedData[i].reviews, function(memo, num){
					var average = memo + num.reviewScore;
					console.log(memo + num.reviewScore);
					return average ;

				}, 0 ) / parsedData[i].reviews.length;



				// var scoreNumber = parseInt(parsedData[i].reviews);
				// console.log(scoreNumber);
				// //var rounded = Math.round(scoreNumber * 10) / 10;
				// var rounded = scoreNumber.toFixed(1);
				// console.log('afgerond',rounded);
				// parsedData[i].reviews = JSON.stringify(rounded); 
			}

				APP.sections.movies();
		},
		//Kijk welk genre is aangeklikt en geef films door aan de sections
		filter: function(genre) {
		// retrieve latest data
			var data = APP.localStorage.data.movies;

			// loop over data
			for (i = 0; i < data.length; i++) {
				var data = _.filter(data, function (data) {
					return _.contains(data.genres, genre);
				});
	        };
	        // send movies with data to transparancy
	        APP.sections.genre(data);
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
					APP.sections.toggle('section[data-route="about"]'); 
					document.querySelector('.mainnav').classList.remove('expand');// start de toggle met de geselecteerde section
					console.log('about pagina geladen');
				},
				'movies': function() {
					APP.sections.toggle('section[data-route="movies"]');
					document.querySelector('.mainnav').classList.remove('expand');
					console.log('moviespagina geladen');
				},

				 'movies/genre/:genre': function(genre){
				 	APP.sections.toggle('section[data-route="genre"]');
				 	APP.underscore.filter(genre);
		    	},

				 'movie/:id':function(id){
				 	APP.sections.movie(id-1);
				 	APP.sections.toggle('section[data-route="movie"]');
				 	console.log('moviepage');

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
			// console.log('testje');
			//selecteer de juiste section in de html als variabele
			document.querySelector('.mainnav').classList.remove('expand');
			var moviesSection = document.querySelector('[data-route=movies]');
			Transparency.render(moviesSection, APP.localStorage.data.movies, {

				cover: {
			// Dit zorgt ervoor dat de waarde van cover in het src="" attribuut terecht komt.
					src: function() {
						return this.cover;
				    }

				},

				link: {

					href: function() {
						return "#movie/" + this.id;

					}
				},

				reviewScore: {

					text: function(){
						var reviewScore = Math.round(this.reviews * 10) / 10;
						if (isNaN(reviewScore)) {
							console.log('nan');
							return '-';
						}

						else{
						return reviewScore;
						}
					}
				}



			});


		},

		movie: function(id) {

			var movieSection = document.querySelector('[data-route=movie]');

			Transparency.render(movieSection, APP.localStorage.data.movies[id], {



				cover: {
			// Dit zorgt ervoor dat de waarde van cover in het src="" attribuut terecht komt.
					src: function() {
						return this.cover;
				    }

				 },

			 	text: function(){
					var reviewScore = Math.round(this.reviews * 10) / 10;
					if (isNaN(reviewScore)) {
						console.log('nan');
						return '-';
					}
				},

				actors: {
				url_photo: {
					src: function() {
						return this.url_photo;
					}
				},
				urlprof: {
					href: function() {
						return this.url_profile;
					}
				},
			}


			});



		},

		genre: function(data) {
			document.querySelector('.genres').classList.remove('expand');
			var moviesSection = document.querySelector('[data-route=genre]');
			console.log();
			Transparency.render(moviesSection, data, {
			// directive for setting cover value in src attribute
				cover : {
					src: function() {
						return this.cover;
						}
					},

				
				link: {

					href: function() {
						return "#movie/" + this.id;

					}
				},

				reviewScore: {

					text: function(){
						var reviewScore = Math.round(this.reviews * 10) / 10;
						if (isNaN(reviewScore)) {
							console.log('nan');
							return '-';
						}

						else{
						return reviewScore;
						}
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
					var data = JSON.parse(jsonData);
					_this.data.movies = data
					APP.underscore.dataManipulate();
			},

		setData: function (response) {
			var _this = this;
			APP.xhr.trigger('GET', APP.settings.movieUrl, function(response){
			_this.data.movies = JSON.parse(response);
			localStorage.setItem('movies', response);
			APP.underscore.dataManipulate();
			});

		}
	}

	APP.menu = {

		init: function (){
			APP.menu.filter();
			APP.menu.mainnav();
		},

		filter: function(){
			var menuButton =  document.querySelector('.menu-button');
			menuButton.onclick = APP.menu.expandFilter;

		},

		mainnav: function () {
			var menuButton =  document.querySelector('.main-menu');
			menuButton.onclick = APP.menu.expandMain;	
		},

		expandFilter: function () {

			console.log('menuexpand');
			document.querySelector('.genres').classList.toggle('expand');
			document.querySelector('.mainnav').classList.remove('expand');
		},

		expandMain: function () {
			console.log('menuexpand');
			document.querySelector('.mainnav').classList.toggle('expand');
			document.querySelector('.genres').classList.remove('expand');
		}
	}


	APP.gestures = {
		init: function(){
		 var elementPage = document.querySelector('.section');
	            Hammer(elementPage).on("swipeleft", function(event) {
	              console.log('test');
	              APP.menu.expandFilter();
	              document.querySelector('.mainnav').classList.remove('expand');

	            });
	  
	            Hammer(elementPage).on("swiperight", function(event) {
	            	APP.menu.expandMain();
	            	document.querySelector('.genres').classList.remove('expand');
	            });

	            
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
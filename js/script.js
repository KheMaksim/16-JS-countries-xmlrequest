const form = document.querySelector('form');
const text = document.querySelector('#search__area');
const btn = document.querySelector('#search__btn');
const container = document.querySelector('.info__container');
const loader = document.querySelector('#preloader');

const request = (config) => {
	const xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function () {
		if (this.status >= 200 && this.status <= 300) {
			config.success(this.responseText)
		}
		else {
			config.error(this.status);
		}
	});
	xhr.addEventListener('error', function () {
		config.error('No internet connection!');
	});
	xhr.addEventListener('timeout', function () {
		config.error('Time is out.');
	});
	xhr.open(config.method, config.url);
	xhr.send();
}
const dictionary = {
	name: 'Наименование: ',
	topLevelDomain: 'Домен верхнего уровня: ',
	alpha2Code: 'Двубуквенный код страны: ',
	alpha3Code: 'Трехбуквенный код страны: ',
	callingCodes: 'Код страны для вызова: ',
	capital: 'Столица: ',
	altSpellings: 'Альтернативное написание: ',
	subregion: 'Подрегион: ',
	region: 'Регион: ',
	population: 'Население: ',
	latlng: 'Координаты местоположения страны: ',
	demonym: 'Национальность: ',
	area: 'Площадь: ',
	gini: 'Коэффициент Джинни (неравенства доходов в стране): ',
	timezones: 'Часовые пояса: ',
	borders: 'Граничащие страны: ',
	nativeName: 'Официальное название страны на её родном языке: ',
	numericCode: 'Трёхзначный код страны: ',
	currencies: 'Национальная валюта: ',
	languages: 'Языки: ',
	translations: 'Перевод страны на разные языки мира: ',
	regionalBlocs: 'Региональные блоки: ',
	cioc: 'Трёхбуквенный код, присвоенный каждой стране Международным олимпийским комитетом (МОК): ',
	independent: 'Независимость: ',
}

const addFn = (firstParent, secondParent, value) => {
	firstParent.append(value)
	secondParent.append(firstParent);
}

form.addEventListener('submit', function (e) {
	e.preventDefault();
	loader.style.display = 'block';
	request({
		method: 'GET',
		url: `https://restcountries.com/v2/name/${(text.value).toLowerCase()}`,
		success: (data) => {
			container.innerHTML = '';
			const country = JSON.parse(data);
			const info = document.createElement('div');
			info.classList.add('info');
			for (const key in country[0]) {
				const paragraph = document.createElement('p');
				paragraph.classList.add('info__title');
				loader.style.display = 'none';
				if (country[0][key] === true) {
					addFn(paragraph, info, `${dictionary[key]} Имеется`);
				}
				else if (country[0][key] === false) {
					addFn(paragraph, info, `${dictionary[key]} Не имеется`)
				}
				else if (key === "flag") {
					const image = document.createElement('img');
					image.classList.add('info__image');
					image.setAttribute('src', country[0][key]);
					paragraph.append(`Флаг: `);
					addFn(paragraph, info, image);
				}
				else if (dictionary[key] === undefined) {
					continue;
				}
				else if (Array.isArray(country[0][key])) {
					if (typeof country[0][key][0] === 'object') {
						paragraph.append(`${dictionary[key]}`)
						for (const iterator of country[0][key]) {
							for (const item in iterator) {
								addFn(paragraph, info, `${iterator[item]}, `);
							}
						}
					}
					else {
						addFn(paragraph, info, `${dictionary[key]} ${country[0][key].join(', ')}`);;
					}
				}
				else if (typeof country[0][key] === 'object') {
					paragraph.append(`${dictionary[key]} `)
					for (const item in country[0][key]) {
						addFn(paragraph, info, `${country[0][key][item]}, `);
					}
				}
				else {
					addFn(paragraph, info, `${dictionary[key]} ${country[0][key]}`);
				}
			}
			container.append(info);
		},
		error: (errorType) => {
			loader.style.display = 'none';
			alert('You are intered a wrong country name!');
			console.error(errorType);
		}
	})
});
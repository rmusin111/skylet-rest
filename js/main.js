/* -------IBG------- */
function ibg(){
    let ibg=document.querySelectorAll(".ibg");
    for (var i = 0; i < ibg.length; i++) {
    if(ibg[i].querySelector('img')){
    ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
    }}};
    ibg();
/* -------IBG END------- */
/* -------scrolling------- */
var linkNav = document.querySelectorAll('[href^="#"]'), //выбираем все ссылки к якорю на странице
    V = 0.3;  // скорость, может иметь дробное значение через точку (чем меньше значение - тем больше скорость)
for (var i = 0; i < linkNav.length; i++) {
    linkNav[i].addEventListener('click', function(e) { //по клику на ссылку
        e.preventDefault(); //отменяем стандартное поведение
        var w = window.pageYOffset,  // производим прокрутка прокрутка
			hash = this.href.replace(/[^#]*(.*)/, '$1');  // к id элемента, к которому нужно перейти
			if (window.innerWidth <= 700) {
				t = document.querySelector(hash).getBoundingClientRect().top - 70,  // отступ от окна браузера до id
            start = null;
			}
			else{
				t = document.querySelector(hash).getBoundingClientRect().top - 118,  // отступ от окна браузера до id
				start = null;
			}
        requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
        function step(time) {
            if (start === null) start = time;
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
            window.scrollTo(0,r);
            if (r != w + t) {
                requestAnimationFrame(step)
            }
        }
    }, false);
}
/* -------scrolling end------- */
/* -------burger and menu-------*/
jQuery('.icon-menu').click(function(){
	if (jQuery('.icon-menu').hasClass('icon-menu--active') && jQuery('.menu__body').hasClass('.menu__body--active')) {
		jQuery('.icon-menu').toggleClass('icon-menu--active');
		jQuery('.menu__body').toggleClass('menu__body--active');
	}
	else{
		jQuery('.icon-menu').toggleClass('icon-menu--active');
		jQuery('.menu__body').toggleClass('menu__body--active');
	}
	
});
jQuery('.menu__link').click(function(){
	jQuery('.icon-menu').removeClass('icon-menu--active');
	jQuery('.menu__body').removeClass('menu__body--active');
});
/* -------burger and menu end------- */
/* -------modalBox------- */
jQuery('.consult').click(function(){
	jQuery('.modal').toggleClass('modal--active');
});
jQuery('.modal-close').click(function(){
	if (jQuery('.modal').hasClass('modal--active')) {
		jQuery('.modal').toggleClass('modal--active');
	}
});
jQuery('.btn-ok').click(function(){
	jQuery('.modal-message').toggleClass('modal-message--active');
});
/* -------modalBox end -------*/
/* -------input[type = 'file'] -------*/
var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function (input) {
  var label = input.nextElementSibling,
    labelVal = label.innerHTML;
  input.addEventListener('change', function (e) {
    var fileName = '';
    if (this.files && this.files.length > 1)
      fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
    else
      fileName = e.target.value.split('\\').pop();
    if (fileName)
      label.querySelector('span').innerHTML = fileName;
    else
      label.innerHTML = labelVal;
  });
});
/* -------input[type = 'file'] end -------*/
/* -------slider------- */
/* new BeerSlider( document.getElementById( "work-slider-one" ) );
new BeerSlider( document.getElementById( "work-slider-two" ) );
new BeerSlider( document.getElementById( "work-slider-three" ) );
new BeerSlider( document.getElementById( "work-slider-four" ) ); */
jQuery.fn.BeerSlider = function ( options ) {
    options = options || {};
    return this.each(function() {
      new BeerSlider(this, options);
    });
  };
jQuery('.beer-slider').BeerSlider();
/* -------slider end------- */
/* -------dynamic adaptive-------*/
"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
/* -------dynamic adaptive end------- */
/* -------yandex map------- */
 // Функция ymaps.ready() будет вызвана, когда
    // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map("map", {
            center: [48.034477, 37.968443],
            zoom: 17
        });
    myMap.geoObjects
        .add(new ymaps.Placemark([48.034477, 37.968443], {
            balloonContent: 'г.Макеевка ул. Свердлова 25',
            iconCaption: 'мебельная фабрика "Скайлет"'
        }, {
            preset: 'islands#icon',
            iconColor: '#08c5d1'
        }));
    myMap.controls.remove('rulerControl');
    myMap.controls.remove('trafficControl');
}
/* -------yandex map end------- */
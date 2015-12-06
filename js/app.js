window.onload = function () {
	
	var canvasEl = document.getElementById('canvas-app'),
			ctx = canvasEl.getContext('2d'),
			// -------- Доработать взятие размеров экрана у IE 8- ----------------
			pageWidth = document.documentElement.clientWidth,
			pageHeight = document.documentElement.clientHeight,
			centerX = pageWidth / 2,
			centerY = pageHeight / 2,
			arrOfDots = [],
			interv, 
			interv2,
			randomMin = 50,
			randomMax = 250,
			dotsCount = 8000,
			dotsSize = 70,
			mouseCoordX = 0,
			mouseCoordY = 0, 
			state = 0,
			parallaxSize = 2,
			parallaxMultiplier = randomMin * parallaxSize,
			pageWidthOverall = pageWidth * parallaxSize,
			pageHeightOverall = pageHeight * parallaxSize;
	
	canvasEl.width = pageWidth;
	canvasEl.height = pageHeight;
	
	ctx.strokeStyle = '#fff';
	ctx.fillStyle = '#fff';
	
	// Ниже должны быть первые координаты мыши вместо центра
	ctx.translate(-centerX, -centerY);
	
	function randomMinMax(min, max) { 
		return Math.random() * (max - min) + min; 
	}
	
	
	// ----- Отрисовка точек ----
	
	(function () {
		
		// шаблон цикла for из книги Стояна Стефанова "Javacript Шаблоны"
		for ( dotsCount; dotsCount--; ) {
			
			var randDotX = Math.floor(Math.random() * pageWidthOverall),
					randDotY = Math.floor(Math.random() * pageHeightOverall),
					coefficient = 1 / randomMinMax(randomMin, randomMax),
					distance;
			
			
			// В массив arrOfDots попадают данные для точек: 
			//   под индексом 0 записывается позиция по х - randDotX
			//   под индексом 1 записывается позиция по у - randDotY
			//   под индексом 2 записывается коэфициент coefficient, который отображает скорость множитель скорости движения точки, а так же множителем размера точки, так как мы принимаем что если точка(звезда) быстро двигается, значит она находится близко к наблюдателю, следовательно кажется ему большей
			arrOfDots.push([randDotX, randDotY, coefficient]);
			ctx.fillRect(randDotX,randDotY, dotsSize * coefficient, dotsSize * coefficient)
			
		}
	
	})();
	/*
	(function () {
		var hrFirst = document.getElementById('hr-header'),
				hrLast = document.getElementById('hr-header-last'),
				counter = 45;
		
		interv2 = setInterval(function () {
			
			if (counter >= 20) {
				hrFirst.style.top = counter + '%';
				hrLast.style.bottom = counter + '%';
				console.log(hrFirst.style.top);
			}
			
			if (counter <= 20) {
				var bla = document.getElementById('header-letter-3');
				bla.style.trans = 'transition: color 0.2s ease-out;';
			}
			
			counter -= 2;
			
		}, 16);
		
	})();
	*/
	
	function moveDots() {
		ctx.clearRect(0, 0, pageWidthOverall, pageHeightOverall);
		arrOfDots.forEach(function(item, i) {
			
			if (mouseCoordX === 0 && mouseCoordY === 0) {
				// --- Здесь вместо parallaxSize нужно будет подставить первое значение координаты точки мыши ---
				item[0] += (item[0] - centerX * parallaxSize) * item[2];
				item[1] += (item[1] - centerY * parallaxSize) * item[2];
			} else {
				item[0] += (item[0] - mouseCoordX * parallaxSize ) * item[2];
				item[1] += (item[1] - mouseCoordY * parallaxSize) * item[2];
			}
			
			if (item[0] > pageWidthOverall || item[1] > pageHeightOverall) {
				// Доделать генерацию точек с учётом уменьшьшения области просмотра
				arrOfDots.splice(i, 1, [Math.floor(Math.random() * pageWidthOverall), Math.floor(Math.random() * pageHeightOverall), 1 / randomMinMax(randomMin, randomMax)]);
			}
			
			ctx.fillRect(item[0],item[1], dotsSize * item[2], dotsSize * item[2]);
				
		});
	}
	
	function movingForward() {
		interv = setInterval(moveDots, 16);
	};
	
	function stopMoving() { 
		clearInterval(interv); 
	};
	
	function parallax(e) {
		ctx.clearRect(0, 0, pageWidthOverall, pageHeightOverall);
		if (state === 0) {
			arrOfDots.forEach(function(item, i) {
				//item[0] = item[0] + mouseCoordX * item[2] * 100 - mouseCoordX;
				//item[1] = item[1] + mouseCoordY * item[2] * 100 - mouseCoordY;
				item[0] = item[0] + mouseCoordX * item[2] * parallaxMultiplier;
				item[1] = item[1] + mouseCoordY * item[2] * parallaxMultiplier;
				
				//arrOfDots.push([randDotX, randDotY, coefficient]);
				ctx.fillRect(item[0], item[1], dotsSize * item[2], dotsSize * item[2]);
			});
			state += 1;
		} else {
			arrOfDots.forEach(function(item, i) {
				//item[0] = item[0] - (e.clientX - mouseCoordX) * item[2] * 100 + e.clientX - mouseCoordX;
				//item[1] = item[1] - (e.clientY - mouseCoordY) * item[2] * 100 + e.clientY - mouseCoordY;
				item[0] = item[0] - (e.clientX - mouseCoordX) * item[2] * parallaxMultiplier;
				item[1] = item[1] - (e.clientY - mouseCoordY) * item[2] * parallaxMultiplier;
				
				ctx.fillRect(item[0], item[1], dotsSize * item[2], dotsSize * item[2]);
			});
		}
		
		// -- lastCoords --
		mouseCoordX = e.clientX;
		mouseCoordY = e.clientY;
	}
	
	/*
	function parallax(e) {
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		arrOfDots.forEach(function(item, i) {
			item[0] -= (e.clientX - centerX) * item[2];
			item[1] -= (e.clientY - centerY) * item[2];
			
			
			ctx.fillRect(item[0], item[1], 0.5, 0.5);
		});
	}
	*/
	
	
	
	canvasEl.addEventListener('mousedown', movingForward, false);
	
	canvasEl.addEventListener('mouseup', stopMoving, false);
	
	canvasEl.addEventListener('mousemove', parallax, false);
	
	
};
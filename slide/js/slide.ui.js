Slide.proto.fetch = function(url, cb) {
	const xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			try {
				var response = JSON.parse(xmlhttp.responseText);
			} catch (err) {
				console.warn(err.message + " in " + xmlhttp.responseText);
				return;
			}
			cb(response);
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

Slide.proto.showLoadingState = function(status) {
	if (this.loader) {
		if (status) {
			this.loader.classList.remove("slide__is-hidden");
		} else {
			this.loader.classList.add("slide__is-hidden");
		}
	}
};

Slide.proto.addSlide = function(slide) {
	this.parent.appendChild(slide);
};

Slide.proto.makeSlide = function(slide, id) {
	slide.setAttribute("class", "slide__item");
	slide.setAttribute("id", this.name + "-" + id);
	return slide;
};

Slide.proto.addImage = function(img, cb) {
	this.makeSlide(img, this.countChildren());
	this.addSlide(img);
	img.onload = cb;
};

Slide.proto.makeImage = function(src) {
	const img = document.createElement("img");
	img.setAttribute("src", src);
	return img;
};

Slide.proto.onClick = function(element, fn) {
	element.addEventListener("click", fn);
};

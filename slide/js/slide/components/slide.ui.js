Slide.proto({
	fetch: function(url, cb) {
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
	},

	showLoadingState: function(status) {
		if (this.loader) {
			if (status) {
				this.loader.classList.remove("slide__is-hidden");
			} else {
				this.loader.classList.add("slide__is-hidden");
			}
		}
	},

	addSlide: function(slide) {
		this.parent.appendChild(slide);
	},

	makeSlide: function(slide, id) {
		slide.setAttribute("class", "slide__item");
		slide.setAttribute("id", this.name + "-" + id);
		return slide;
	},

	addImage: function(img, cb) {
		this.makeSlide(img, this.countChildren());
		this.addSlide(img);
		img.onload = cb;
	},

	makeImage: function(src) {
		const img = document.createElement("img");
		img.setAttribute("src", src);
		return img;
	}
});

const alpha = document.querySelector(".slide--alpha");
const carousel = Slide.into(
	alpha.querySelector(".slide__into"),
	{
		loader: alpha.querySelector(".slide__load"),
		nextButton: alpha.querySelector(".slide__next"),
		prevButton: alpha.querySelector(".slide__prev"),
		addButton: alpha.querySelector(".slide__add"),
		playButton: alpha.querySelector(".slide__play"),
		pauseButton: alpha.querySelector(".slide__pause"),
		thumbnails: alpha.querySelector(".slide__thumbnails")
	},
	function() {
		const self = this;

		self.setDelay(4999);

		console.log(self.getDelay());

		self.prevButton.addEventListener("click", function() {
			self.prev();
		});

		self.nextButton.addEventListener("click", function() {
			self.next();
		});

		self.playButton.addEventListener("click", function() {
			self.play();
		});

		self.pauseButton.addEventListener("click", function() {
			self.pause();
		});

		self.addButton.addEventListener("click", function() {
			self.addKitty();
		});

		self.thumbnails.addEventListener("click", function(event) {
			event.preventDefault();
			const thumbnail = event.target;
			const index = parseInt(thumbnail.dataset.slideIndex);
			self.goto(index);
		});

		self.watch(function(index) {
			console.log("watch", index);
			self.selectThumbnail(index);
		});

		return this;
	}
);

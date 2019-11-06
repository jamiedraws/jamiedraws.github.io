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

		self.onClick(self.prevButton, function() {
			self.prev();
		});

		self.onClick(self.nextButton, function() {
			self.next();
		});

		self.onClick(self.playButton, function() {
			self.play();
		});

		self.onClick(self.pauseButton, function() {
			self.pause();
		});

		self.onClick(self.addButton, function() {
			self.addKitty();
		});

		self.onClick(self.thumbnails, function(event) {
			event.preventDefault();
			const thumbnail = event.target;
			const index = parseInt(thumbnail.dataset.slideIndex);
			self.goto(index);
		});

		self.watch(function(index, finish) {
			self.selectThumbnail(index);
			finish();
		});

		return this;
	}
);

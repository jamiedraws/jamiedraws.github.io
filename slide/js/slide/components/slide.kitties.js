Slide.proto({
	addKitties: function(amount) {
		for (let i = 0; i < amount; i++) {
			this.addKitty();
		}
	},

	addKitty: function(cb) {
		const self = this;
		const url = "https://api.thecatapi.com/v1/images/search?size=full";

		self.showLoadingState(true);
		self.fetch(url, function(response) {
			const slideImage = self.makeImage(response[0].url);
			const thumbnailImage = self.makeImage(response[0].url);

			self.addThumbnailImage(thumbnailImage);
			self.addImage(slideImage, function() {
				self.showLoadingState(false);
				self.handleCallback(cb);
			});
		});
	},

	handleCallback: function(cb) {
		if (typeof cb === "function") {
			cb();
		}
	}
});

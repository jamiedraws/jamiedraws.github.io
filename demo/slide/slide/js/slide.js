(function(global) {
	const generate = function(properties, o) {
		return Object.defineProperties(o || {}, properties);
	};

	const slide = generate({
		rules: {
			value: generate({
				delay: {
					value: 5000
				},
				noScroll: {
					value: "slide__into--no-scroll"
				}
			})
		},
		team: {
			value: []
		},
		request: {
			value: function(id) {
				return this.team[id];
			}
		},
		observer: {
			value: function(parent, children, cb) {
				if ("IntersectionObserver" in window) {
					const io = new IntersectionObserver(
						function(entries) {
							entries.forEach(function(entry) {
								if (entry.intersectionRatio > 0 && entry.isIntersecting) {
									const items = [].slice.call(children);
									const index = items.indexOf(entry.target);
									cb(index);
								}
							});
						},
						{
							root: parent,
							rootMargin: "0px",
							threshold: 0.9
						}
					);

					return function(children) {
						const length = children.length;
						for (var i = 0; i < length; i++) {
							io.observe(children[i]);
						}
					};
				} else {
					return function() {
						const noScroll = slide.rules.noScroll;
						this.shim = true;
						this.parent.classList.add(noScroll);
					};
				}
			}
		},
		manager: {
			value: generate({
				create: {
					value: function(api, id, parent, config) {
						const self = Object.create(api);

						Object.defineProperties(self, {
							name: {
								set: function(parent) {
									this.parent = parent;
								},
								get: function() {
									return this.parent.id;
								}
							},
							id: {
								value: id
							}
						});

						self.name = parent;

						if (typeof config === "object") {
							for (var option in config) {
								self[option] = config[option];
							}
						}

						return self;
					}
				},
				assign: {
					value: function() {
						const self = Object.create(this);

						self.index = 0;
						self.shim = false;
						self.auto = false;
						self.timer = undefined;
						self.delay = slide.rules.delay;

						return self;
					}
				},
				observer: {
					value: function(parent, children) {
						const self = this;
						return slide.observer(parent, children, function(index) {
							self.setIndex(index);
							self.setCallback();
						});
					}
				},
				setIndex: {
					value: function(index) {
						const children = this.children.length;

						if (typeof index === "number") {
							this.index = index;
						}

						if (this.index === children) {
							this.index = 0;
						} else if (this.index < 0) {
							this.index = children - 1;
						}
					}
				},
				setRotation: {
					value: function() {
						const slide = this.children[this.index];
						slide.scrollIntoView();
					}
				},
				setDelay: {
					value: function(time) {
						const illegal =
							typeof time !== "number" || time < slide.rules.delay;
						if (illegal) {
							time = this.delay;
						}

						this.delay = time;
					}
				},
				setCallback: {
					value: function() {
						if (typeof this.handleCallback === "function") {
							this.handleCallback(this.index);
						}
					}
				},
				setTimer: {
					value: function(cb) {
						if (this.auto) {
							this.timer = setTimeout(cb, this.delay);
						} else {
							clearTimeout(this.timer);
						}
					}
				},
				setShim: {
					value: function(cb) {
						if (this.shim) {
							this.setCallback(cb);
						} else {
							cb();
						}
					}
				},
				setTask: {
					value: function(index) {
						const self = this;

						self.setDelay();
						self.setIndex(index);
						self.setRotation();
						self.setShim(function() {
							self.setTimer(function() {
								self.setTask(self.index + 1);
							});
						});
					}
				}
			})
		},
		api: {
			value: generate({
				parent: {
					set: function(parent) {
						if (typeof parent !== "object") {
							throw "ERR-E :: The passed 'parent' must be an element.";
						}
						if (parent === null) {
							throw "ERR-P :: The passed 'parent' could not be found.";
						}
						if (parent.nodeType !== 1) {
							throw "ERR-N :: The passed 'parent' is not an element.";
						}

						const worker = slide.request(this.id);

						worker.parent = parent;
						worker.observe = worker.observer(worker.parent, parent.children);

						this.children = parent.children;
					},
					get: function() {
						const worker = slide.request(this.id);
						return worker.parent;
					}
				},
				children: {
					set: function() {
						const worker = slide.request(this.id);
						worker.children = worker.parent.children;
						worker.observe(worker.children);
					},
					get: function() {
						const worker = slide.request(this.id);
						return worker.children;
					}
				},
				isAuto: {
					value: function() {
						const worker = slide.request(this.id);
						return worker.auto;
					}
				},
				watch: {
					value: function(task) {
						const worker = slide.request(this.id);
						worker.handleCallback = task.bind(this);
					}
				},
				countChildren: {
					value: function() {
						return this.children.length;
					}
				},
				getDelay: {
					value: function() {
						const worker = slide.request(this.id);
						return worker.delay;
					}
				},
				setDelay: {
					value: function(delay) {
						const worker = slide.request(this.id);
						worker.setDelay(delay);
					}
				},
				play: {
					enumerable: true,
					value: function() {
						const worker = slide.request(this.id);
						this.pause();
						worker.auto = true;
						worker.setTask(worker.index + 1);
					}
				},
				pause: {
					enumerable: true,
					value: function() {
						const worker = slide.request(this.id);
						worker.auto = false;
						clearTimeout(worker.timer);
					}
				},
				prev: {
					enumerable: true,
					value: function() {
						const worker = slide.request(this.id);
						this.pause();
						worker.setTask(worker.index - 1);
					}
				},
				next: {
					enumerable: true,
					value: function() {
						const worker = slide.request(this.id);
						this.pause();
						worker.setTask(worker.index + 1);
					}
				},
				goto: {
					enumerable: true,
					value: function(index) {
						if (typeof index !== "number") {
							throw "ERR-X :: The passed 'index' is not a number.";
						}

						const worker = slide.request(this.id);
						this.pause();
						worker.setIndex(index);
						worker.setTask();
					}
				}
			})
		},
		interface: {
			value: generate({
				into: {
					value: function(parent, init, app) {
						const worker = slide.manager.assign();
						let task, options;
						slide.team.push(worker);

						if (typeof init === "function") {
							task = init;
						}

						if (typeof init === "object") {
							task = app;
							options = init;
						} else if (typeof app === "object") {
							options = app;
						} else {
							options = {};
						}

						const ui = slide.manager.create(
							slide.api,
							slide.team.length - 1,
							parent,
							options
						);

						return task.call(ui);
					}
				},
				proto: {
					value: function(parameters) {
						Object.create(slide.api, parameters);
						Object.keys(parameters).forEach(function(parameter) {
							Object.defineProperty(slide.api, parameter, {
								writable: false,
								configurable: false,
								enumerable: true,
								value: parameters[parameter]
							});
						});
					}
				}
			})
		}
	});

	if (typeof global.Slide !== "object") {
		Object.defineProperty(global, "Slide", {
			value: slide.interface,
			writable: false,
			configurable: false
		});
	} else {
		throw "ERR-S :: The 'Slide' feature has already been evaluated.";
	}
})(window);

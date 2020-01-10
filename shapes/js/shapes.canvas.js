(function(global) {
    const shapes = function() {
        /**
         * Sets canvas stage data for user to work with.
         */
        const stage = {
            x: undefined,
            y: undefined,
            width: global.innerWidth,
            height: global.innerHeight
        };

        /**
         * Sets the shape's properties.
         * @param {object} options user options.
         * @return {object} properties of the shape.
         */
        const data = function(options) {
            const r = Math.random() * 3 + 1;
            const v = options.setVelocity || 5;
            return {
                r: r,
                x: setCoordinates(stage.width, r),
                y: setCoordinates(stage.height, r),
                dx: setVelocity(v),
                dy: setVelocity(v),
                color: getColor(options.colors),
                minRadius: r,
                maxRadius: maxRadius(options.maxRadius || 40)
            };
        };

        /**
         * Stores references to all shape datasets.
         */
        const store = [];

        /**
         * Adds a dataset for the shape to a store array.
         * @param {object} data properties of the shape.
         */
        const add = function(data) {
            store.push(data);
        };

        /**
         * Sets the coordinate on the canvas.
         * @param {number} dimension width or height of the canvas.
         * @param {number} radius radius of the arc.
         * @return {number} coordinate on the canvas.
         */
        const setCoordinates = function(dimension, radius) {
            return Math.random() * (dimension - radius * 2) + radius;
        };

        /**
         * Sets a random velocity number.
         * @param {number} factor multiplies the velocity value.
         * @return {number} random velocity number.
         */
        const setVelocity = function(factor) {
            return (Math.random() - 0.5) * factor;
        };

        /**
         * Determine if the shape is out of the canvas.
         * @param {number} axis x or y axis of the canvas.
         * @param {number} radius radius of the arc.
         * @param {number} dimension width or height of the canvas.
         * @return {boolean} whether the shape is out of the canvas.
         */
        const isOutOfCanvas = function(axis, radius, dimension) {
            return axis + radius > dimension || axis - radius < 0
                ? true
                : false;
        };

        /**
         * Controls the shape's position on the canvas.
         * @param {object} data the shape properties.
         */
        const moveShape = function(data) {
            if (isOutOfCanvas(data.x, data.r, stage.width)) {
                data.dx = -data.dx;
            }

            if (isOutOfCanvas(data.y, data.r, stage.height)) {
                data.dy = -data.dy;
            }

            data.x = data.x + data.dx;
            data.y = data.y + data.dy;
        };

        /**
         * Updates the shape on the canvas.
         * @param {function} shape drawing of the shape.
         * @param {object} data properties of the shape.
         * @param {object} context the canvas context.
         */
        const updateShape = function(shape, data, context) {
            moveShape(data);
            interact(data);
            shape(data, context);
        };

        /**
         * Randomizes a decimal number.
         * @param {number} x number multiplies by random value.
         * @return {number} a random decimal number.
         */
        const getDecimal = function(x) {
            return Math.random() * x;
        };

        /**
         * Randomizes a whole number.
         * @param {number} x number rounds down from random value.
         * @return {number} round down whole number.
         */
        const getInteger = function(x) {
            return Math.floor(getDecimal(x));
        };

        /**
         * Randomizes a RGBA color.
         * @return {string} CSS rgba value.
         */
        const getRGBA = function() {
            return `rgba(
                ${getInteger(255)},
                ${getInteger(255)},
                ${getInteger(255)},
                ${getDecimal(1)}
            )`;
        };

        /**
         * Gets a color value.
         * @param {string} colors single color value.
         * @param {object} colors array of string color values.
         * @return {string} single color value.
         */
        const getColor = function(colors) {
            if (typeof colors === "string") {
                return colors;
            } else if (typeof colors === "object") {
                return colors[Math.floor(Math.random() * colors.length)];
            } else {
                return getRGBA();
            }
        };

        /**
         * Determines if the shape is in proximity of the cursor.
         * @param {number} axis x or y axis of the canvas.
         * @param {number} stage x or y coordinate of the stage object.
         * @return {boolean} whether the shape is in proximity of the cursor.
         */
        const isShapeInProximity = function(axis, stage) {
            return stage - axis < 50 && stage - axis > -50 ? true : false;
        };

        /**
         * Augments the shape properties on user interaction.
         * @param {object} data properties of the shape.
         */
        const interact = function(data) {
            if (
                isShapeInProximity(data.x, stage.x) &&
                isShapeInProximity(data.y, stage.y)
            ) {
                if (data.r < data.maxRadius) {
                    data.r = data.r + 1;
                }
            } else if (data.r > data.minRadius) {
                data.r = data.r - 1;
            }
        };

        /**
         * Sets a min value of the shape's radius.
         * @param {number} radius radius of the arc.
         * @return {number} min value of the radius.
         */
        const minRadius = function(radius) {
            return radius < 2 ? 2 : radius;
        };

        /**
         * Sets a max value of the shape's radius.
         * @param {number} radius radius of the arc.
         * @return {number} max value of the radius.
         */
        const maxRadius = function(radius) {
            return radius > 40 ? 40 : radius;
        };

        /**
         * Refreshes the shape on canvas on each animation frame.
         * @param {function} shape drawing of the shape.
         * @param {object} context the canvas.
         */
        const animateShape = function(shape, context) {
            requestAnimationFrame(animateShape.bind(this, shape, context));
            context.clearRect(0, 0, stage.width, stage.height);
            store.forEach(function(data) {
                updateShape(shape, data, context);
            });
        };

        /**
         * Iterates over a set quantity and performs a task.
         * @param {object} options user options.
         * @param {function} callback callback function.
         */
        const cycle = function(options, callback) {
            const o = options || {};
            const q = o.quantity || 1;
            for (let i = 0; i < q; i++) {
                callback(data(o));
            }
        };

        /**
         * Initializes the shape animation on the canvas.
         * @param {object} canvas the canvas.
         * @param {function} shape drawing of the shape.
         * @param {object} options user options.
         */
        const init = function(canvas, shape, options) {
            const context = canvas.getContext("2d");

            cycle(options, add);
            animateShape(shape, context);

            return function(init) {
                init(canvas, stage);
            };
        };

        return init;
    };

    global.Shapes = shapes();
})(window);

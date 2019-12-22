(function(global) {
    const shapes = function() {
        let width = global.innerWidth,
            height = global.innerHeight;

        const stage = function(dimension, radius) {
            return Math.random() * (dimension - radius * 2) + radius;
        };

        const velocity = function(factor) {
            return (Math.random() - 0.5) * factor;
        };

        const out = function(axis, radius, dimension) {
            return axis + radius > dimension || axis - radius < 0
                ? true
                : false;
        };

        const mouse = {
            x: 0,
            y: 0
        };

        global.addEventListener("mousemove", function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        global.addEventListener("touchmove", function(event) {
            mouse.x = event.touches[0].pageX;
            mouse.y = event.touches[0].pageY;
        });

        global.addEventListener("resize", function() {
            width = global.innerWidth;
            height = global.innerHeight;
        });

        const move = function(data) {
            if (out(data.x, data.r, width)) {
                data.dx = -data.dx;
            }

            if (out(data.y, data.r, height)) {
                data.dy = -data.dy;
            }

            data.x = data.x + data.dx;
            data.y = data.y + data.dy;
        };

        const draw = function(shape, interface) {
            move(interface);
            interact(interface);
            shape(interface);
        };

        const getDecimal = function(x) {
            return Math.random() * x;
        };

        const getInteger = function(x) {
            return Math.floor(getDecimal(x));
        };

        const getRGBA = function() {
            return `rgba(
                ${getInteger(255)},
                ${getInteger(255)},
                ${getInteger(255)},
                ${getDecimal(1)}
            )`;
        };

        const getColor = function(colors) {
            if (typeof colors === "string") {
                return colors;
            } else if (typeof colors === "object") {
                return colors[Math.floor(Math.random() * colors.length)];
            } else {
                return getRGBA();
            }
        };

        const range = function(axis, mouse) {
            return mouse - axis < 50 && mouse - axis > -50 ? true : false;
        };

        const interact = function(data) {
            if (range(data.x, mouse.x) && range(data.y, mouse.y)) {
                if (data.r < data.maxRadius) {
                    data.r = data.r + 1;
                }
            } else if (data.r > data.minRadius) {
                data.r = data.r - 1;
            }
        };

        const minRadius = function(radius) {
            return radius < 2 ? 2 : radius;
        };

        const maxRadius = function(radius) {
            return radius > 40 ? 40 : radius;
        };

        const interface = function(options) {
            const r = Math.random() * 3 + 1;
            const v = options.velocity || 5;
            return {
                r: r,
                x: stage(width, r),
                y: stage(height, r),
                dx: velocity(v),
                dy: velocity(v),
                color: getColor(options.colors),
                minRadius: r,
                maxRadius: maxRadius(options.maxRadius || 40)
            };
        };

        const animate = function(shape, context) {
            requestAnimationFrame(animate.bind(this, shape, context));
            context.clearRect(0, 0, width, height);
            interfaces.forEach(function(interface) {
                draw(shape, interface);
            });
        };

        const interfaces = [];

        const store = function(interface) {
            interfaces.push(interface);
        };

        const cycle = function(options, cb) {
            const o = options || {};
            const q = o.quantity || 1;
            for (let i = 0; i < q; i++) {
                cb(interface(o));
            }
        };

        return function(canvas, shape, options) {
            const context = canvas.getContext("2d");
            cycle(options, store);
            animate(shape, context);
        };
    };

    global.Shapes = shapes();
})(window);

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

Shapes(
    canvas,
    function(shape) {
        c.beginPath();
        c.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2, false);
        c.fillStyle = shape.color;
        c.fill();
    },
    {
        colors: ["#4D9DE0", "#E15554", "#E1BC29", "#3BB273", "#7768AE"],
        quantity: 200,
        minRadius: 10,
        velocity: 5
    }
);

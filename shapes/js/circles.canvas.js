Shapes(
    document.querySelector("canvas"),
    function(shape, c) {
        c.beginPath();
        c.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2, false);
        c.fillStyle = shape.color;
        c.fill();
    },
    {
        quantity: 400,
        minRadius: 10,
        setVelocity: 3
    }
)(function(canvas, stage) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("mousemove", function(event) {
        stage.x = event.x;
        stage.y = event.y;
    });

    window.addEventListener("touchstart", function(event) {
        stage.x = event.touches[0].pageX;
        stage.y = event.touches[0].pageY;
    });

    window.addEventListener("touchmove", function(event) {
        stage.x = event.touches[0].pageX;
        stage.y = event.touches[0].pageY;
    });

    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stage.width = window.innerWidth;
        stage.height = window.innerHeight;
    });
});

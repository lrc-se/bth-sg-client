<template>
    <canvas class="sg-canvas" width="800" height="600"></canvas>
</template>

<script>
    export default {
        name: "sg-canvas",
        
        data() {
            return {
                shapes: []
            };
        },
        
        methods: {
            draw(shape) {
                let ctx = this.$el.getContext("2d");
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = shape.width;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                switch (shape.type) {
                    case "path":
                    case "line":
                        ctx.beginPath();
                        ctx.arc(
                            shape.points[0][0],
                            shape.points[0][1],
                            shape.width / 2,
                            0,
                            2 * Math.PI
                        );
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(shape.points[0][0], shape.points[0][1]);
                        for (let point of shape.points.slice(1)) {
                            ctx.lineTo(point[0], point[1]);
                        }
                        ctx.stroke();
                        break;
                    case "rect":
                        ctx.strokeRect(
                            shape.points[0][0],
                            shape.points[0][1],
                            shape.points[1][0] - shape.points[0][0],
                            shape.points[1][1] - shape.points[0][1]
                        );
                        break;
                    case "frect":
                        ctx.fillRect(
                            shape.points[0][0],
                            shape.points[0][1],
                            shape.points[1][0] - shape.points[0][0],
                            shape.points[1][1] - shape.points[0][1]
                        );
                        break;
                }
            },
            
            redraw() {
                this.clear();
                this.shapes.forEach(this.draw);
            },
            
            addShape(shape, draw) {
                this.shapes.push(shape);
                if (draw) {
                    this.draw(shape);
                }
            },
            
            clear(clearShapes) {
                let ctx = this.$el.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (clearShapes) {
                    this.shapes = [];
                }
            }
        }
    };
</script>

<style>
    .sg-canvas {
        position: absolute;
        left: 0;
        top: 0;
        cursor: crosshair;
    }
</style>

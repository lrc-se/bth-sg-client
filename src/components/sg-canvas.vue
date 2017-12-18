<template>
    <canvas class="sg-canvas" width="800" height="600"></canvas>
</template>

<script>
    import Gfx from "../gfx";
    
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
                ctx.fillStyle = shape.color;
                ctx.lineWidth = shape.width;
                ctx.lineCap = "round";
                switch (shape.type) {
                    case "path":
                    case "line":
                        Gfx.drawPixel(ctx, shape.points[0], shape.width);
                        Gfx.drawPath(ctx, shape.points);
                        break;
                    case "rect":
                        Gfx.drawRect(ctx, shape.points[0], shape.points[1], false);
                        break;
                    case "frect":
                        Gfx.drawRect(ctx, shape.points[0], shape.points[1], true);
                        break;
                    case "oval":
                        Gfx.drawEllipse(ctx, shape.points[0], shape.points[1], false);
                        break;
                    case "foval":                        
                        Gfx.drawEllipse(ctx, shape.points[0], shape.points[1], true);
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
            },
            
            undo() {
                this.shapes.pop();
                this.redraw();
            }
        }
    };
</script>

<style>
    .sg-canvas {
        position: absolute;
        left: 0;
        top: 0;
    }
</style>

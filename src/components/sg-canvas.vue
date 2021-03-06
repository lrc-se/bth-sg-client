<template>
    <canvas class="sg-canvas" width="640" height="480"></canvas>
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
            /**
             * Draws a shape on the canvas.
             *
             * @param   {object}    shape   Shape object.
             */
            draw(shape) {
                // set up context
                let ctx = this.$el.getContext("2d");
                ctx.strokeStyle = shape.color;
                ctx.fillStyle = shape.color;
                ctx.lineWidth = shape.width;
                ctx.lineCap = "round";
                
                // draw shape
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
                    default:
                        // NOOP
                }
            },
            
            
            /**
             * Redraws the canvas using shape buffer.
             */
            redraw() {
                this.clear();
                this.shapes.forEach(this.draw);
            },
            
            
            /**
             * Adds a shape to shape buffer.
             *
             * @param   {object}    shape   Shape object.
             * @param   {boolean}   draw    Whether to draw the shape on the canvas immediately.
             */
            addShape(shape, draw) {
                this.shapes.push(shape);
                if (draw) {
                    this.draw(shape);
                }
            },
            
            
            /**
             * Clears the canvas.
             *
             * @param   {boolean}   clearShapes     Whether to clear the shape buffer as well.
             */
            clear(clearShapes) {
                let ctx = this.$el.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (clearShapes) {
                    this.shapes = [];
                }
            },
            
            
            /**
             * Removes the last drawn shape from the canvas.
             */
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

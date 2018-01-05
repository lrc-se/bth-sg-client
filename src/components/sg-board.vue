<template>
    <div id="sg-board" :class="status" @mousedown="startShape" @mousemove="updateShape" @mouseup="endShape">
        <sg-canvas ref="bgCanvas"></sg-canvas>
        <sg-canvas ref="drawCanvas"></sg-canvas>
    </div>
</template>

<script>
    import Client from "../client";
    import SgCanvas from "./sg-canvas";
    
    export default {
        name: "sg-board",
        
        components: {
            "sg-canvas": SgCanvas
        },
        
        props: [
            "draw-type",
            "draw-width",
            "draw-color"
        ],
        
        data() {
            return {
                status: "inactive",
                curShape: {},
                isDragging: false
            };
        },
        
        created() {
            // new shape drawn
            Client.$on("draw", (shape) => {
                this.$refs.bgCanvas.addShape(shape, true);
            });
            
            // drawing board cleared
            Client.$on("clear", this.clear);
            
            // last drawn shape removed
            Client.$on("undo", this.undo);
            
            // new word announced
            Client.$on("word", () => {
                this.$refs.drawCanvas.clear(true);
                this.$refs.bgCanvas.clear(true);
                this.status = "drawing";
            });
            
            // correct guess announced
            Client.$on("correct", () => {
                this.status = "correct";
                this.isDragging = false;
            });
            
            // timeout announced
            Client.$on("timeout", () => {
                this.status = "timeout";
                this.isDragging = false;
            });
            
            Client.$on("drawer", this.reset);
            Client.$on("pause", this.reset);
            Client.$on("offline", this.reset);
        },
        
        methods: {
            /**
             * Starts drawing a new shape.
             *
             * @param   {MouseEvent}    e   Mouse event.
             */
            startShape(e) {
                // safety checks
                if (this.status != "drawing" || this.isDragging) {
                    return;
                }
                
                // create shape
                this.curShape = {
                    type: this.drawType,
                    width: this.drawWidth,
                    color: this.drawColor,
                    points: [[e.offsetX, e.offsetY]]
                };
                this.isDragging = true;
            },
            
            
            /**
             * Updates the shape currently being drawn.
             *
             * @param   {MouseEvent}    e   Mouse event.
             */
            updateShape(e) {
                // safety checks
                if (this.status != "drawing" || !this.isDragging) {
                    return;
                }
                
                // update shape
                if (this.curShape.type == "path") {
                    this.curShape.points.push([e.offsetX, e.offsetY]);
                } else {
                    this.curShape.points[1] = [e.offsetX, e.offsetY];
                }
                
                // update display
                this.$refs.drawCanvas.clear();
                this.$refs.drawCanvas.draw(this.curShape);
            },
            
            
            /**
             * Finishes the shape currently being drawn.
             *
             * @param   {MouseEvent}    e   Mouse event.
             */
            endShape(e) {
                // safety checks
                if (this.status != "drawing" || !this.isDragging) {
                    return;
                }
                
                // update shape
                this.isDragging = false;
                if (this.curShape.points.length == 1) {
                    this.curShape.points.push([e.offsetX, e.offsetY]);
                }
                
                // update display
                let shape = {};
                Object.assign(shape, this.curShape);
                this.$refs.bgCanvas.addShape(shape, true);
                this.$refs.drawCanvas.clear(true);
                
                // signal finish
                Client.send("draw", shape);
            },
            
            
            /**
             * Clears the drawing board.
             */
            clear() {
                this.$refs.bgCanvas.clear(true);
            },
            
            
            /**
             * Undoes the last shape drawn.
             */
            undo() {
                this.$refs.bgCanvas.undo();
            },
            
            
            /**
             * Resets view state.
             */
            reset() {
                this.status = "inactive";
                this.isDragging = false;
                this.$refs.drawCanvas.clear(true);
                this.$refs.bgCanvas.clear(true);
            }
        }
    };
</script>

<style>
    #sg-board {
        position: relative;
        width: 644px;
        height: 484px;
        border: 2px solid #33312e;
        border-radius: 2px;
        background-color: #fff;
    }
    
    #sg-board.drawing {
        border-color: #00c;
        cursor: crosshair;
    }
    
    #sg-board.correct {
        border-color: #0a0;
    }
    
    #sg-board.timeout {
        border-color: #c00;
    }
    
    .sg-canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>

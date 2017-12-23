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
        
        props: [
            "draw-type",
            "draw-width",
            "draw-color"
        ],
        
        data() {
            return {
                curShape: {},
                isDragging: false,
                status: "inactive"
            };
        },
        
        components: {
            "sg-canvas": SgCanvas
        },
        
        created() {
            Client.$on("draw", (shape) => {
                this.$refs.bgCanvas.addShape(shape, true);
            });
            
            Client.$on("clear", this.clear);
            
            Client.$on("undo", this.undo);
            
            Client.$on("word", () => {
                this.$refs.drawCanvas.clear(true);
                this.$refs.bgCanvas.clear(true);
                this.status = "drawing";
            });
            
            Client.$on("correct", () => {
                this.status = "correct";
                this.isDragging = false;
            });
            
            Client.$on("timeout", () => {
                this.status = "timeout";
                this.isDragging = false;
            });
            
            Client.$on("drawer", this.reset);
            Client.$on("pause", this.reset);
            Client.$on("offline", this.reset);
        },
        
        methods: {
            startShape(e) {
                if (this.status != "drawing" || this.isDragging) {
                    return;
                }
                
                this.curShape = {
                    type: this.drawType,
                    width: this.drawWidth,
                    color: this.drawColor,
                    points: [[e.offsetX, e.offsetY]]
                };
                this.isDragging = true;
            },
            
            updateShape(e) {
                if (this.status != "drawing" || !this.isDragging) {
                    return;
                }
                
                if (this.curShape.type == "path") {
                    this.curShape.points.push([e.offsetX, e.offsetY]);
                } else {
                    this.curShape.points[1] = [e.offsetX, e.offsetY];
                }
                this.$refs.drawCanvas.clear();
                this.$refs.drawCanvas.draw(this.curShape);
            },
            
            endShape(e) {
                if (this.status != "drawing" || !this.isDragging) {
                    return;
                }
                
                this.isDragging = false;
                if (this.curShape.points.length == 1) {
                    this.curShape.points.push([e.offsetX, e.offsetY]);
                }
                
                let shape = {};
                Object.assign(shape, this.curShape);
                this.$refs.bgCanvas.addShape(shape, true);
                this.$refs.drawCanvas.clear(true);
                Client.send("draw", shape);
            },
            
            clear() {
                this.$refs.bgCanvas.clear(true);
            },
            
            undo() {
                this.$refs.bgCanvas.undo();
            },
            
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
        width: 800px;
        height: 600px;
        margin: 2px;
        outline: 2px solid #000;
        background-color: #fff;
    }
    
    #sg-board.drawing {
        outline-color: #00f;
        cursor: crosshair;
    }
    
    #sg-board.correct {
        outline-color: #080;
    }
    
    #sg-board.timeout {
        outline-color: #a00;
    }
    
    .sg-canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>

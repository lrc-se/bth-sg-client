<template>
    <div id="sg-board" @mousedown="startShape" @mousemove="updateShape" @mouseup="endShape">
        <sg-canvas ref="bgCanvas"></sg-canvas>
        <sg-canvas ref="drawCanvas"></sg-canvas>
    </div>
</template>

<script>
    import Dispatcher from "../dispatcher";
    import SgCanvas from "./sg-canvas";
    
    export default {
        name: "sg-board",
        
        props: [
            "draw-type",
            "draw-width"
        ],
        
        data() {
            return {
                curShape: {
                    type: "path",
                    color: "#000"
                },
                isDrawing: false
            };
        },
        
        components: {
            "sg-canvas": SgCanvas
        },
        
        created() {
            Dispatcher.$on("clear", this.clear);
        },
        
        methods: {
            startShape(e) {
                if (this.isDrawing) {
                    return;
                }
                
                this.curShape.points = [[e.offsetX, e.offsetY]];
                this.curShape.type = this.drawType;
                this.curShape.width = this.drawWidth;
                this.isDrawing = true;
            },
            
            updateShape(e) {
                if (!this.isDrawing) {
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
                if (!this.isDrawing) {
                    return;
                }
                
                this.isDrawing = false;
                if (this.curShape.points.length == 1) {
                    this.curShape.points.push([e.offsetX, e.offsetY]);
                }
                this.$refs.bgCanvas.addShape(this.curShape, true);
                this.$refs.drawCanvas.clear(true);
                this.curShape.points = [];
            },
            
            clear() {
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
    
    .sg-canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>

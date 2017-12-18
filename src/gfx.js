/**
 * Client instance.
 */

"use strict";

export default {
    drawPixel(ctx, point, size) {
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.arc(point[0], point[1], size / 2, 0, 2 * Math.PI);
        ctx.fill();
    },
    
    
    drawPath(ctx, points) {
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let point of points.slice(1)) {
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    },
    
    
    drawRect(ctx, fromPos, toPos, fill) {
        ctx.lineJoin = "miter";
        let method;
        if (fill) {
            method = "fillRect";
        } else {
            method = "strokeRect";
        }
        ctx[method](fromPos[0], fromPos[1], toPos[0] - fromPos[0], toPos[1] - fromPos[1]);
    },
    
    
    drawEllipse(ctx, fromPos, toPos, fill) {
        ctx.lineJoin = "round";
        let width = toPos[0] - fromPos[0];
        let height = toPos[1] - fromPos[1];
        ctx.beginPath();
        ctx.moveTo(fromPos[0] + width / 2, fromPos[1]);
        ctx.bezierCurveTo(
            toPos[0],
            fromPos[1],
            toPos[0],
            toPos[1],
            fromPos[0] + width / 2,
            toPos[1]
        );
        ctx.bezierCurveTo(
            fromPos[0],
            toPos[1],
            fromPos[0],
            fromPos[1],
            fromPos[0] + width / 2,
            fromPos[1]
        );
        if (fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
};

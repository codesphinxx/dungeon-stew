/**
 * @function MathHelper.CircleIntersect
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} r1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @param {Number} r2 
 */
let CircleIntersect = function(x1, y1, r1, x2, y2, r2)
{
    var circle1 = {radius: r1, x: x1, y: y1};
    var circle2 = {radius: r2, x: x2, y: y2};

    var dx = (circle1.x + circle1.radius) - (circle2.x + circle2.radius);
    var dy = (circle1.y + circle1.radius) - (circle2.y + circle2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) 
    {
        return true;
    }
    return false;
};

var MathHelper = {
    CircleIntersect: CircleIntersect
};

module.exports = MathHelper;
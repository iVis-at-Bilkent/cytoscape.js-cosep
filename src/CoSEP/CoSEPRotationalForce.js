/**
 *
 * This object is data structure holding rotational forces. The size should match the periods of phase 2 in order for
 * this class to work properly.
 *
 * The stored force could be:
 * 1) The force inflicted upon a port by the edge
 * 2) A node's total rotational force done by all of its' edges
 *
 * @author Alihan Okka
 *
 * @copyright i-Vis Research Group, Bilkent University, 2007 - present
 *
 */
function CoSEPRotationalForce ( size ){
    this.size = size;
    this.data = new Array( this.size );
    this.current = 0;
}

CoSEPRotationalForce.prototype = Object.create(null);

/**
 * Adds a number to the array
 * @param number
 */
CoSEPRotationalForce.prototype.add = function ( number ) {
    this.data[ this.current ] = number;
    this.current = ++this.current % this.size;
};

/**
 * Returns the average of the forces stored.
 * @returns {number}
 */
CoSEPRotationalForce.prototype.getAverage = function () {
    let result = 0;
    for( let i = 0; i < this.size; i++)
        result += this.data[i] / this.size;

    return result;
};

module.exports = CoSEPRotationalForce;
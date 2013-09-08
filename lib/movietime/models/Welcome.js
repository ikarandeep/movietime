/**
 * @author - Chandra Bhavanasi
 */

function Welcome() {};

Welcome.prototype.welcomeMessage = function() {
    return 'This should probably work!'
}

module.exports = new Welcome;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Classe Camera

export class Camera {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width
        this.height = width / (canvas.width / canvas.height)
    }
}

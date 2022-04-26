const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Classe Bullet

export class Bullet {
    constructor(x, y, dx, dy, radius, lifetime, speed, damage) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.time = 0;
        this.lifetime = lifetime;
        this.radius = radius;
        this.speed = speed;
        this.damage = damage;
    }

    draw(camera) {
        ctx.beginPath();
        ctx.arc(this.x-camera.x, this.y-camera.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    update(lstBullet, camera, csts) {
        this.damage = csts.DAMAGE_BULLET;
        this.speed = csts.SPEED_BULLET;
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        this.time += 1;
        if (this.time >= this.lifetime) {
            lstBullet.shift();
        }
        this.draw(camera);
    }
}


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Classe Particle

export class Particle {
    constructor(x, y, radius, color, points, life, maxlife, damageToPlayer) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.life = life;
        this.maxlife = maxlife;
        this.points = points;
        this.damageToPlayer = damageToPlayer;
        this.isDead = false;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    }

    circleIntersect(x1, y1, r1, x2, y2, r2) {
        return this.getDistance(x1,y1,x2,y2) <= r1 + r2
    }

    draw(camera) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.x-camera.x)*(canvas.width/camera.width), (this.y-camera.y)*(canvas.height/camera.height), this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.life < this.maxlife) {
            var percent = this.life / this.maxlife;    
            ctx.fillStyle = "black";
            ctx.fillRect(((this.x-camera.x)*(canvas.width/camera.width))-this.radius, ((this.y-camera.y)*(canvas.height/camera.height))+this.radius+5, this.radius*2, 5);
        
            ctx.fillStyle = "green";
            ctx.fillRect(((this.x-camera.x)*(canvas.width/camera.width))-this.radius, ((this.y-camera.y)*(canvas.height/camera.height))+this.radius+5, (this.radius*2)*percent, 5);
        }
    }

    update(camera, lstBullet) {
        for (let i = 0; i < lstBullet.length; i++) {
            if (this.circleIntersect(this.x, this.y, this.radius, lstBullet[i].x, lstBullet[i].y, lstBullet[i].radius)) {
                this.life -= lstBullet[i].damage;
                if (this.life <= 0) {
                    this.isDead = true;
                }
            }
        }
        this.draw(camera);
    }
}
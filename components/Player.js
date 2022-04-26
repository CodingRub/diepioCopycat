import { Camera } from './Camera.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Classe Player

export class Player {
    constructor(x, y, name, speed, radius, life, maxlife) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.name = name;
        this.speed = speed;
        this.radius = radius;
        this.life = life;
        this.maxlife = maxlife;
        this.score = 0;
        this.camera = new Camera(this.x, this.y, canvas.width);
        this.XP = 0;
        this.maxXP = 200;
        this.level = 1;
        this.skillsPoints = 0;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    }

    circleIntersect(x1, y1, r1, x2, y2, r2) {
        return this.getDistance(x1,y1,x2,y2) <= r1 + r2
    }

    collision(lstParticle) {
        for (let i = 0; i < lstParticle.length; i++) {
            if (this.circleIntersect(this.x, this.y, this.radius, lstParticle[i].x, lstParticle[i].y, lstParticle[i].radius)) {
                this.life -= lstParticle[i].damageToPlayer;
                this.score += lstParticle[i].points;
                this.XP += lstParticle[i].points;
                lstParticle.splice(i, 1);
            }
        } 
    }

    draw_lifeBar() {
        var percent = this.life / this.maxlife;    
        ctx.fillStyle = "black";
        ctx.fillRect((this.x-this.radius)-this.camera.x, (this.y+this.radius+5)-this.camera.y, this.radius*2, 5);
    
        ctx.fillStyle = "green";
        ctx.fillRect((this.x-this.radius)-this.camera.x, (this.y+this.radius+5)-this.camera.y, (this.radius*2)*percent, 5);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "purple";
        ctx.arc(this.x-this.camera.x, this.y-this.camera.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        if (this.life < this.maxlife) {
            this.draw_lifeBar();
        }

        ctx.fillStyle = "white";
        ctx.font = "15px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x-this.camera.x, this.y-this.camera.y);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.camera.x = this.x - canvas.width/2
        this.camera.y = this.y - canvas.height/2
        if (this.XP >= this.maxXP) {
            this.XP = 0;
            this.level += 1;
            this.maxXP **= 1.05;
            if (this.level%2 == 0) {
                this.skillsPoints += 1;
            }
        }
        this.draw();
    }
}
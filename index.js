import { Player } from './components/Player.js';
import { Bullet } from './components/Bullet.js';
import { Particle } from './components/Particle.js';
import { Constantes } from './components/Constantes.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

const showScore = document.querySelector('h1');
const showLvl = document.querySelector('h2');
const showSkillsPoints = document.querySelector('h3');
const a = document.querySelectorAll('a');


let lstBullet = [];
let lstParticle = [];

let player, csts, maxParticules, game;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var animRequest;


function drawBoard(bw, bh, player, mapSize){
    ctx.lineWidth = 1;
    for (var x = 0; x <= bw; x += 40) {
        ctx.moveTo(0.5 + x, 0);
      
        ctx.lineTo(0.5 + x, bw);
    }

    for (var x = 0; x <= bh; x += 40) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(bh, 0.5 + x);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.moveTo(-mapSize-player.camera.x, -mapSize-player.camera.y);
    ctx.lineTo(mapSize-player.camera.x, -mapSize-player.camera.y);
    ctx.lineTo(mapSize-player.camera.x, mapSize-player.camera.y);
    ctx.lineTo(-mapSize-player.camera.x, mapSize-player.camera.y);
    ctx.lineTo(-mapSize-player.camera.x, -mapSize-player.camera.y);
    ctx.stroke();
}

function drawXPBar(player, sizeXPBar) {
    var percent = player.XP / Math.round(player.maxXP);
    ctx.fillStyle = "gray";
    ctx.fillRect((canvas.width/2)-((sizeXPBar+50)/2), canvas.height-60, sizeXPBar+50, 50); 
    ctx.fillStyle = "black";
    ctx.fillRect((canvas.width/2)-(sizeXPBar/2), canvas.height-50, sizeXPBar, 15);
    ctx.fillStyle = "green";
    ctx.fillRect((canvas.width/2)-(sizeXPBar/2), canvas.height-50, sizeXPBar*percent, 15);
    ctx.textAlign = "right";
    ctx.font = "15px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText("MaxXP: " + Math.round(player.maxXP), canvas.width/2+(sizeXPBar/2), canvas.height-20);
}

function drawGAMEOVER() {
    game = false;
    cancelAnimationFrame(animRequest);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "75px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER !", canvas.width/2, canvas.height/2);

    // Création du bouton de restart au bout de 1000ms; qui relance les fonctions de bases:
    // init() et animate(), on supprime également le bouton restart
    setTimeout(() => {
        var x = document.createElement("button");
        x.id = "btn";
        var t = document.createTextNode("Restart");
        var canvas_container = document.querySelector('.canvas-container');
        x.appendChild(t);
        canvas_container.appendChild(x);
        btn.addEventListener('click', function() {
            init();
            animate();
            x.remove();
        });
    }, 1000);
}

function pushParticles(mapSize, size, rarity, csts, nbr) {
    let elements;
    if (rarity == "COMMON") {
        elements = csts.common;
    } else if (rarity == "RARE") {
        elements = csts.rare;
    } else {
        elements = csts.epic;
    }
    for (let i = 0; i<nbr; i++) {
        let x_part = getRndInteger(-mapSize, mapSize)
        let y_part = getRndInteger(-mapSize, mapSize)
        lstParticle.push(new Particle( x_part, y_part, size, elements.COLOR, elements.POINTS, elements.HEALTH, elements.HEALTH, elements.DAMAGE_TO_PLAYER))
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function getDistanceTo0(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
    return getDistance(x1,y1,x2,y2) <= r1 + r2
}

function init() {
    // On crée le joueur
    player = new Player(canvas.width/2, canvas.height/2, 'Ir0n', 10, 40, 500, 500);
    // On initialise les constantes qui vont servir à tout le code
    csts = new Constantes(player, 2000);
    // On initialise le quadrillage et les bordures de la map
    drawBoard(csts.GRID_WIDTH, csts.GRID_HEIGHT, player, csts.MAP_SIZE);

    // On ajoute toutes les particules dans lstParticle avec 3 raretés différentes
    let nbrCommon = csts.MAP_SIZE/csts.common.TAUX;
    let nbrRare = csts.MAP_SIZE/csts.rare.TAUX
    let nbrEpic = csts.MAP_SIZE/csts.epic.TAUX
    pushParticles(csts.MAP_SIZE, 15, "COMMON", csts, nbrCommon);
    pushParticles(csts.MAP_SIZE, 15, "RARE", csts, nbrRare);
    pushParticles(csts.MAP_SIZE, 30, "EPIC", csts, nbrEpic);
    maxParticules = lstParticle.length;
    
    // On initialise la barre d'expérience
    drawXPBar(player, csts.SIZE_XP_BAR);
}

var last = 0;
function animate(now) {
	animRequest = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mise à jour du gradrillage et des bordures de la map
    drawBoard(csts.GRID_WIDTH, csts.GRID_HEIGHT, player, csts.MAP_SIZE);

    // Update du joueur
    ctx.lineWidth = 1;
    player.update();
    player.maxlife = csts.LIFE_PLAYER;
    
    if(rightPressed) {
        player.dx = player.speed;
    }
    else if(leftPressed) {
        player.dx = -player.speed;
    } else if (upPressed) {
        player.dy = -player.speed;
    } else if (downPressed) {
        player.dy = player.speed;
    } else {
        player.dx = 0;
        player.dy = 0;
    }


    // Regarde si le joueur entre en collision avec une particule
    player.collision(lstParticle);

    // Boucle pour l'affichage des particules
	for (let i = 0; i < lstParticle.length; i++) {
        let particle = lstParticle[i];
        if (particle.x >= player.camera.x && particle.x <= player.camera.x + player.camera.width && particle.y >= player.camera.y && particle.y <= player.camera.y + player.camera.height){
            lstParticle[i].update(player.camera, lstBullet);
            ctx.fillStyle = "black";
        }
        // Teste si une particule est touché par une balle
        for (let j = 0; j < lstBullet.length; j++) {
            if (circleIntersect(lstBullet[j].x, lstBullet[j].y, lstBullet[j].radius, lstParticle[i].x, lstParticle[i].y, lstParticle[i].radius)) {
                // Si la particule est déclaré morte, elle disparait et on ajoute les points et XP
                if (lstParticle[i].isDead) {
                    player.score += lstParticle[i].points;
                    player.XP += lstParticle[i].points;
                    lstParticle.splice(i, 1);
                }
                // La balle disparait après avoir touché une particule
                lstBullet.shift();
            }
        }
	}

/*     // Toute les 5 secondes, si la quantité de particule est inférieur au max
    // On ajoute des particules
    if (lstParticle.length < maxParticules) {
        if(!last || now - last >= 5*1000) {
            last = now;
            if (lstParticle.length < maxParticules) {
                pushParticles(csts.MAP_SIZE, 15, "COMMON", csts, 1);
            }
            if (lstParticle.length < maxParticules) {
                pushParticles(csts.MAP_SIZE, 15, "RARE", csts, 1);
            }
            if (lstParticle.length < maxParticules) {
                pushParticles(csts.MAP_SIZE, 30, "EPIC", csts, 1);
            }
        }
    } */

    // Regeneration de la vie
    if (player.life < player.maxlife) {
        if(!last || now - last >= 5*1000) {
            player.life += csts.LIFE_REGEN_PLAYER;
        }
    }
    
    // Boucle pour l'affichage des bullets
    for (let i = 0; i < lstBullet.length; i++) {
        ctx.fillStyle = "black";
        lstBullet[i].update(lstBullet, player.camera, csts);
	}

    if (Math.abs(player.y)+player.radius >= csts.MAP_SIZE) {
        console.log("nothing")
    }


    // Affichage du score, du niveau et les points de compétences sur le côté gauche
    showScore.innerText = "Score " + player.score;
    showLvl.innerText = "Level " + player.level;
    showSkillsPoints.innerText = "Skills Points: " + player.skillsPoints;

    // Pour chaque upgrade, on met à jour la valeur de chaque constante ainsi que son niveau
    a.forEach(function(id) {
        switch (id.id) {
            case "1":
                document.querySelector('#value'+id.id).innerText = 'Actual Value: ' + csts.DAMAGE_BULLET;
                document.querySelector('#lvl'+id.id).innerText = 'Lvl ' + csts.lvlDamage;
                break; 
            case "2":
                document.querySelector('#value'+id.id).innerText = 'Actual Value: ' + csts.SPEED_BULLET;
                document.querySelector('#lvl'+id.id).innerText = 'Lvl ' + csts.lvlSpeed;
                break; 
            case "3":
                document.querySelector('#value'+id.id).innerText = 'Actual Value: ' + csts.LIFE_PLAYER;
                document.querySelector('#lvl'+id.id).innerText = 'Lvl ' + csts.lvlLife;
                break; 
            case "4":
                document.querySelector('#value'+id.id).innerText = 'Actual Value: ' + csts.LIFE_REGEN_PLAYER;
                document.querySelector('#lvl'+id.id).innerText = 'Lvl ' + csts.lvlRegenLife;
                break; 
        }
    });

    ctx.textAlign = "right";
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText('('+player.x+','+player.y+')', + 100, 30, 100);
    // On met à jour la barre d'expérience
    drawXPBar(player, csts.SIZE_XP_BAR);

    // Affichage de l'ecran de GAME OVER si la vie du joueur est en-dessous ou égal à 0
    if (player.life <= 0) {
        drawGAMEOVER();
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = true;
    } else if(e.keyCode == 81) {
        leftPressed = true;
    } else if (e.keyCode == 90) {
        upPressed = true;
    } else if (e.keyCode == 83) {
        downPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = false;
    } else if(e.keyCode == 81) {
        leftPressed = false;
    } else if (e.keyCode == 90) {
        upPressed = false;
    } else if (e.keyCode == 83) {
        downPressed = false;
    }
}

canvas.addEventListener('mousedown',(e)=>{
    e.preventDefault();
    let x = canvas.width/2;
    let y = canvas.height/2;
    var diff_x = e.offsetX - x;
    var diff_y = e.offsetY - y;
    var distance = getDistanceTo0(diff_x, diff_y);
    const bullet = new Bullet(player.x, player.y, (diff_x/distance), (diff_y/distance), 10, csts.LIFETIME_BULLET, csts.SPEED_BULLET, csts.DAMAGE_BULLET);
    lstBullet.push(bullet);
});

a.forEach(function(id) {
    id.addEventListener('mousedown',()=>{
        if (player.skillsPoints > 0) {
            switch (id.id) {
                case "1":
                    csts.lvlDamage += 1;
                    csts.DAMAGE_BULLET *= 1.5;
                    break; 
                case "2":
                    csts.lvlSpeed += 1;
                    csts.SPEED_BULLET *= 1.5;
                    break; 
                case "3":
                    csts.lvlLife += 1;
                    csts.LIFE_PLAYER *= 1.5;
                    break;
                case "4":
                    csts.lvlRegenLife += 1;
                    csts.LIFE_REGEN_PLAYER *= 1.5;
                    break; 
            }
            player.skillsPoints -= 1;
        }
    });
})



init();
animate();
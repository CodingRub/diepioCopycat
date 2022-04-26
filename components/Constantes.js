// Constantes pour la particule avec 3 types: COMMON, RARE, EPIC
export class Constantes {
    constructor(player) {

        this.GRID_WIDTH = 1500;
        this.GRID_HEIGHT = 1500;

        this.SIZE_XP_BAR = 500;
        this.MAP_SIZE = 2000;
        
        // Constantes pour les particules
        this.common = {
            COLOR: "red",
            DAMAGE_TO_PLAYER: player.life *0.01,
            HEALTH: 50,
            POINTS: 10,
            TAUX: 3
        }

        this.rare = {
            COLOR: "yellow",
            DAMAGE_TO_PLAYER: player.life *0.03,
            HEALTH: 200,
            POINTS: 20,
            TAUX: 5
        }

        this.epic = {
            COLOR: "blue",
            DAMAGE_TO_PLAYER: player.life *0.05,
            HEALTH: 1000,
            POINTS: 300,
            TAUX: 10
        }
    
        // Constantes pour le joueur
        this.LIFE_PLAYER = 500;
        this.SPEED_PLAYER = 5;
        this.LIFE_REGEN_PLAYER = 0.25;
    
        // Constantes pour la bullet
        this.DAMAGE_BULLET = 20;
        this.SPEED_BULLET = 10;
        this.LIFETIME_BULLET = 40;

        this.lvlDamage = 0;
        this.lvlSpeed = 0;
        this.lvlLife = 0;
        this.lvlRegenLife = 0;
    }
}
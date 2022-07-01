// initialize kaboom context
kaboom({
    width: 190,
    height: 225,
    font: 'apl386o',
    background: [30, 30, 30],
    global: true,
    scale: 2.5,
    debug: true,
});

loadSprite('player', '/assets/sprites/bee.png');
loadSprite('background', '/assets/sprites/checkerboard.png');
loadSprite('enemy', '/assets/sprites/skunk.png')
loadSprite('powerup', '/assets/sprites/enemy.png')
loadSprite('enemyvulnerable', '/assets/sprites/enemyvulnerable.png')
loadFont('retro', '/assets/fonts/Retro.png', 8, 8)


scene("game", () => {

    const background = add([
        sprite('background'),
        z(-1),
    ])

    const player = add([
        sprite('player'),
        pos(85.5, 85.5),
        rotate(0),
        origin("center"),
        z(1),
    ])

    const SPEED = 100;
    let canPlayerMove = true;
    let points = 0;

    let highscore = 0;
    if (localStorage.getItem("highscore")) {
        highscore = Number(localStorage.getItem("highscore"));
    }
    else {
        highscore = 0;
    }

    //##########################################################//
    //Movement

    const offsetx = 19;
    const offsety = 19;
    const bRight = 151.5;
    const bLeft = 28.5;
    const bUp = 28.5;
    const bDown = 151.5;

    isKeyDown = false;
    onKeyDown("left", () => {
        if (!isKeyDown) {
            player.angle = 270;
            if (player.pos.x > bLeft && canPlayerMove) {
                player.moveTo(player.pos.x - offsetx, player.pos.y)
                increaseScore();
            }
        }
        isKeyDown = true;
    })
    onKeyRelease("left", () => {
        isKeyDown = false;
    })

    onKeyDown("right", () => {
        if (!isKeyDown) {
            player.angle = 90;
            if (player.pos.x < bRight && canPlayerMove) {
                player.moveTo(player.pos.x + offsetx, player.pos.y)
                increaseScore();
            }
        }
        isKeyDown = true;
    })
    onKeyRelease("right", () => {
        isKeyDown = false;
    })

    onKeyDown("up", () => {
        if (!isKeyDown) {
            player.angle = 0;
            if (player.pos.y > bUp && canPlayerMove) {
                player.moveTo(player.pos.x, player.pos.y - offsety)
                increaseScore();
            }
        }
        isKeyDown = true;
    })
    onKeyRelease("up", () => {
        isKeyDown = false;
    })

    onKeyDown("down", () => {
        if (!isKeyDown) {
            player.angle = 180;
            if (player.pos.y < bDown && canPlayerMove) {
                player.moveTo(player.pos.x, player.pos.y + offsety)
                increaseScore();
            }
        }
        isKeyDown = true;
    })
    onKeyRelease("down", () => {
        isKeyDown = false;
    })

    onKeyDown("space", () => {
        debug.log(player.pos.x + ", " + player.pos.y + ", " + enemies);
    });

    //###########################################################//

    let hasPowerup = false;
    let counter = 0;
    function increaseScore() {
        //Scoring
        points++;
        if (points > highscore) {
            bestText.use(color([255, 215, 0]))
            highscore = points;
            localStorage.setItem("highscore", highscore);
        }
        bestText.text = "Best: " + highscore;
        score.text = "Score: " + points;

        powerups.forEach((powerup, i) => {
            if (powerup.pos.x == player.pos.x && powerup.pos.y == player.pos.y) {
                hasPowerup = true;
            }
        })

        //Moving Enemies and checking for collision
        enemies.forEach((enemy, i) => {
            if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y && !hasPowerup) {
                loseGame();
                return;
            } else if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y && hasPowerup) {
                destroy(enemy);
                enemies.splice(i, 1);
            }
            const moves = [];
            let nextMove;
            const posx = enemy.pos.x;
            const posy = enemy.pos.y;

            if (posx > 28.5 && posy > 9.5 && posy < 180.5) {
                let canMove = true;
                enemies.forEach((e) => {
                    if (e.pos.x == posx - 19 && e.pos.y == posy) {
                        canMove = false;
                    }
                })
                if (canMove) moves.push([-19, 0])
            }
            if (posx < 161.5 && posy > 9.5 && posy < 180.5) {
                let canMove = true;
                enemies.forEach((e) => {
                    if (e.pos.x == posx + 19 && e.pos.y == posy) {
                        canMove = false;
                    }
                })
                if (canMove) moves.push([19, 0])
            }
            if (posy > 28.5 && posx > 9.5 && posx < 180.5) {
                let canMove = true;
                enemies.forEach((e) => {
                    if (e.pos.y == posy - 19 && e.pos.x == posx) {
                        canMove = false;
                    }
                })
                if (canMove) moves.push([0, -19])
            }
            if (posy < 161.5 && posx > 9.5 && posx < 180.5) {
                let canMove = true;
                enemies.forEach((e) => {
                    if (e.pos.y == posy + 19 && e.pos.x == posx) {
                        canMove = false;
                    }
                })
                if (canMove) moves.push([0, 19])
            }

            nextMove = Math.floor(Math.random() * moves.length);
            if (moves.length > 0) enemy.moveTo(enemy.pos.x + moves[nextMove][0], enemy.pos.y + moves[nextMove][1])
            if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y && !hasPowerup) loseGame();
            else if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y && hasPowerup) {
                destroy(enemy);
                enemies.splice(i, 1);
            }
        })

        if (points % 5 == 0) spawnEnemy();
        if (points % 20 == 0 && powerups.length == 0) spawnPowerup();


        powerups.forEach((powerup, i) => {
            if (powerup.pos.x == player.pos.x && powerup.pos.y == player.pos.y) {
                destroy(powerup)
                counter = 8;
                powerups.splice(i, 1);
            }
        })

        if (counter == 8) {
            enemies.forEach((enemy) => {
                enemy.use(sprite("enemyvulnerable"));
                hasPowerup = true;
                powerupText.use(color([100, 100, 150]));
            });
        }
        if (counter > 0) {
            counter--;
            powerupText.text = "Powerup left: " + counter;
            enemies.forEach((enemy) => {
                enemy.use(sprite("enemyvulnerable"));
            });
            if (counter == 0) {
                enemies.forEach((enemy) => {
                    enemy.use(sprite("enemy"));
                });
                powerupText.use(color([255, 255, 255]));
                hasPowerup = false;
            }
        }
    }

    function spawnEnemy() {
        let spawnLocation = Math.floor(Math.random() * spawnSpots.length);
        const enemy = add([
            sprite('enemy'),
            pos(spawnSpots[spawnLocation][0], spawnSpots[spawnLocation][1]),
            rotate(0),
            origin("center"),
            z(2),
        ]);
        enemies.push(enemy);
    }

    function spawnPowerup() {
        const powerupSpawnLocations = [];
        let spawnIncrement = 0;
        let spawnIncrementRow = 0;
        for (let x = 0; x < 8; x++) {
            spawnIncrement = 0;
            for (let i = 0; i < 8; i++) {
                const currentSpot = [28.5 + spawnIncrement, 28.5 + spawnIncrementRow];
                let canSpawnHere = true;
                enemies.forEach((enemy) => {
                    if (enemy.pos.x == currentSpot[0] && enemy.pos.y == currentSpot[1]) {
                        canSpawnHere = false;
                    }
                })
                if (player.pos.x == currentSpot[0] && player.pos.y == currentSpot[1]) {
                    canSpawnHere = false;
                }
                if (canSpawnHere) powerupSpawnLocations.push(currentSpot);
                spawnIncrement += 19;
            }
            spawnIncrementRow += 19;
        }
        let spawnLocation = Math.floor(Math.random() * powerupSpawnLocations.length);

        if (powerupSpawnLocations.length > 0) {
            const powerup = add([
                sprite('powerup'),
                pos(powerupSpawnLocations[spawnLocation][0], powerupSpawnLocations[spawnLocation][1]),
                origin("center"),
                z(0),
            ])
            powerups.push(powerup);
        }
    }

    function loseGame() {
        canPlayerMove = false;

        const scoreText = add([
            text("Score: " + points),
            scale(0.28),
            origin("center"),
            pos(95, 70),
            z(10),
        ])
        const restart = add([
            text("Play Again?"),
            scale(0.2),
            origin("center"),
            area({ cursor: "pointer", scale: 0.2 }),
            pos(95, 100),
            z(10),
        ])
        const home = add([
            text("Menu"),
            scale(0.2),
            origin("center"),
            area({ cursor: "pointer", scale: 0.2 }),
            pos(95, 120),
            z(10),
        ])
        home.onClick(() => {
            go("start", {});
        });
        restart.onClick(() => {
            go("game", {});
        });
        home.onUpdate(() => {
            if (home.isHovering()) {
                const t = time() * 10
                home.color = rgb(
                    wave(0, 255, t),
                    wave(0, 255, t + 2),
                    wave(0, 255, t + 4),
                )
                home.scale = vec2(0.21)
            } else {
                home.scale = vec2(0.2)
                home.color = rgb()
            }
        })
        restart.onUpdate(() => {
            if (restart.isHovering()) {
                const t = time() * 10
                restart.color = rgb(
                    wave(0, 255, t),
                    wave(0, 255, t + 2),
                    wave(0, 255, t + 4),
                )
                restart.scale = vec2(0.21)
            } else {
                restart.scale = vec2(0.2)
                restart.color = rgb()
            }
        })
    }

    const score = add([
        text("Score: 0", {
            font: "apl386",
        }),
        pos(0, 192),
        scale(0.25),
        z(10),
    ])

    const bestText = add([
        text("Best: " + highscore, {
            font: "apl386",
        }),
        pos(0, 212),
        scale(0.15),
        z(10),
    ])

    const powerupText = add([
        text("Powerup Left: " + counter, {
            font: "apl386",
        }),
        pos(80, 212),
        scale(0.15),
        z(10),
    ])

    const spawnSpots = [
        [28.5, 9.5], [47.5, 9.5], [66.5, 9.5], [85.5, 9.5], [104.5, 9.5], [123.5, 9.5], [142.5, 9.5], [161.5, 9.5],
        [9.5, 28.5], [9.5, 47.5], [9.5, 66.5], [9.5, 85.5], [9.5, 104.5], [9.5, 123.5], [9.5, 142.5], [9.5, 161.5],
        [180.5, 28.5], [180.5, 47.5], [180.5, 66.5], [180.5, 85.5], [180.5, 104.5], [180.5, 123.5], [180.5, 142.5], [180.5, 161.5],
        [28.5, 180.5], [47.5, 180.5], [66.5, 180.5], [85.5, 180.5], [104.5, 180.5], [123.5, 180.5], [142.5, 180.5], [161.5, 180.5]
    ];

    const enemies = [];
    let powerups = [];
})

scene("start", () => {
    const background = add([
        sprite('background'),
        z(-1),
    ])
    const title = add([
        text("Bee Careful!", {

        }),
        scale(0.28),
        origin("center"),
        pos(95, 70),
        z(10),
    ])
    const start = add([
        text("Start"),
        scale(0.25),
        origin("center"),
        area({ cursor: "pointer", scale: 0.25 }),
        pos(95, 100),
        z(10),
    ])
    start.onClick(() => {
        go("game", {});
    });
    start.onUpdate(() => {
        if (start.isHovering()) {
            const t = time() * 10
            start.color = rgb(
                wave(0, 255, t),
                wave(0, 255, t + 2),
                wave(0, 255, t + 4),
            )
            start.scale = vec2(0.26)
        } else {
            start.scale = vec2(0.25)
            start.color = rgb()
        }
    })
})


function start() {
    go("start");
}

start();



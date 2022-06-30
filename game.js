// initialize kaboom context
kaboom({
    width: 190,
    height: 209,
    font: 'apl386o',
    background: [30, 30, 30],
    global: true,
    scale: 2.5,
    debug: true,
});

loadSprite('player', '/sprites/bee.png');
loadSprite('background', '/sprites/checkerboard.png');
loadSprite('enemy', '/sprites/starfish.png')

scene("game", () => {

    const background = add([
        sprite('background'),
    ])

    const player = add([
        sprite('player'),
        pos(85.5, 85.5),
        rotate(0),
        origin("center"),
    ])

    const SPEED = 100;
    let canPlayerMove = true;
    let points = 0;

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

    function increaseScore() {
        points++;
        score.text = "Score: " + points;
        enemies.forEach((enemy) => {
            if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y) {
                loseGame();
                return;
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
            if (enemy.pos.x == player.pos.x && enemy.pos.y == player.pos.y) {
                loseGame();
            }
        })
        if (points % 5 == 0) {
            let spawnLocation = Math.floor(Math.random() * spawnSpots.length);
            const enemy = add([
                sprite('enemy'),
                pos(spawnSpots[spawnLocation][0], spawnSpots[spawnLocation][1]),
                rotate(0),
                origin("center"),
            ]);
            enemies.push(enemy);
        }
    }

    function loseGame() {
        canPlayerMove = false;

        const scoreText = add([
            text("Score: " + points),
            scale(0.28),
            origin("center"),
            pos(95, 70),
        ])
        const restart = add([
            text("Play Again?"),
            scale(0.2),
            origin("center"),
            area({ cursor: "pointer", scale: 0.2 }),
            pos(95, 100),

        ])
        const home = add([
            text("Menu"),
            scale(0.2),
            origin("center"),
            area({ cursor: "pointer", scale: 0.2 }),
            pos(95, 120),

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
    ])

    //##############################################################//
    //Enemies

    const spawnSpots = [
        [28.5, 9.5], [47.5, 9.5], [66.5, 9.5], [85.5, 9.5], [104.5, 9.5], [123.5, 9.5], [142.5, 9.5], [161.5, 9.5],
        [9.5, 28.5], [9.5, 47.5], [9.5, 66.5], [9.5, 85.5], [9.5, 104.5], [9.5, 123.5], [9.5, 142.5], [9.5, 161.5],
        [180.5, 28.5], [180.5, 47.5], [180.5, 66.5], [180.5, 85.5], [180.5, 104.5], [180.5, 123.5], [180.5, 142.5], [180.5, 161.5],
        [28.5, 180.5], [47.5, 180.5], [66.5, 180.5], [85.5, 180.5], [104.5, 180.5], [123.5, 180.5], [142.5, 180.5], [161.5, 180.5]
    ];
    const enemies = [];

})

scene("start", () => {
    const background = add([
        sprite('background'),
    ])
    const title = add([
        text("Bee Careful!"),
        scale(0.28),
        origin("center"),
        pos(95, 70),
    ])
    const start = add([
        text("Start"),
        scale(0.25),
        origin("center"),
        area({ cursor: "pointer", scale: 0.25 }),
        pos(95, 100),

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
    go("start", {});

}

start();



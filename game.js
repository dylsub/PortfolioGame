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

//##########################################################//
//Movement

offsetx = 19;
offsety = 19;
bRight = 151.5;
bLeft = 28.5;
bUp = 28.5;
bDown = 151.5;

isKeyDown = false;
onKeyDown("left", () => {
    if (!isKeyDown) {
        player.angle = 270;
        if (player.pos.x > bLeft) {
            player.moveTo(player.pos.x - offsetx, player.pos.y)
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
        if (player.pos.x < bRight) {
            player.moveTo(player.pos.x + offsetx, player.pos.y)
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
        if (player.pos.y > bUp) {
            player.moveTo(player.pos.x, player.pos.y - offsety)
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
        if (player.pos.y < bDown) {
            player.moveTo(player.pos.x, player.pos.y + offsety)
        }
    }
    isKeyDown = true;
})
onKeyRelease("down", () => {
    isKeyDown = false;
})

onKeyDown("space", () => {
    debug.log(player.pos.x + ", " + player.pos.y);
});

//###########################################################//




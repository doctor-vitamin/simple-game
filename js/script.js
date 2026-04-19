const wait = (ms) => new Promise(res => setTimeout(res, ms));
let player;
let meteors = [];
let score = 0;
let best = 0;
let keys = {};
let game_started = false;
const min_x = 640;
const max_y = 95;
const max_x = 1217;
const min_y = 670;

window.addEventListener("DOMContentLoaded", () => {

    window.addEventListener("keydown", e => {
        keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", e => {
        keys[e.key.toLowerCase()] = false;
    });

});

function make_player(x,y,texture, speed){
    this.x = x;
    this.y = y;
    this.alive = true;
    this.texture = new Image();
    this.texture.src = texture;
    this.speed = speed;
}

function make_meteor(x,y,texture, speed){
    this.x = x;
    this.y = y;
    this.texture = new Image();
    this.texture.src = texture;
    this.speed = speed;
}

function pl_control(){
    if (keys["w"] || keys["ц"]) player.y -= player.speed;
    if (keys["s"] || keys["ы"] || keys["і"]) player.y += player.speed;
    if (keys["a"] || keys["ф"]) player.x -= player.speed;
    if (keys["d"] || keys["в"]) player.x += player.speed;
}

async function spawn_meteor(){

    if(player && player.alive){
        while (true) {
            score += 1;

            for(let i = 0; i < 5; i++){
                const meteor_div = document.createElement("div");
                meteor_div.className = "meteor";
                document.body.appendChild(meteor_div);

                let rx = Math.floor(Math.random() * 550);
                let m = new make_meteor(640 + rx,110,"/assets/meteor1.png", 5);

                m.bind = meteor_div;
                m.bind.style.backgroundImage = `url('${m.texture.src}')`;
                m.bind.style.position = "absolute";
                m.bind.style.left = `${m.x}px`;
                m.bind.style.top = `${m.y}px`;
                m.bind.style.width = "100px";
                m.bind.style.height = "100px";
                m.bind.style.imageRendering = "pixelated";
                m.bind.style.backgroundRepeat = "no-repeat";
                m.bind.style.backgroundSize = "contain";
                m.bind.style.zIndex = "10";

                meteors.unshift(m);
            }

            if(!player.alive){
                meteors.forEach(m => m.bind.remove());
                meteors = [];
                game_started = false;
                if(score >= best){
                    score -= 1;
                    best = score;
                }
                alert(`score: ${score}\nbest: ${best}`);
                player = null;
                break;
            }

            await wait(3000);
        }
    }
}

//the whole game is here
async function game_upd(){
    const pl = document.getElementById("player");
    pl.style.backgroundImage = `url('${player.texture.src}')`;
    pl.style.width = "60px";
    pl.style.height = "60px";

    const deltatime = 16.67;

    while (true){

        pl.style.left = player.x + "px";
        pl.style.top = player.y + "px";
        pl_control();

        if(player.x > max_x) player.x = max_x;
        if(player.x < min_x) player.x = min_x;
        if(player.y < max_y) player.y = max_y;
        if(player.y > min_y) player.y = min_y;

        meteors.forEach((m, index) => {
            m.y += m.speed;
            m.bind.style.top = m.y + "px";

            if (player.x < m.x + 100 && player.x + 60 > m.x && player.y < m.y + 100 && player.y + 60 > m.y){
                player.alive = false;
                m.bind.remove();
            }

            if (m.y >= window.innerHeight - 275 ) m.bind.remove();
        });

        if(!player.alive) break;

        await wait(deltatime);
    }
}

function game_state(){
    if(game_started) return;
    game_started = true;

    player = new make_player(930,640,"/assets/alien.png", 10);

    if(player && player.alive){
        score = 0;
        game_upd();
        spawn_meteor();
    }
}
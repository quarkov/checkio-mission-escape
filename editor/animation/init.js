//Dont change it
//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function escapeCanvas(dom, data) {

            if (! data || ! data.ext) {
                return
            }

            const input = data.in
            const explanation = data.ext.explanation
            const answer = data.ext.answer

            const [jar_w, jar_h, jar_exit] = input[0]
            const [fly_x, fly_y, fly_vx, fly_vy] = input[1]
            const coords = explanation[1]

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const FONT_SIZE = 10
            const BG_COLOR = '#dfe8f7'
            const attr = {
                jar: {
                    'stroke-width': '1px',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                cylinder: {
                    'stroke-width': '2px',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                blood: {
                    'stroke': '#FABA00',
                    'stroke-width': '22px',
                },
                fly: {
                    'fill': 'black',
                    'stroke-width': 1.5,
                },
            }

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const JAR_MAX = 250
            const JAR_TOP = 30
            const JAR_LEFT = 70
            const SKY_HEIGHT = 5000
            const ratio = JAR_MAX/Math.max(jar_w, jar_h)
            const paper_width = JAR_LEFT+jar_w*ratio+10
            const paper_height = 285
            const paper = Raphael(dom, paper_width, paper_height, 0, 0);

            /*----------------------------------------------*
             *
             * explanation
             *
             *----------------------------------------------*/
            if (explanation[0].length) {
                const p = document.createElement('p')
                p.innerHTML = explanation[0]
                p.style.width = paper_width+'px'
                dom.appendChild(p)
            }

            /*----------------------------------------------*
             *
             * draw
             *
             *----------------------------------------------*/
            // jar
            const upper = jar_w/2-jar_exit/2
            const jar_path = [
                'M', upper*ratio+JAR_LEFT, JAR_TOP,
                'h', -upper*ratio, 'v', jar_h*ratio,
                'h', jar_w*ratio, 'v', -jar_h*ratio, 'h', -upper*ratio
            ]
            paper.path(jar_path).attr(attr.jar).attr({'stroke': '#294270'})

            // fly
            const fly = paper.circle(fly_x*ratio+JAR_LEFT,
                (jar_h-fly_y)*ratio+JAR_TOP, 1).attr(attr.fly)

            // cylinder
            const CYLINDER_TOP = 25
            const CYLINDER_LEFT = 15
            const blood = paper.path(['M', CYLINDER_LEFT+15, CYLINDER_TOP+5,
                'v', 250]).attr(attr.blood)
            paper.path(['M', CYLINDER_LEFT, CYLINDER_TOP,
                'v', 255, 'h', -10, 'h', 50, 'h', -10, 'v', -255]
            ).attr({'stroke': '#294270'}).attr(attr.cylinder)
            paper.text(CYLINDER_LEFT+12, CYLINDER_TOP+5, 100)
            paper.text(CYLINDER_LEFT+12, CYLINDER_TOP+130, 50)
            for (let j = 0; j < 4; j += 1) {
                paper.path(['M', CYLINDER_LEFT, CYLINDER_TOP+5+j*63, 'h', 5])
            }

            /*----------------------------------------------*
             *
             * animation
             *
             *----------------------------------------------*/
            let init_x = fly_x
            let init_y = fly_y
            let i = 0

            function fly_move() {

                // last blood and fly dead
                if (i >= coords.length) {
                    if (! answer) {
                        blood.animate({'path': ['M', CYLINDER_LEFT+15,
                            CYLINDER_TOP+5+(i)*(250/20), 'V', CYLINDER_TOP+255]}, 500,)
                        fly.animate({'transform': "t "
                            + (coords[i-1][0]-init_x)*ratio
                            + "," + -(0-init_y)*ratio}, 4000)
                    }
                    return
                }

                let [next_x, next_y] = coords[i]
                let dx = next_x - init_x
                let dy = -(next_y - init_y)

                // fly escape
                if (answer && i === coords.length-1) {
                    const last_dx = (next_x-(i ? coords[i-1][0] : init_x))
                    if (last_dx !== 0) {
                        const d = (next_y-(i ? coords[i-1][1] : init_y)) / last_dx
                        const section = next_y - next_x * d
                        next_x = (SKY_HEIGHT- section) / d
                        dx = next_x - init_x
                    }
                    next_y = SKY_HEIGHT
                    dy = -(SKY_HEIGHT - init_y)
                }

                const speed = Math.sqrt(
                    (next_x-(i ? coords[i-1][0] : init_x))**2
                     + (next_y-(i ? coords[i-1][1] : init_y))**2
                ) * (1000 / Math.max(jar_w, jar_h))

                i += 1

                // fly
                fly.animate({'transform': "t " + dx*ratio + "," + dy*ratio},
                    speed, fly_move)

                // blood
                if (i > 1) {
                    blood.animate({'path': ['M', CYLINDER_LEFT+15,
                        CYLINDER_TOP+5+(i-1)*(250/20), 'V', CYLINDER_TOP+255]}, 500)
                }
            }
            fly_move()
        }

        var $tryit;

        var io = new extIO({
            multipleArguments: true,
            functions: {
                python: 'escape',
                js: 'escape'
            },
            animation: function($expl, data){
                escapeCanvas(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);

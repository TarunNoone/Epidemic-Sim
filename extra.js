class Person {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.status = 'S';
        this.index = index;
    }
}

function drawPerson(p) {
    switch(p.status) {
        case 'S': fill(0); stroke(100); break;
        // case 'S': fill("#77dd77"); break;
        // case 'I': fill("#fdfd96"); break;
        case 'I': fill("#ff6961"); stroke(0); break;
        case 'R': fill("#77dd77"); stroke(0); break;
        // case 'R': fill("#fddd5c"); break;
        // case 'R': fill("#ffb449"); break;
    }
    ellipse(p.x, p.y, r, r);
}

// let infectedCount = 0, recoveredCount = 0;
function infect(neighbours) {
    for(p of neighbours) {
        if(p.status == 'S') {
            let daysTillInf = 1;
            while(true) {
                if(random(1) > tau) {
                    daysTillInf++;
                } else {
                    // infectedCount++;
                    let i = 0;
                    while(i < priorityQueue.length && priorityQueue[i][0] < dayCount + daysTillInf) {
                        i++;
                    }
                    priorityQueue.splice(i, 0, [dayCount + daysTillInf, 'I', p]);
                    // console.log([dayCount + daysTillInf, 'I', p])
                    break;
                }
            }
        }
    }
}

function recover(p) {
    let daysTillRec = 1;
    while(true) {
        if(random(1) > gamma) {
            daysTillRec++;
        } else {
            // recoveredCount++;
            let i = 0;
            while(i < priorityQueue.length && priorityQueue[i][0] < dayCount + daysTillRec) {
                i++;
            }
            priorityQueue.splice(i, 0, [dayCount + daysTillRec, 'R', p]);
            // console.log([dayCount + daysTillRec, 'R', p])
            break;
        }
    }
}

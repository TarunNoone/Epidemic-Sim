let people = [], quadtree;
let priorityQueue = [];
let infected = [], recovered = [];
let dayCount = 0;
const infinity = 1e7;
const tau = 0.5, gamma = 0.2; 
const dayLimit = 1000;
let framerate;
let numOfPeople = 500;
const useFrameRate = true;
const r = 10; // radius to draw each person
const repelD = 20; // radius within which another person cannot be
const searchR = 40; // radius within which neighbours occur
let writer;
let info;
let S=0, I=0, R=0;
function setup() {
    // writer = createWriter('output.txt');
    // createCanvas(1000, 1000);
    createCanvas(windowWidth-200, windowHeight-50);
    info = createP("Sample Text");
    // let cnv = createCanvas(600, 400);
    info.position(width + 10, 0);
    framerate = createSlider(1, 20, 10);
    framerate.position(width + 10, 160);
    // cnv.position(0, 0);
    stroke(255);
    info.show();
    info.style("color", "#ffffff");
    info.style("font-family", "Courier New");
    info.style("font-size", "20px");
    numOfPeople = floor(width/30 * height/30);
    rectMode(CENTER);
    noFill();
    stroke(255);
    rect(width/2, height/2, width, height);

    let boundary = new Rectangle(width/2, height/2, width/2, height/2);
    quadtree = new Quadtree(boundary, 1);

    for(let i=0; i < numOfPeople; i++) {
        let newPerson = new Person(random(r, width-r), random(r, height-r), people.length);
        let count = 0;
        while(count++ < 10 && quadtree.queryCircle(new Circle(newPerson.x, newPerson.y, repelD, repelD)).length > 0) {
            newPerson = new Person(random(r, width-r), random(r, height-r), people.length);
            // continue; // skip the new person if he/she is within the "repelD" distance
        }
        if(quadtree.queryCircle(new Circle(newPerson.x, newPerson.y, repelD, repelD)).length > 0) {
            continue;
        }
        people.push(newPerson);
        quadtree.insert(newPerson);
    }

    stroke(100);
    for(p of people) {
        let searchRadius = new Circle(p.x, p.y, searchR);
        p.neighbours = quadtree.queryCircle(searchRadius);
        for(let p2 of p.neighbours) {
            if(p2 == p) continue;
            line(p.x, p.y, p2.x, p2.y);
        }
    }
    // stroke(100);
    
    // susceptible = people;

    for(let i=0; i < 1; i++) {  
        let infectRand = floor(random(people.length));
        if(people[infectRand].status == 'I') continue;
        I++;
        S--;
        people[infectRand].status = 'I';
        infect(people[infectRand].neighbours);
        recover(people[infectRand]);
    }
    // infected.push(infectRand);
    // let daysTillInf = 0;
    // while(true) {
    //     if(random(1) < tau) {
    //         daysTillInf++;
    //     } else {
    //         priorityQueue.push([dayCount + daysTillInf, 'I', people[infectRand]]);
    //         break;
    //     }
    // }

    for(let p of people) drawPerson(p);
    if(useFrameRate) {
        frameRate(framerate.value());
    }
    S += people.length; // starting with random no. of infected people above. To compensate that use +=
    I += 0;
    R += 0;
    let setInfo = "Days: ";
    setInfo += dayCount;
    setInfo += "<br/>Susceptible: ";
    setInfo += S;
    setInfo += "<br/>Infected: ";
    setInfo += I;
    setInfo += "<br/>Recovered: ";
    setInfo += R;
    setInfo += "<br/><br/>#Days/sec: ";
    setInfo += frameRate();

    info.html(setInfo);
}


// let infectoRec = 0;
function draw() {
    // saveCanvas("screenshot", "png");
    frameRate(framerate.value());
    if(framerate.value() != 0) {
    for(let i = 0; i < priorityQueue.length ; i++) {
        if(priorityQueue[i][0] == dayCount) {
            if(priorityQueue[i][1] == 'I') {
                // If the person is infected or recoverd, it doesn't affect him/her.
                if(priorityQueue[i][2].status == 'S') {
                    // infectoRec++;
                    priorityQueue[i][2].status = 'I';
                    S--;
                    I++;
                    recover(priorityQueue[i][2]);
                    infect(priorityQueue[i][2].neighbours);
                }
            } else if(priorityQueue[i][1] == 'R') {
                if(priorityQueue[i][2].status == 'I') {
                    I--;
                    R++;
                    priorityQueue[i][2].status = 'R';
                } 
            }
            priorityQueue.splice(i--, 1);
        } else {
            break;
        }
        // writer.write(dayCount);
        // writer.write(" ");
        // writer.write(S);
        // writer.write(" ");
        // writer.write(I);
        // writer.write(" ");
        // writer.write(R);
        // writer.write("\n");
    }

    // let recCount = 0;
    // for(x of priorityQueue) {
    //     if(x[1] == 'R') {
    //         recCount++;
    //     }
    // }
    // console.log("Rec Count: ", recCount);


    let setInfo = "Days: ";
    setInfo += dayCount;
    setInfo += "<br/>Susceptible: ";
    setInfo += S;
    setInfo += "<br/>Infected: ";
    setInfo += I;
    setInfo += "<br/>Recovered: ";
    setInfo += R;
    setInfo += "<br/><br/>#Days/sec: ";
    setInfo += framerate.value();

    info.html(setInfo);
    for(p of people) drawPerson(p);

    if(priorityQueue.length == 0 || ++dayCount > dayLimit) {
        // console.log(priorityQueue);
        // for(p of people) {
        //     if(p.status == 'I')
        //     console.log(p);
        // }

        // // coloring uneffected people blue at the end
        // stroke(0);
        // clear();
        // for(p of people) {
        //     if(p.status == 'S') {
        //         fill("blue");
        //     } else if(p.status == 'R') {
        //         fill(50);
        //     }
        //     ellipse(p.x, p.y, r, r);
        // }
        // writer.close();
        noLoop();
    }
    // for(p of people) drawPerson(p);
    }
}

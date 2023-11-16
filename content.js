function solveAll() {
    solveAnimations();
    solveMultipleChoice();
    solveShortAnswer();
    // Drag and Drop here
}

function nextPage() {
    let nextBtn = document.getElementsByClassName('nav-text next');
    if (nextBtn.length > 0) {
        nextBtn[0].click();
    }
}

function getStatus() {
    let status = document.querySelectorAll('div.activity-title-bar > div.activity-description > div.title-bar-chevron-container > div');
    let res = true;
    for (const s of status) {
        let question = s.parentElement.parentElement.parentElement.parentElement;
        try
        {
            if (question.children[1].children[1].children[1].className.includes('draggable')) 
                continue;
        }
        catch (e) {}
        if (s.ariaLabel != 'Activity completed') {
            res = false;
            break;
        }
    }
    return res;
}

function solveAnimations() {
    for (const doubleSpeedBtn of document.querySelectorAll('[aria-label="2x speed"]'))
        doubleSpeedBtn.click()
    for (const startBtn of document.getElementsByClassName("start-button"))
        startBtn.click();

    setInterval(function () {
        if (document.getElementsByClassName("play-button").length > 0) {
            let playBtns = document.getElementsByClassName('play-button')
            for (let i = 0; i < playBtns.length; i++) {
                if (!playBtns[i]
                    .className
                    .replace(/\s+/g, ' ')
                    .split(' ')
                    .includes('rotate-180')) {
                    playBtns[i].click();
                }
            }
        }
    }, 1500);
}

//  // Prath's version
//function solveMultipleChoice() {
//    let i = 0;
//    let mc = document.querySelectorAll('input[type=radio]');
//    setInterval(() => {
//        if (i < mc.length) {
//            mc[i].click();
//            i++;
//        }
//    }, 300);
//}
//
//  // Charles Young's version
//function solveMultipleChoice() {
//    for (const radio of document.querySelectorAll('input[type=radio]'))
//        radio.click()
//}

function solveMultipleChoice() {
    for (const radio of document.querySelectorAll('input[type=radio]'))
        radio.click()
}

    // Prath's version
function solveShortAnswer() {
    console.log(document.getElementsByClassName('show-answer-button'));
    for (const answerBtn of document.getElementsByClassName('show-answer-button')) {
        setTimeout(() => answerBtn.click(), 300);
        setTimeout(() => answerBtn.click(), 300);
    }

    setTimeout(() => {
        let answers = document.getElementsByClassName('forfeit-answer');
        let answerBoxes = document.getElementsByClassName('zb-text-area');

        for (let i = 0; i < answers.length; i++) {
            setTimeout(() => answerBoxes[i].focus(), 1000);
            setTimeout(() => answerBoxes[i].select(), 1000);

            setTimeout(() => {
                answerBoxes[i].value = answers[i].innerHTML;
                answerBoxes[i].dispatchEvent(new Event('input', {bubbles: true}));
            }, 1000);
        }

        for (const checkBtn of document.getElementsByClassName('check-button')) {
            setTimeout(() => checkBtn.click(), 1000);
            setTimeout(() => checkBtn.click(), 1000);
        }
    }, 1000);
}

    //Charles Young's version
//function solveShortAnswer() {
//    for (const answerBtn of document.getElementsByClassName('show-answer-button')) {
//        answerBtn.click();
//        answerBtn.click();
//    }
//
//    let answers = document.getElementsByClassName('forfeit-answer');
//    let answerBoxes = document.getElementsByClassName('zb-text-area');
//
//    for (let i = 0; i < answers.length; i++) {
//        answerBoxes[i].focus();
//        answerBoxes[i].select();
//        answerBoxes[i].value = answers[i].innerHTML;
//    }
//
//    // tried simulating keystrokes and mouse clicks but it still doesn't register the answer until the user clicks on the box :/
//
//    for (const checkBtn of document.getElementsByClassName('check-button')) {
//        checkBtn.click();
//        checkBtn.click();
//    }
//}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.message) {
            case "solveAuto":
                console.log("Solving automatically");
                solveAll();
                setInterval(() => {
                    if (getStatus()) {
                        nextPage();
                        setTimeout(() => solveAll(), 1000);
                    }
                }, 1000);
                break;
            case "solveAll":
                solveAll();
                break;
            case "solveAnimations":
                solveAnimations();
                break;
            case "solveMC":
                solveMultipleChoice();
                break;
            case "solveSA":
                solveShortAnswer();
                break;
            case "solveDD":
                //Drag and Drop here
                break;
            default:
                console.log("Unknown message: " + request.message);
        }
    }
);
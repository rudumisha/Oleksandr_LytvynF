let question_field = document.querySelector('.question');
let answer_buttons = document.querySelectorAll('.answer');
let container_h3 = document.querySelector('.container_h3');
let container_main = document.querySelector('.main');
let container_start = document.querySelector('.start');
let start_button = document.querySelector('.start-btn');


let timerElement = document.getElementById('timer');
let timeRemaining = 15; // Початкове значення
let timerInterval;
let gameDuration = 15; // За замовчуванням 15 секунд


let cookie = false;
let cookies = document.cookie.split('; ');


for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].split('=')[0] === 'numbers_high_score') {
        cookie = cookies[i].split('=')[1];
        break;
    }
}


function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


let signs = ['+', '-', '*', '/'];


function getRandomSign() {
    return signs[randint(0, 3)];
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


if (cookie) {
    let data = cookie.split('/');
    container_h3.innerHTML = `<h3>Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}.
    Точність - ${Math.round((data[1] * 100) / data[0])}%.</h3>`;
}


class Question {
    constructor() {
        let a = randint(1, 30);
        let b = randint(1, 30);
        let sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        if (sign === '+') {
            this.correct = a + b;
        } else if (sign === '-') {
            this.correct = a - b;
        } else if (sign === '*') {
            this.correct = a * b;
        } else if (sign === '/') {
            this.correct = Math.round((a / b) * 100) / 100;
        }
        this.answers = [
            randint(this.correct - 15, this.correct - 1),
            randint(this.correct - 15, this.correct - 1),
            this.correct,
            randint(this.correct + 1, this.correct + 15),
            randint(this.correct + 1, this.correct + 15)
        ];
        shuffle(this.answers);
    }


    display() {
        question_field.innerHTML = this.question;


        for (let i = 0; i < this.answers.length; i++) {
            answer_buttons[i].innerHTML = this.answers[i];
        }
    }
}


// Функція для оновлення таймера
function updateTimer() {
    if (timeRemaining > 0) {
        timerElement.textContent = `Час: ${timeRemaining}s`;
        timeRemaining--;
    } else {
        clearInterval(timerInterval);
        timerElement.style.display = 'none';
        endGame();
    }
}


// Функція для вибору тривалості гри
function setTimer(duration) {
    timeRemaining = duration;
    gameDuration = duration; // Оновлюємо тривалість гри
}


// Функція для завершення гри
function endGame() {
    container_main.style.display = 'none';
    container_start.style.display = 'flex';
    let accuracy = total_answers_given > 0 ? Math.round((correct_answer_given * 100) / total_answers_given) : 0;
    container_h3.innerHTML = `Ви дали ${correct_answer_given} правильних із ${total_answers_given}.
    Точність - ${accuracy}%`;


    let new_cookie = `numbers_high_score=${total_answers_given}/${correct_answer_given}; max-age=100000000000000`;
    document.cookie = new_cookie;
}


// Початок гри
start_button.addEventListener('click', function () {
    container_main.style.display = 'flex';
    container_start.style.display = 'none';
    current_question = new Question();
    current_question.display();


    correct_answer_given = 0;
    total_answers_given = 0;


    // Запускаємо таймер
    clearInterval(timerInterval);
    timerElement.style.display = 'block';
    timerInterval = setInterval(updateTimer, 1000);


    // Встановлюємо тривалість гри
    setTimeout(endGame, gameDuration * 1000);
});


// Обробка натискання відповідей
for (let i = 0; i < answer_buttons.length; i++) {
    answer_buttons[i].addEventListener('click', function () {
        if (answer_buttons[i].innerHTML == current_question.correct) {
            correct_answer_given += 1;
            answer_buttons[i].style.background = '#00FF00';
        } else {
            answer_buttons[i].style.background = '#FF0000';
        }


        total_answers_given += 1;


        anime({
            targets: answer_buttons[i],
            background: '#FFFFFF',
            duration: 500,
            delay: 100,
            easing: 'linear'
        });


        current_question = new Question();
        current_question.display();
    });
}


// Прив'язуємо кнопки до функції встановлення часу
document.getElementById('start_15').addEventListener('click', function () { setTimer(15); });
document.getElementById('start_30').addEventListener('click', function () { setTimer(30); });
document.getElementById('start_45').addEventListener('click', function () { setTimer(45); });






function setTimer(duration) {
    timeRemaining = duration;
    gameDuration = duration; // Оновлюємо тривалість гри
    
    // Ховаємо кнопки вибору часу
    document.querySelector('.abayunda').style.display = 'none';
}


function endGame() {
    container_main.style.display = 'none';
    container_start.style.display = 'flex';

    let accuracy = total_answers_given > 0 ? Math.round((correct_answer_given * 100) / total_answers_given) : 0;
    container_h3.innerHTML = `Ви дали ${correct_answer_given} правильних із ${total_answers_given}.
    Точність - ${accuracy}%`;

    // Показуємо кнопки вибору часу знову
    document.querySelector('.abayunda').style.display = 'flex';

    let new_cookie = `numbers_high_score=${total_answers_given}/${correct_answer_given}; max-age=100000000000000`;
    document.cookie = new_cookie;
}

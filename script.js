// Math Mountain App - Main Logic

class MathMountainApp {
    constructor() {
        this.problems = [];
        this.currentAnswers = [];
        this.animalShapes = ['cat', 'dog', 'bear', 'frog', 'lion', 'panda', 'monkey', 'pig'];
        this.wordProblems = [];
        this.wordProblemAnswers = [];
        this.sessionHistory = [];
        this.currentSession = null;
        this.viewingHistory = false;
        
        // Tracing variables
        this.tracingMode = 'letters';
        this.currentTracingIndex = 0;
        this.tracingItems = [];
        this.tracingScores = [];
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.tracingPath = [];
        this.letterPaths = {};
        this.countingComplete = false;
        this.countedObjects = 0;
        
        this.loadHistory();
        this.init();
    }

    init() {
        // Tab navigation
        this.setupTabs();
        
        // Sync controls between top and bottom
        this.syncControls();
        
        // Generate initial problems
        this.generateProblems();
        
        // Event listeners
        document.getElementById('generate-top').addEventListener('click', () => this.generateProblems());
        document.getElementById('generate-bottom').addEventListener('click', () => this.generateProblems());
        document.getElementById('check-answers').addEventListener('click', () => this.checkAnswers());
        
        // Word problem event listeners
        document.getElementById('generate-word-problems').addEventListener('click', () => this.generateWordProblems());
        document.getElementById('check-word-problems').addEventListener('click', () => this.checkWordProblems());
        
        // Word problem event listeners
        document.getElementById('generate-word-problems').addEventListener('click', () => this.generateWordProblems());
        document.getElementById('check-word-problems').addEventListener('click', () => this.checkWordProblems());
        
        // History event listeners
        document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
        
        // Tracing event listeners
        document.getElementById('start-tracing').addEventListener('click', () => this.startTracing());
        document.getElementById('next-tracing').addEventListener('click', () => this.nextTracing());
        document.getElementById('clear-trace').addEventListener('click', () => this.clearCanvas());
        document.getElementById('restart-tracing').addEventListener('click', () => this.startTracing());
        document.getElementById('tracing-mode').addEventListener('change', (e) => {
            this.tracingMode = e.target.value;
        });
        
        // Initialize canvas
        this.initCanvas();
        
        // Render history
        this.renderHistory();
        
        // Sync difficulty selects
        document.getElementById('difficulty-top').addEventListener('change', (e) => {
            document.getElementById('difficulty-bottom').value = e.target.value;
        });
        document.getElementById('difficulty-bottom').addEventListener('change', (e) => {
            document.getElementById('difficulty-top').value = e.target.value;
        });
        
        // Sync problem count inputs
        document.getElementById('problem-count-top').addEventListener('input', (e) => {
            const value = this.validateProblemCount(e.target.value);
            e.target.value = value;
            document.getElementById('problem-count-bottom').value = value;
        });
        document.getElementById('problem-count-bottom').addEventListener('input', (e) => {
            const value = this.validateProblemCount(e.target.value);
            e.target.value = value;
            document.getElementById('problem-count-top').value = value;
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs and buttons
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabName = button.dataset.tab;
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    syncControls() {
        const topDifficulty = document.getElementById('difficulty-top').value;
        const topCount = document.getElementById('problem-count-top').value;
        document.getElementById('difficulty-bottom').value = topDifficulty;
        document.getElementById('problem-count-bottom').value = topCount;
    }

    validateProblemCount(value) {
        let count = parseInt(value);
        if (isNaN(count) || count < 10) count = 10;
        if (count > 50) count = 50;
        return count;
    }

    getRandomNumber(difficulty) {
        switch(difficulty) {
            case 'low':
                return Math.floor(Math.random() * 9) + 1; // 1-9
            case 'medium':
                return Math.floor(Math.random() * 90) + 10; // 10-99
            case 'high':
                // 50% chance of 3 digits, 50% chance of 4 digits
                return Math.random() > 0.5 
                    ? Math.floor(Math.random() * 900) + 100  // 100-999
                    : Math.floor(Math.random() * 9000) + 1000; // 1000-9999
            default:
                return Math.floor(Math.random() * 90) + 10;
        }
    }

    generateMathMountain(difficulty) {
        // Math Mountain: two base numbers that add up to the top number
        const num1 = this.getRandomNumber(difficulty);
        const num2 = this.getRandomNumber(difficulty);
        const top = num1 + num2;
        
        // Randomly decide which number to hide (top, left base, or right base)
        const hidePosition = Math.floor(Math.random() * 3);
        
        let problem = {
            top: top,
            base1: num1,
            base2: num2,
            hidePosition: hidePosition, // 0 = top, 1 = base1, 2 = base2
            correctAnswer: hidePosition === 0 ? top : (hidePosition === 1 ? num1 : num2)
        };
        
        return problem;
    }

    generateProblems() {
        const difficulty = document.getElementById('difficulty-top').value;
        const count = parseInt(document.getElementById('problem-count-top').value);
        
        // Clear viewing history mode
        this.viewingHistory = false;
        this.clearActiveHistory();
        
        // Clear previous problems and answers
        this.problems = [];
        this.currentAnswers = [];
        
        // Hide results section
        document.getElementById('results').classList.add('hidden');
        
        // Generate new problems
        for (let i = 0; i < count; i++) {
            this.problems.push(this.generateMathMountain(difficulty));
            this.currentAnswers.push(null);
        }
        
        // Render problems
        this.renderProblems();
    }

    renderProblems() {
        const container = document.getElementById('problems-container');
        container.innerHTML = '';
        
        this.problems.forEach((problem, index) => {
            const problemDiv = document.createElement('div');
            const animalClass = this.animalShapes[index % this.animalShapes.length];
            problemDiv.className = `problem-container animal-${animalClass}`;
            problemDiv.dataset.index = index;
            
            const mountainDiv = document.createElement('div');
            mountainDiv.className = 'math-mountain';
            
            // Top of mountain (sum)
            const topDiv = document.createElement('div');
            topDiv.className = 'mountain-top';
            if (problem.hidePosition === 0) {
                topDiv.innerHTML = '<input type="number" class="answer-input" data-index="' + index + '" placeholder="?">';
            } else {
                topDiv.textContent = problem.top;
            }
            
            // Base of mountain (addends)
            const baseDiv = document.createElement('div');
            baseDiv.className = 'mountain-base';
            
            const base1Div = document.createElement('div');
            base1Div.className = 'base-number';
            if (problem.hidePosition === 1) {
                base1Div.innerHTML = '<input type="number" class="answer-input" data-index="' + index + '" placeholder="?">';
            } else {
                base1Div.textContent = problem.base1;
            }
            
            const base2Div = document.createElement('div');
            base2Div.className = 'base-number';
            if (problem.hidePosition === 2) {
                base2Div.innerHTML = '<input type="number" class="answer-input" data-index="' + index + '" placeholder="?">';
            } else {
                base2Div.textContent = problem.base2;
            }
            
            baseDiv.appendChild(base1Div);
            baseDiv.appendChild(base2Div);
            
            mountainDiv.appendChild(topDiv);
            mountainDiv.appendChild(baseDiv);
            problemDiv.appendChild(mountainDiv);
            
            container.appendChild(problemDiv);
        });
        
        // Add event listeners to inputs to retain values
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.currentAnswers[index] = e.target.value;
            });
        });
    }

    checkAnswers() {
        if (this.viewingHistory) {
            alert('You are viewing a previous session. Generate new problems to take a new test.');
            return;
        }
        
        let correctCount = 0;
        let incorrectCount = 0;
        const userAnswers = [];
        
        document.querySelectorAll('.answer-input').forEach(input => {
            const index = parseInt(input.dataset.index);
            const userAnswer = parseInt(input.value);
            const correctAnswer = this.problems[index].correctAnswer;
            const problemContainer = document.querySelector(`.problem-container[data-index="${index}"]`);
            
            // Save user answer
            userAnswers[index] = {
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: userAnswer === correctAnswer
            };
            
            // Remove previous status
            problemContainer.classList.remove('correct', 'incorrect');
            const oldIcon = problemContainer.querySelector('.status-icon');
            if (oldIcon) oldIcon.remove();
            
            // Check answer
            if (userAnswer === correctAnswer) {
                correctCount++;
                problemContainer.classList.add('correct');
                const icon = document.createElement('span');
                icon.className = 'status-icon';
                icon.textContent = '✅';
                problemContainer.appendChild(icon);
            } else {
                incorrectCount++;
                problemContainer.classList.add('incorrect');
                const icon = document.createElement('span');
                icon.className = 'status-icon';
                icon.textContent = '❌';
                problemContainer.appendChild(icon);
            }
        });
        
        // Save session
        this.saveSession('Math Mountains', this.problems, userAnswers, correctCount, incorrectCount);
        
        // Show results
        this.showResults(correctCount, incorrectCount);
    }

    showResults(correct, incorrect) {
        const resultsSection = document.getElementById('results');
        const resultsMessage = document.getElementById('results-message');
        const resultsDetails = document.getElementById('results-details');
        
        const total = correct + incorrect;
        const percentage = Math.round((correct / total) * 100);
        
        let message = '';
        if (percentage === 100) {
            message = '🎉 AMAZING! Perfect Score! 🎉';
        } else if (percentage >= 80) {
            message = '🌟 Fantastic Job! Keep it up! 🌟';
        } else if (percentage >= 60) {
            message = '👍 Good Work! Practice makes perfect! 👍';
        } else {
            message = '💪 Keep Trying! You can do it! 💪';
        }
        
        resultsMessage.textContent = message;
        resultsDetails.innerHTML = `
            <p>✅ Correct: ${correct} / ${total}</p>
            <p>❌ Incorrect: ${incorrect} / ${total}</p>
            <p>📊 Score: ${percentage}%</p>
        `;
        
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Word Problems Methods
    generateWordProblems() {
        const difficulty = document.getElementById('wp-difficulty').value;
        const count = parseInt(document.getElementById('wp-count').value);
        
        // Clear viewing history mode
        this.viewingHistory = false;
        this.clearActiveHistory();
        
        this.wordProblems = [];
        this.wordProblemAnswers = [];
        
        document.getElementById('wp-results').classList.add('hidden');
        
        for (let i = 0; i < count; i++) {
            this.wordProblems.push(this.createWordProblem(difficulty));
            this.wordProblemAnswers.push(null);
        }
        
        this.renderWordProblems();
    }

    createWordProblem(difficulty) {
        const templates = this.getWordProblemTemplates(difficulty);
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template();
    }

    getWordProblemTemplates(difficulty) {
        const templates = [];
        
        // Template 1: Two-color cards problem (like the example)
        templates.push(() => {
            const person1 = this.getRandomName();
            const person2 = this.getRandomName();
            const total1 = difficulty === 'easy' ? this.getRandom(5, 15) : difficulty === 'medium' ? this.getRandom(10, 30) : this.getRandom(20, 50);
            const total2 = difficulty === 'easy' ? this.getRandom(5, 15) : difficulty === 'medium' ? this.getRandom(10, 30) : this.getRandom(20, 50);
            const color1Count1 = this.getRandom(1, total1 - 1);
            const color1Count2 = this.getRandom(1, total2 - 1);
            const color2Count1 = total1 - color1Count1;
            const color2Count2 = total2 - color1Count2;
            const answer = color2Count1 + color2Count2;
            
            return {
                text: `${person1} has ${total1} cards out of which ${color1Count1} are red cards. ${person2} has ${total2} cards out of which ${color1Count2} are red. They both have only two colored cards, either red or green. How many total green cards are there between them?`,
                answer: answer,
                explanation: `${person1} has ${color2Count1} green cards (${total1} - ${color1Count1}). ${person2} has ${color2Count2} green cards (${total2} - ${color1Count2}). Total green = ${color2Count1} + ${color2Count2} = ${answer}`
            };
        });
        
        // Template 2: Shopping problem
        templates.push(() => {
            const person = this.getRandomName();
            const item1 = this.getRandomItem();
            const item2 = this.getRandomItem();
            const price1 = difficulty === 'easy' ? this.getRandom(2, 10) : difficulty === 'medium' ? this.getRandom(5, 25) : this.getRandom(15, 50);
            const price2 = difficulty === 'easy' ? this.getRandom(2, 10) : difficulty === 'medium' ? this.getRandom(5, 25) : this.getRandom(15, 50);
            const money = price1 + price2 + (difficulty === 'easy' ? this.getRandom(1, 5) : difficulty === 'medium' ? this.getRandom(5, 15) : this.getRandom(10, 30));
            const answer = money - price1 - price2;
            
            return {
                text: `${person} went shopping with $${money}. ${person} bought a ${item1} for $${price1} and a ${item2} for $${price2}. How much money does ${person} have left?`,
                answer: answer,
                explanation: `Money left = $${money} - $${price1} - $${price2} = $${answer}`
            };
        });
        
        // Template 3: Collection problem
        templates.push(() => {
            const person = this.getRandomName();
            const item = this.getRandomCollectible();
            const start = difficulty === 'easy' ? this.getRandom(10, 30) : difficulty === 'medium' ? this.getRandom(20, 60) : this.getRandom(50, 150);
            const gained = difficulty === 'easy' ? this.getRandom(3, 10) : difficulty === 'medium' ? this.getRandom(10, 30) : this.getRandom(20, 50);
            const lost = difficulty === 'easy' ? this.getRandom(2, 8) : difficulty === 'medium' ? this.getRandom(5, 20) : this.getRandom(10, 40);
            const answer = start + gained - lost;
            
            return {
                text: `${person} had ${start} ${item}. ${person} got ${gained} more ${item} as gifts and gave away ${lost} ${item} to friends. How many ${item} does ${person} have now?`,
                answer: answer,
                explanation: `Total = ${start} + ${gained} - ${lost} = ${answer} ${item}`
            };
        });
        
        // Template 4: Distance/Time problem
        templates.push(() => {
            const person = this.getRandomName();
            const activity = this.getRandomActivity();
            const dist1 = difficulty === 'easy' ? this.getRandom(5, 15) : difficulty === 'medium' ? this.getRandom(10, 40) : this.getRandom(30, 80);
            const dist2 = difficulty === 'easy' ? this.getRandom(5, 15) : difficulty === 'medium' ? this.getRandom(10, 40) : this.getRandom(30, 80);
            const answer = dist1 + dist2;
            
            return {
                text: `${person} ${activity} ${dist1} miles in the morning and ${dist2} miles in the afternoon. How many total miles did ${person} ${activity.includes('walk') ? 'walk' : activity.includes('bike') ? 'bike' : 'run'}?`,
                answer: answer,
                explanation: `Total miles = ${dist1} + ${dist2} = ${answer} miles`
            };
        });
        
        // Template 5: Food sharing problem
        templates.push(() => {
            const person1 = this.getRandomName();
            const person2 = this.getRandomName();
            const food = this.getRandomFood();
            const total = difficulty === 'easy' ? this.getRandom(10, 24) : difficulty === 'medium' ? this.getRandom(20, 60) : this.getRandom(50, 120);
            const person1Amount = this.getRandom(Math.floor(total * 0.3), Math.floor(total * 0.7));
            const answer = total - person1Amount;
            
            return {
                text: `${person1} and ${person2} shared ${total} ${food}. ${person1} ate ${person1Amount} ${food}. How many ${food} did ${person2} eat?`,
                answer: answer,
                explanation: `${person2} ate = ${total} - ${person1Amount} = ${answer} ${food}`
            };
        });
        
        return templates;
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomName() {
        const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sam', 'Jamie', 
                       'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Mason', 'Isabella', 'Ethan', 'Mia', 'Lucas'];
        return names[Math.floor(Math.random() * names.length)];
    }

    getRandomItem() {
        const items = ['book', 'toy', 'pencil', 'notebook', 'backpack', 'water bottle', 'lunch box', 'hat', 'ball', 'game'];
        return items[Math.floor(Math.random() * items.length)];
    }

    getRandomCollectible() {
        const items = ['stickers', 'trading cards', 'marbles', 'stamps', 'coins', 'buttons', 'rocks', 'shells', 'beads'];
        return items[Math.floor(Math.random() * items.length)];
    }

    getRandomActivity() {
        const activities = ['walked', 'biked', 'ran', 'jogged', 'hiked'];
        return activities[Math.floor(Math.random() * activities.length)];
    }

    getRandomFood() {
        const foods = ['cookies', 'candies', 'grapes', 'strawberries', 'crackers', 'chips', 'pretzels', 'blueberries'];
        return foods[Math.floor(Math.random() * foods.length)];
    }

    renderWordProblems() {
        const container = document.getElementById('word-problems-container');
        container.innerHTML = '';
        
        this.wordProblems.forEach((problem, index) => {
            const card = document.createElement('div');
            card.className = 'word-problem-card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <h3>Problem ${index + 1}</h3>
                <div class="word-problem-text">${problem.text}</div>
                <div class="word-problem-answer">
                    <label>Answer:</label>
                    <input type="number" class="wp-answer-input" data-index="${index}" placeholder="Type your answer">
                </div>
                <div class="word-problem-explanation">
                    <strong>Explanation:</strong> ${problem.explanation}
                </div>
            `;
            
            container.appendChild(card);
        });
        
        // Add event listeners to inputs
        document.querySelectorAll('.wp-answer-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.wordProblemAnswers[index] = e.target.value;
            });
        });
    }

    checkWordProblems() {
        if (this.viewingHistory) {
            alert('You are viewing a previous session. Generate new problems to take a new test.');
            return;
        }
        
        let correctCount = 0;
        let incorrectCount = 0;
        const userAnswers = [];
        
        document.querySelectorAll('.wp-answer-input').forEach(input => {
            const index = parseInt(input.dataset.index);
            const userAnswer = parseInt(input.value);
            const correctAnswer = this.wordProblems[index].answer;
            const card = document.querySelector(`.word-problem-card[data-index="${index}"]`);
            
            // Save user answer
            userAnswers[index] = {
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                isCorrect: userAnswer === correctAnswer
            };
            
            // Remove previous status
            card.classList.remove('correct', 'incorrect', 'checked');
            const oldIcon = card.querySelector('.status-icon');
            if (oldIcon) oldIcon.remove();
            
            card.classList.add('checked');
            
            // Check answer
            if (userAnswer === correctAnswer) {
                correctCount++;
                card.classList.add('correct');
                const icon = document.createElement('span');
                icon.className = 'status-icon';
                icon.textContent = '✅';
                card.appendChild(icon);
            } else {
                incorrectCount++;
                card.classList.add('incorrect');
                const icon = document.createElement('span');
                icon.className = 'status-icon';
                icon.textContent = '❌';
                card.appendChild(icon);
            }
        });
        
        // Save session
        this.saveSession('Word Problems', this.wordProblems, userAnswers, correctCount, incorrectCount);
        
        // Show results
        this.showWordProblemResults(correctCount, incorrectCount);
    }

    showWordProblemResults(correct, incorrect) {
        const resultsSection = document.getElementById('wp-results');
        const resultsMessage = document.getElementById('wp-results-message');
        const resultsDetails = document.getElementById('wp-results-details');
        
        const total = correct + incorrect;
        const percentage = Math.round((correct / total) * 100);
        
        let message = '';
        if (percentage === 100) {
            message = '🎉 AMAZING! Perfect Score! 🎉';
        } else if (percentage >= 80) {
            message = '🌟 Fantastic Job! Keep it up! 🌟';
        } else if (percentage >= 60) {
            message = '👍 Good Work! Practice makes perfect! 👍';
        } else {
            message = '💪 Keep Trying! You can do it! 💪';
        }
        
        resultsMessage.textContent = message;
        resultsDetails.innerHTML = `
            <p>✅ Correct: ${correct} / ${total}</p>
            <p>❌ Incorrect: ${incorrect} / ${total}</p>
            <p>📊 Score: ${percentage}%</p>
        `;
        
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Tracing Methods
    initCanvas() {
        this.canvas = document.getElementById('tracing-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }

    startTracing() {
        this.tracingMode = document.getElementById('tracing-mode').value;
        this.currentTracingIndex = 0;
        this.tracingScores = [];
        
        if (this.tracingMode === 'letters') {
            this.tracingItems = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        } else {
            this.tracingItems = '0123456789'.split('');
        }
        
        document.getElementById('tracing-results').classList.add('hidden');
        document.getElementById('start-tracing').style.display = 'none';
        document.getElementById('next-tracing').style.display = 'inline-block';
        
        this.loadTracingItem();
    }

    loadTracingItem() {
        if (this.currentTracingIndex >= this.tracingItems.length) {
            this.showTracingResults();
            return;
        }
        
        const item = this.tracingItems[this.currentTracingIndex];
        this.countingComplete = false;
        this.countedObjects = 0;
        
        document.getElementById('current-letter').textContent = item;
        document.getElementById('tracing-counter').textContent = 
            `${this.tracingMode === 'letters' ? 'Letter' : 'Number'} ${this.currentTracingIndex + 1} of ${this.tracingItems.length}`;
        document.getElementById('tracing-score').textContent = 'Score: 0%';
        document.getElementById('tracing-feedback').textContent = '';
        document.getElementById('tracing-feedback').className = 'tracing-feedback';
        
        // Hide stars for new item
        const starRating = document.getElementById('star-rating');
        starRating.classList.add('hidden');
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('earned');
        });
        
        // Clear picture content first
        document.querySelector('.picture-emoji').textContent = '';
        document.querySelector('.picture-label').textContent = '';
        
        // Show picture for letters or counting for numbers
        if (this.tracingMode === 'letters') {
            document.getElementById('tracing-picture').style.display = 'block';
            document.getElementById('counting-area').style.display = 'none';
            this.showPictureForLetter(item);
        } else {
            document.getElementById('tracing-picture').style.display = 'none';
            document.getElementById('counting-area').style.display = 'block';
            this.setupCounting(item);
        }
        
        this.clearCanvas();
        this.drawLetterGuide(item);
    }

    showPictureForLetter(letter) {
        const letterData = {
            'A': { emoji: '🍎', label: 'Apple' },
            'B': { emoji: '🐻', label: 'Bear' },
            'C': { emoji: '🐱', label: 'Cat' },
            'D': { emoji: '🐶', label: 'Dog' },
            'E': { emoji: '🐘', label: 'Elephant' },
            'F': { emoji: '🐸', label: 'Frog' },
            'G': { emoji: '🦒', label: 'Giraffe' },
            'H': { emoji: '🐴', label: 'Horse' },
            'I': { emoji: '🍦', label: 'Ice Cream' },
            'J': { emoji: '🕹️', label: 'Joystick' },
            'K': { emoji: '🔑', label: 'Key' },
            'L': { emoji: '🦁', label: 'Lion' },
            'M': { emoji: '🐵', label: 'Monkey' },
            'N': { emoji: '🥜', label: 'Nut' },
            'O': { emoji: '🦉', label: 'Owl' },
            'P': { emoji: '🐼', label: 'Panda' },
            'Q': { emoji: '👸', label: 'Queen' },
            'R': { emoji: '🌈', label: 'Rainbow' },
            'S': { emoji: '⭐', label: 'Star' },
            'T': { emoji: '🐯', label: 'Tiger' },
            'U': { emoji: '☂️', label: 'Umbrella' },
            'V': { emoji: '🎻', label: 'Violin' },
            'W': { emoji: '🍉', label: 'Watermelon' },
            'X': { emoji: '❌', label: 'X-mark' },
            'Y': { emoji: '🧶', label: 'Yarn' },
            'Z': { emoji: '🦓', label: 'Zebra' }
        };
        
        const data = letterData[letter] || { emoji: '❓', label: 'Unknown' };
        document.querySelector('.picture-emoji').textContent = data.emoji;
        document.querySelector('.picture-label').textContent = data.label;
    }

    setupCounting(number) {
        const count = parseInt(number);
        document.getElementById('count-target').textContent = count;
        document.getElementById('counting-feedback').textContent = '';
        
        const emojis = ['🌟', '🎈', '🎁', '🍭', '🎨', '🎵', '⚽', '🎪', '🎯', '🎲'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const container = document.getElementById('counting-objects');
        container.innerHTML = '';
        
        // Special case for zero
        if (count === 0) {
            document.getElementById('counting-feedback').textContent = '🎉 Zero means no objects! Nothing to count! 🎉';
            this.countingComplete = true;
            return;
        }
        
        // Create count number of objects
        for (let i = 0; i < count; i++) {
            const obj = document.createElement('div');
            obj.className = 'counting-object';
            obj.textContent = emoji;
            obj.dataset.index = i;
            obj.addEventListener('click', () => this.countObject(obj));
            container.appendChild(obj);
        }
    }

    countObject(obj) {
        if (obj.classList.contains('counted')) return;
        
        obj.classList.add('counted');
        this.countedObjects++;
        
        const target = parseInt(document.getElementById('count-target').textContent);
        const feedback = document.getElementById('counting-feedback');
        
        if (this.countedObjects === target) {
            feedback.textContent = '🎉 Perfect! You counted them all! 🎉';
            this.countingComplete = true;
        } else {
            feedback.textContent = `${this.countedObjects} of ${target}`;
        }
    }

    drawLetterGuide(letter) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw guide letter in light gray
        this.ctx.font = 'bold 300px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeStyle = '#dfe6e9';
        this.ctx.lineWidth = 8;
        this.ctx.strokeText(letter, this.canvas.width / 2, this.canvas.height / 2);
        
        // Draw dotted outline for tracing
        this.ctx.strokeStyle = '#6c5ce7';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([10, 10]);
        this.ctx.strokeText(letter, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.setLineDash([]);
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.tracingPath = [];
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        this.tracingPath.push({ x, y });
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 15;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (this.tracingPath.length > 0) {
            const last = this.tracingPath[this.tracingPath.length - 1];
            this.ctx.beginPath();
            this.ctx.moveTo(last.x, last.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        this.tracingPath.push({ x, y });
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        if (this.tracingPath.length > 10) {
            this.evaluateTracing();
        }
    }

    evaluateTracing() {
        if (this.tracingPath.length < 10) {
            return; // Not enough data to evaluate
        }
        
        // Calculate score based on multiple factors
        let score = 0;
        
        // Factor 1: Path length (30% of score)
        const optimalLength = 100; // Optimal number of points
        const lengthScore = Math.min(30, (this.tracingPath.length / optimalLength) * 30);
        
        // Factor 2: Proximity to center (70% of score)
        // Check how close the path is to the center of the canvas where the letter is
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        
        let totalProximity = 0;
        let pointsInBounds = 0;
        
        this.tracingPath.forEach(point => {
            const distanceFromCenter = Math.sqrt(
                Math.pow(point.x - centerX, 2) + 
                Math.pow(point.y - centerY, 2)
            );
            
            // Points within reasonable bounds of the letter (40% of canvas from center)
            if (distanceFromCenter < maxDistance * 0.4) {
                pointsInBounds++;
                totalProximity += (1 - (distanceFromCenter / (maxDistance * 0.4)));
            }
        });
        
        const proximityScore = (pointsInBounds / this.tracingPath.length) * 70;
        
        // Calculate final score
        score = Math.min(100, Math.floor(lengthScore + proximityScore));
        
        document.getElementById('tracing-score').textContent = `Score: ${score}%`;
        
        const feedback = document.getElementById('tracing-feedback');
        const starRating = document.getElementById('star-rating');
        
        // Show star rating
        starRating.classList.remove('hidden');
        
        // Reset all stars
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('earned');
        });
        
        // Determine number of stars earned
        let starsEarned = 0;
        if (score >= 90) {
            starsEarned = 3;
            feedback.textContent = '🌟 Excellent! Great tracing! 🌟';
            feedback.className = 'tracing-feedback excellent';
        } else if (score >= 70) {
            starsEarned = 2;
            feedback.textContent = '👍 Good job! Keep practicing! 👍';
            feedback.className = 'tracing-feedback good';
        } else if (score >= 50) {
            starsEarned = 1;
            feedback.textContent = '💪 Keep trying! You can do it! 💪';
            feedback.className = 'tracing-feedback needs-practice';
        } else {
            starsEarned = 0;
            feedback.textContent = '🎯 Try tracing more carefully!';
            feedback.className = 'tracing-feedback needs-practice';
        }
        
        // Animate stars
        const stars = document.querySelectorAll('.star');
        for (let i = 0; i < starsEarned; i++) {
            setTimeout(() => {
                stars[i].classList.add('earned');
            }, i * 200);
        }
        
        this.tracingScores[this.currentTracingIndex] = score;
    }

    clearCanvas() {
        const item = this.tracingItems[this.currentTracingIndex];
        this.tracingPath = [];
        this.drawLetterGuide(item);
        document.getElementById('tracing-score').textContent = 'Score: 0%';
        document.getElementById('tracing-feedback').textContent = '';
        document.getElementById('tracing-feedback').className = 'tracing-feedback';
        
        // Hide and reset stars
        const starRating = document.getElementById('star-rating');
        starRating.classList.add('hidden');
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('earned');
        });
    }

    nextTracing() {
        // Check if counting is required and complete
        if (this.tracingMode === 'numbers' && !this.countingComplete) {
            alert('Please count all the objects first by touching them!');
            return;
        }
        
        // Use last score or 0 if not scored yet
        if (!this.tracingScores[this.currentTracingIndex]) {
            this.tracingScores[this.currentTracingIndex] = 0;
        }
        
        this.currentTracingIndex++;
        this.loadTracingItem();
    }

    showTracingResults() {
        const total = this.tracingScores.reduce((a, b) => a + b, 0);
        const average = Math.round(total / this.tracingScores.length);
        
        const resultsSection = document.getElementById('tracing-results');
        const resultsMessage = document.getElementById('tracing-results-message');
        const resultsDetails = document.getElementById('tracing-results-details');
        
        let message = '';
        if (average >= 90) {
            message = '🎉 AMAZING! You\'re a tracing superstar! 🎉';
        } else if (average >= 75) {
            message = '🌟 Fantastic Work! Great tracing! 🌟';
        } else if (average >= 60) {
            message = '👍 Good Job! Keep practicing! 👍';
        } else {
            message = '💪 Nice Try! Practice makes perfect! 💪';
        }
        
        resultsMessage.textContent = message;
        resultsDetails.innerHTML = `
            <p>📊 Average Score: ${average}%</p>
            <p>✏️ Items Traced: ${this.tracingScores.length}</p>
            <p>🎯 Mode: ${this.tracingMode === 'letters' ? 'Letters (A-Z)' : 'Numbers (0-9)'}</p>
        `;
        
        resultsSection.classList.remove('hidden');
        document.getElementById('next-tracing').style.display = 'none';
        document.getElementById('start-tracing').style.display = 'inline-block';
        
        // Save to history
        const sessionData = {
            mode: this.tracingMode,
            items: this.tracingItems,
            scores: this.tracingScores
        };
        
        this.saveSession(
            `Tracing ${this.tracingMode === 'letters' ? 'Letters' : 'Numbers'}`,
            [sessionData],
            [{ userAnswer: average, correctAnswer: 100, isCorrect: average >= 80 }],
            average >= 80 ? 1 : 0,
            average >= 80 ? 0 : 1
        );
    }

    // Session History Methods
    saveSession(type, problems, userAnswers, correct, incorrect) {
        const session = {
            id: Date.now(),
            type: type,
            date: new Date().toLocaleString(),
            problems: JSON.parse(JSON.stringify(problems)),
            userAnswers: userAnswers,
            correct: correct,
            incorrect: incorrect,
            total: correct + incorrect,
            percentage: Math.round((correct / (correct + incorrect)) * 100)
        };
        
        this.sessionHistory.unshift(session);
        
        // Keep only last 50 sessions
        if (this.sessionHistory.length > 50) {
            this.sessionHistory = this.sessionHistory.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    loadHistory() {
        const saved = localStorage.getItem('mathMountainHistory');
        if (saved) {
            try {
                this.sessionHistory = JSON.parse(saved);
            } catch (e) {
                this.sessionHistory = [];
            }
        }
    }

    saveHistory() {
        localStorage.setItem('mathMountainHistory', JSON.stringify(this.sessionHistory));
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all session history?')) {
            this.sessionHistory = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    renderHistory() {
        const container = document.getElementById('history-list');
        
        if (this.sessionHistory.length === 0) {
            container.innerHTML = '<p class="no-history">No tests taken yet. Complete a test to see it here!</p>';
            return;
        }
        
        container.innerHTML = '';
        
        this.sessionHistory.forEach(session => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.dataset.sessionId = session.id;
            
            let scoreClass = 'needs-work';
            if (session.percentage === 100) scoreClass = 'perfect';
            else if (session.percentage >= 80) scoreClass = 'good';
            else if (session.percentage >= 60) scoreClass = 'okay';
            
            item.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-type">${session.type === 'Math Mountains' ? '🏔️' : '📖'} ${session.type}</span>
                    <span class="history-item-date">${session.date}</span>
                </div>
                <div class="history-item-score ${scoreClass}">${session.percentage}%</div>
                <div class="history-item-details">
                    ✅ ${session.correct} / ${session.total} correct
                </div>
            `;
            
            item.addEventListener('click', () => this.viewSession(session));
            container.appendChild(item);
        });
    }

    clearActiveHistory() {
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    viewSession(session) {
        this.viewingHistory = true;
        this.clearActiveHistory();
        
        const historyItem = document.querySelector(`[data-session-id="${session.id}"]`);
        if (historyItem) historyItem.classList.add('active');
        
        if (session.type === 'Math Mountains') {
            // Switch to Math Mountains tab
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelector('[data-tab="mountains"]').classList.add('active');
            document.getElementById('mountains-tab').classList.add('active');
            
            // Load the problems
            this.problems = session.problems;
            this.currentAnswers = session.userAnswers.map(ans => ans.userAnswer);
            
            // Render problems
            this.renderProblems();
            
            // Apply user answers and show results
            setTimeout(() => {
                session.userAnswers.forEach((answer, index) => {
                    const input = document.querySelector(`.answer-input[data-index="${index}"]`);
                    if (input) {
                        input.value = answer.userAnswer;
                        input.disabled = true;
                    }
                    
                    const problemContainer = document.querySelector(`.problem-container[data-index="${index}"]`);
                    if (problemContainer) {
                        if (answer.isCorrect) {
                            problemContainer.classList.add('correct');
                            const icon = document.createElement('span');
                            icon.className = 'status-icon';
                            icon.textContent = '✅';
                            problemContainer.appendChild(icon);
                        } else {
                            problemContainer.classList.add('incorrect');
                            const icon = document.createElement('span');
                            icon.className = 'status-icon';
                            icon.textContent = '❌';
                            problemContainer.appendChild(icon);
                        }
                    }
                });
                
                // Show results
                this.showResults(session.correct, session.incorrect);
            }, 100);
            
        } else if (session.type === 'Word Problems') {
            // Switch to Word Problems tab
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelector('[data-tab="word-problems"]').classList.add('active');
            document.getElementById('word-problems-tab').classList.add('active');
            
            // Load the problems
            this.wordProblems = session.problems;
            this.wordProblemAnswers = session.userAnswers.map(ans => ans.userAnswer);
            
            // Render problems
            this.renderWordProblems();
            
            // Apply user answers and show results
            setTimeout(() => {
                session.userAnswers.forEach((answer, index) => {
                    const input = document.querySelector(`.wp-answer-input[data-index="${index}"]`);
                    if (input) {
                        input.value = answer.userAnswer;
                        input.disabled = true;
                    }
                    
                    const card = document.querySelector(`.word-problem-card[data-index="${index}"]`);
                    if (card) {
                        card.classList.add('checked');
                        if (answer.isCorrect) {
                            card.classList.add('correct');
                            const icon = document.createElement('span');
                            icon.className = 'status-icon';
                            icon.textContent = '✅';
                            card.appendChild(icon);
                        } else {
                            card.classList.add('incorrect');
                            const icon = document.createElement('span');
                            icon.className = 'status-icon';
                            icon.textContent = '❌';
                            card.appendChild(icon);
                        }
                    }
                });
                
                // Show results
                this.showWordProblemResults(session.correct, session.incorrect);
            }, 100);
        }
    }

    // Exposed methods for testing
    getProblems() {
        return this.problems;
    }

    getCurrentAnswers() {
        return this.currentAnswers;
    }

    setAnswer(index, value) {
        this.currentAnswers[index] = value;
        const input = document.querySelector(`.answer-input[data-index="${index}"]`);
        if (input) input.value = value;
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MathMountainApp();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathMountainApp;
}

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

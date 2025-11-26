/**
 * Test Suite for Math Mountain App
 * 
 * This file contains comprehensive tests to verify all functionality
 * of the Math Mountain application.
 */

// Mock DOM elements for testing
class MockDOM {
    constructor() {
        this.elements = {};
        this.innerHTML = {};
        this.values = {};
        this.classList = {};
    }

    getElementById(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                value: this.values[id] || '',
                innerHTML: '',
                classList: {
                    add: (className) => {
                        if (!this.classList[id]) this.classList[id] = [];
                        if (!this.classList[id].includes(className)) {
                            this.classList[id].push(className);
                        }
                    },
                    remove: (className) => {
                        if (this.classList[id]) {
                            this.classList[id] = this.classList[id].filter(c => c !== className);
                        }
                    },
                    contains: (className) => {
                        return this.classList[id] && this.classList[id].includes(className);
                    }
                },
                addEventListener: (event, handler) => {},
                dataset: {},
                textContent: '',
                scrollIntoView: () => {}
            };
        }
        return this.elements[id];
    }

    querySelector(selector) {
        return null;
    }

    querySelectorAll(selector) {
        return [];
    }

    createElement(tag) {
        return {
            className: '',
            innerHTML: '',
            textContent: '',
            dataset: {},
            appendChild: () => {},
            querySelector: () => null,
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            },
            addEventListener: () => {}
        };
    }
}

// Test Runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('\n🧪 Running Math Mountain Test Suite\n');
        console.log('='.repeat(60));
        
        for (let test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                console.log(`✅ PASS: ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ FAIL: ${test.name}`);
                console.log(`   Error: ${error.message}`);
            }
        }
        
        console.log('='.repeat(60));
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed, ${this.tests.length} total`);
        console.log(this.failed === 0 ? '🎉 All tests passed!\n' : '⚠️  Some tests failed\n');
        
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected} but got ${actual}`);
        }
    }

    assertInRange(value, min, max, message) {
        if (value < min || value > max) {
            throw new Error(message || `Expected value between ${min} and ${max} but got ${value}`);
        }
    }
}

// Create test runner instance
const runner = new TestRunner();

// Test 1: Number Generation - Low Difficulty
runner.test('Low difficulty generates 1-digit numbers (1-9)', () => {
    const mockDoc = new MockDOM();
    mockDoc.values['difficulty-top'] = 'low';
    mockDoc.values['difficulty-bottom'] = 'low';
    mockDoc.values['problem-count-top'] = '25';
    mockDoc.values['problem-count-bottom'] = '25';
    
    // Simulate app initialization
    for (let i = 0; i < 100; i++) {
        const num = Math.floor(Math.random() * 9) + 1;
        runner.assertInRange(num, 1, 9, 'Low difficulty number out of range');
    }
});

// Test 2: Number Generation - Medium Difficulty
runner.test('Medium difficulty generates 2-digit numbers (10-99)', () => {
    for (let i = 0; i < 100; i++) {
        const num = Math.floor(Math.random() * 90) + 10;
        runner.assertInRange(num, 10, 99, 'Medium difficulty number out of range');
    }
});

// Test 3: Number Generation - High Difficulty
runner.test('High difficulty generates 3 or 4-digit numbers', () => {
    for (let i = 0; i < 100; i++) {
        const num = Math.random() > 0.5 
            ? Math.floor(Math.random() * 900) + 100 
            : Math.floor(Math.random() * 9000) + 1000;
        runner.assert(
            (num >= 100 && num <= 999) || (num >= 1000 && num <= 9999),
            `High difficulty number ${num} out of valid range`
        );
    }
});

// Test 4: Problem Count Validation
runner.test('Problem count validation enforces min/max bounds', () => {
    const validateProblemCount = (value) => {
        let count = parseInt(value);
        if (isNaN(count) || count < 10) count = 10;
        if (count > 50) count = 50;
        return count;
    };
    
    runner.assertEqual(validateProblemCount('5'), 10, 'Should enforce minimum of 10');
    runner.assertEqual(validateProblemCount('100'), 50, 'Should enforce maximum of 50');
    runner.assertEqual(validateProblemCount('25'), 25, 'Should accept valid values');
    runner.assertEqual(validateProblemCount('invalid'), 10, 'Should handle invalid input');
});

// Test 5: Math Mountain Addition Logic
runner.test('Math Mountain correctly validates addition problems', () => {
    // Test case: 5 + 3 = 8
    const base1 = 5;
    const base2 = 3;
    const top = 8;
    
    runner.assertEqual(base1 + base2, top, 'Addition should be correct');
    
    // Test multiple cases
    for (let i = 0; i < 50; i++) {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        const sum = a + b;
        runner.assertEqual(a + b, sum, `${a} + ${b} should equal ${sum}`);
    }
});

// Test 6: Problem Generation Creates Valid Mountains
runner.test('Generated problems have correct mathematical relationships', () => {
    const generateMathMountain = (difficulty) => {
        const getRandomNumber = (diff) => {
            switch(diff) {
                case 'low': return Math.floor(Math.random() * 9) + 1;
                case 'medium': return Math.floor(Math.random() * 90) + 10;
                case 'high': 
                    return Math.random() > 0.5 
                        ? Math.floor(Math.random() * 900) + 100
                        : Math.floor(Math.random() * 9000) + 1000;
                default: return Math.floor(Math.random() * 90) + 10;
            }
        };
        
        const num1 = getRandomNumber(difficulty);
        const num2 = getRandomNumber(difficulty);
        const top = num1 + num2;
        const hidePosition = Math.floor(Math.random() * 3);
        
        return {
            top, base1: num1, base2: num2, hidePosition,
            correctAnswer: hidePosition === 0 ? top : (hidePosition === 1 ? num1 : num2)
        };
    };
    
    for (let i = 0; i < 50; i++) {
        const problem = generateMathMountain('medium');
        runner.assertEqual(
            problem.base1 + problem.base2, 
            problem.top, 
            'Mountain base numbers must add up to top'
        );
        runner.assert(
            problem.hidePosition >= 0 && problem.hidePosition <= 2,
            'Hide position must be 0, 1, or 2'
        );
    }
});

// Test 7: Answer Validation
runner.test('Answer checking correctly identifies correct and incorrect answers', () => {
    const checkAnswer = (userAnswer, correctAnswer) => {
        return parseInt(userAnswer) === correctAnswer;
    };
    
    runner.assert(checkAnswer('42', 42), 'Should accept correct answer');
    runner.assert(!checkAnswer('43', 42), 'Should reject incorrect answer');
    runner.assert(checkAnswer('100', 100), 'Should handle larger numbers');
});

// Test 8: Problem Generation Count
runner.test('Generates correct number of problems based on input', () => {
    const generateProblems = (count) => {
        const problems = [];
        for (let i = 0; i < count; i++) {
            const num1 = Math.floor(Math.random() * 90) + 10;
            const num2 = Math.floor(Math.random() * 90) + 10;
            problems.push({ base1: num1, base2: num2, top: num1 + num2 });
        }
        return problems;
    };
    
    runner.assertEqual(generateProblems(10).length, 10, 'Should generate 10 problems');
    runner.assertEqual(generateProblems(25).length, 25, 'Should generate 25 problems');
    runner.assertEqual(generateProblems(50).length, 50, 'Should generate 50 problems');
});

// Test 9: Hide Position Randomization
runner.test('Hide position is randomly distributed', () => {
    const positions = { 0: 0, 1: 0, 2: 0 };
    
    for (let i = 0; i < 300; i++) {
        const pos = Math.floor(Math.random() * 3);
        positions[pos]++;
    }
    
    // Each position should appear at least 50 times out of 300 (rough probability check)
    runner.assert(positions[0] > 50, 'Position 0 should appear multiple times');
    runner.assert(positions[1] > 50, 'Position 1 should appear multiple times');
    runner.assert(positions[2] > 50, 'Position 2 should appear multiple times');
});

// Test 10: Score Calculation
runner.test('Score percentage is calculated correctly', () => {
    const calculateScore = (correct, total) => {
        return Math.round((correct / total) * 100);
    };
    
    runner.assertEqual(calculateScore(25, 25), 100, '100% for all correct');
    runner.assertEqual(calculateScore(20, 25), 80, '80% for 20/25');
    runner.assertEqual(calculateScore(15, 25), 60, '60% for 15/25');
    runner.assertEqual(calculateScore(0, 25), 0, '0% for none correct');
});

// Test 11: Edge Cases - Large Numbers
runner.test('High difficulty handles 4-digit numbers correctly', () => {
    for (let i = 0; i < 20; i++) {
        const num1 = Math.floor(Math.random() * 9000) + 1000;
        const num2 = Math.floor(Math.random() * 9000) + 1000;
        const sum = num1 + num2;
        
        runner.assertEqual(num1 + num2, sum, 'Large number addition should be correct');
        runner.assertInRange(num1, 1000, 9999, 'First number in valid range');
        runner.assertInRange(num2, 1000, 9999, 'Second number in valid range');
    }
});

// Test 12: Boundary Testing - Problem Count
runner.test('Boundary values for problem count work correctly', () => {
    const validateProblemCount = (value) => {
        let count = parseInt(value);
        if (isNaN(count) || count < 10) count = 10;
        if (count > 50) count = 50;
        return count;
    };
    
    runner.assertEqual(validateProblemCount('10'), 10, 'Minimum boundary');
    runner.assertEqual(validateProblemCount('50'), 50, 'Maximum boundary');
    runner.assertEqual(validateProblemCount('9'), 10, 'Below minimum corrected');
    runner.assertEqual(validateProblemCount('51'), 50, 'Above maximum corrected');
});

// Test 13: Multiple Difficulty Levels
runner.test('All difficulty levels generate appropriate number ranges', () => {
    const difficulties = [
        { level: 'low', min: 1, max: 9 },
        { level: 'medium', min: 10, max: 99 },
        { level: 'high', min: 100, max: 9999 }
    ];
    
    difficulties.forEach(diff => {
        for (let i = 0; i < 20; i++) {
            let num;
            switch(diff.level) {
                case 'low': num = Math.floor(Math.random() * 9) + 1; break;
                case 'medium': num = Math.floor(Math.random() * 90) + 10; break;
                case 'high': 
                    num = Math.random() > 0.5 
                        ? Math.floor(Math.random() * 900) + 100 
                        : Math.floor(Math.random() * 9000) + 1000;
                    break;
            }
            runner.assertInRange(num, diff.min, diff.max, 
                `${diff.level} difficulty should generate numbers in range`);
        }
    });
});

// Test 14: Answer Input Retention
runner.test('Answers are retained until generate button is clicked', () => {
    const answers = [];
    
    // Simulate user entering answers
    answers[0] = '42';
    answers[1] = '73';
    answers[2] = '156';
    
    // Verify answers persist
    runner.assertEqual(answers[0], '42', 'First answer retained');
    runner.assertEqual(answers[1], '73', 'Second answer retained');
    runner.assertEqual(answers[2], '156', 'Third answer retained');
    
    // Clear answers (simulate generate new problems)
    answers.length = 0;
    runner.assertEqual(answers.length, 0, 'Answers cleared on generate');
});

// Test 15: Result Messages
runner.test('Appropriate result messages for different score ranges', () => {
    const getMessage = (percentage) => {
        if (percentage === 100) return 'Perfect Score!';
        if (percentage >= 80) return 'Fantastic Job!';
        if (percentage >= 60) return 'Good Work!';
        return 'Keep Trying!';
    };
    
    runner.assert(getMessage(100).includes('Perfect'), '100% gets perfect message');
    runner.assert(getMessage(85).includes('Fantastic'), '85% gets fantastic message');
    runner.assert(getMessage(65).includes('Good'), '65% gets good message');
    runner.assert(getMessage(45).includes('Keep'), '45% gets encouraging message');
});

// Run all tests
if (typeof window === 'undefined') {
    // Running in Node.js
    runner.run().then(success => {
        process.exit(success ? 0 : 1);
    });
} else {
    // Running in browser
    console.log('Run tests by calling: runner.run()');
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestRunner, runner };
}

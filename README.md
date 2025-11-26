# 🏔️ Math Mountain Adventure

A fun, interactive math learning app designed for 2nd graders to practice addition with engaging animal-themed problem containers!

## 🎯 Features

- **Math Mountain Problems**: Visual addition problems where students find the missing number in a math mountain
- **Three Difficulty Levels**:
  - 🐛 **Low**: 1-digit numbers (1-9)
  - 🐸 **Medium**: 2-digit numbers (10-99)
  - 🦁 **High**: 3-4 digit numbers (100-9999)
- **Customizable Problem Count**: Generate 10-50 problems (default: 25)
- **Fun Animal Shapes**: Each problem is displayed in a colorful animal container (🐱 🐶 🐻 🐸 🦁 🐼 🐵 🐷)
- **Interactive UI**: Colorful animations, bouncing header, and engaging feedback
- **Answer Retention**: Values stay in place until "Generate New Problems" is clicked
- **Instant Feedback**: Visual indicators (✅ ❌) show correct/incorrect answers
- **Score Tracking**: Get percentage scores and encouraging messages
- **Dual Controls**: Generate button at both top and bottom for convenience

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Running the App

1. Open `index.html` in your web browser
2. Choose your difficulty level and number of problems
3. Click "Generate New Problems" to start
4. Fill in the missing numbers in each math mountain
5. Click "Check My Answers" to see your score!

### Using the App

#### Math Mountain Concept

Each problem shows a math mountain with three numbers:
```
    [Top]
   /     \
[Base1] [Base2]
```

The two base numbers add up to the top number. One of the three numbers will be hidden, and students need to figure it out!

**Examples:**
- If base numbers are 5 and 3, the top is 8
- If the top is 12 and one base is 7, the missing base is 5
- If one base is 9 and the top is 15, the missing base is 6

#### Controls

**Top Control Panel:**
- **Difficulty Level**: Choose complexity (low/medium/high)
- **Number of Problems**: Select 10-50 problems
- **Generate Button**: Create a new set of problems

**Bottom Control Panel:**
- Same controls as top (they stay synchronized)
- **Check My Answers**: Validate all answers and show results

#### Tips for Kids

1. 🎨 Each problem lives inside a cute animal shape!
2. 🌟 The animals will dance and shake when you check answers
3. ✅ Green animals mean correct answers!
4. ❌ Red animals need another try
5. 🎉 Get all correct for a perfect score celebration!

## 🧪 Running Tests

The app includes comprehensive test coverage to ensure all features work correctly.

### Test in Browser

1. Open the browser console (F12 or right-click → Inspect)
2. Load the page with the test file included
3. Type: `runner.run()`

### Test in Node.js

```powershell
node test.js
```

### Test Coverage

The test suite includes 15 comprehensive tests covering:

1. ✅ Low difficulty number generation (1-digit)
2. ✅ Medium difficulty number generation (2-digit)
3. ✅ High difficulty number generation (3-4 digit)
4. ✅ Problem count validation (min/max bounds)
5. ✅ Math Mountain addition logic
6. ✅ Valid problem generation
7. ✅ Answer validation (correct/incorrect)
8. ✅ Problem count accuracy
9. ✅ Hide position randomization
10. ✅ Score calculation
11. ✅ Large number handling
12. ✅ Boundary value testing
13. ✅ All difficulty levels
14. ✅ Answer retention until regeneration
15. ✅ Result messages for different scores

### Expected Test Output

```
🧪 Running Math Mountain Test Suite

============================================================
✅ PASS: Low difficulty generates 1-digit numbers (1-9)
✅ PASS: Medium difficulty generates 2-digit numbers (10-99)
✅ PASS: High difficulty generates 3 or 4-digit numbers
...
============================================================

📊 Test Results: 15 passed, 0 failed, 15 total
🎉 All tests passed!
```

## 📁 Project Structure

```
MathMountain/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Application logic
├── test.js         # Comprehensive test suite
└── README.md       # This file
```

## 🎨 Features in Detail

### Animal Shapes

Problems rotate through 8 different animal designs:
- 🐱 Cat (yellow gradient, rounded top)
- 🐶 Dog (coral gradient, wavy border)
- 🐻 Bear (gray gradient, circular)
- 🐸 Frog (green gradient, oval)
- 🦁 Lion (yellow gradient, perfect circle with mane effect)
- 🐼 Panda (white/gray gradient)
- 🐵 Monkey (orange gradient, asymmetric)
- 🐷 Pig (pink gradient, rounded bottom)

### Animations

- **Bouncing Header**: Title bounces continuously
- **Hover Effects**: Problems lift and rotate slightly on hover
- **Check Animation**: Correct answers celebrate, incorrect answers shake
- **Fade In**: New problems smoothly fade into view
- **Focus Effects**: Input fields glow when selected

### Responsive Design

- Adapts to different screen sizes
- Mobile-friendly layout
- Touch-friendly buttons and inputs
- Flexible grid system

## 🎓 Educational Value

This app helps 2nd graders:
- Practice addition facts
- Understand the relationship between addition and subtraction
- Build mental math skills
- Learn that addition can be visualized in different ways
- Develop number sense with various difficulty levels
- Build confidence with immediate feedback

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Animations, gradients, flexbox, grid
- **Vanilla JavaScript**: No dependencies, pure ES6+

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

### Performance

- Lightweight (no external libraries)
- Fast load times
- Smooth animations
- Efficient DOM manipulation

## 🐛 Troubleshooting

**Problem: Numbers don't appear**
- Ensure JavaScript is enabled
- Check browser console for errors
- Refresh the page

**Problem: Answers don't stay when scrolling**
- This is expected behavior - answers persist until "Generate New Problems"
- Check the console to verify values are stored

**Problem: Animations don't work**
- Ensure CSS is loaded properly
- Try a different browser
- Check for browser extensions blocking animations

## 📝 License

This is an educational project created for learning purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project for educational purposes!

## 🌟 Future Enhancements

Potential features to add:
- Subtraction problems
- Multiplication/division
- Timer mode
- Sound effects
- Progress tracking
- Multiple users
- Printable worksheets
- Hints system

## 📧 Support

For issues or questions, please check the test suite and console logs for debugging information.

---

**Happy Math Mountain Climbing! 🏔️🎉**

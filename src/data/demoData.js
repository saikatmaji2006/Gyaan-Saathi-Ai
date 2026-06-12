// Demo data for prototype — works without backend

export const DEMO_LESSON_LINEAR = {
  lesson_id: 'les_demo_001',
  title: 'Linear Equations',
  subtitle: 'Class 8 · Mathematics',
  sections: [
    {
      type: 'concept',
      title: 'What is a Linear Equation?',
      content: 'A linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable raised to the power of 1. These equations form straight lines when plotted on a graph.',
      speak_text: 'Aaiye samjhte hain ki linear equation kya hota hai. Linear equation ek aisi algebraic equation hai jismein har term ya toh ek constant hota hai ya phir ek constant aur ek variable ka product hota hai, jismein variable ki power 1 hoti hai.'
    },
    {
      type: 'definition',
      term: 'Linear Equation',
      definition: 'An equation where the highest power of the variable is 1. It represents a straight line on a coordinate plane.',
      formula: 'ax + b = 0',
      speak_text: 'Linear equation ki definition yeh hai — yeh ek aisi equation hai jismein variable ki highest power 1 hoti hai. General form hai: a x plus b equals zero.'
    },
    {
      type: 'example',
      title: 'Example 1: Solving a Simple Equation',
      problem: 'Solve: 2x + 3 = 11',
      steps: [
        { step: 1, text: '2x + 3 = 11', explanation: 'Start with the original equation' },
        { step: 2, text: '2x = 11 − 3', explanation: 'Subtract 3 from both sides' },
        { step: 3, text: '2x = 8', explanation: 'Simplify the right side' },
        { step: 4, text: 'x = 4', explanation: 'Divide both sides by 2' }
      ],
      answer: 'x = 4',
      speak_text: 'Chaliye ek example solve karte hain. 2x plus 3 equals 11. Pehle 3 ko dono taraf se minus karo. 2x equals 8. Ab dono taraf 2 se divide karo. x equals 4.'
    },
    {
      type: 'example',
      title: 'Example 2: Variables on Both Sides',
      problem: 'Solve: 5x − 2 = 3x + 6',
      steps: [
        { step: 1, text: '5x − 2 = 3x + 6', explanation: 'Original equation' },
        { step: 2, text: '5x − 3x = 6 + 2', explanation: 'Move x terms to left, constants to right' },
        { step: 3, text: '2x = 8', explanation: 'Simplify both sides' },
        { step: 4, text: 'x = 4', explanation: 'Divide both sides by 2' }
      ],
      answer: 'x = 4',
      speak_text: 'Doosra example dekhte hain jismein dono taraf variable hai. 5x minus 2 equals 3x plus 6. Variable terms ko left mein le aao aur constants ko right mein. 2x equals 8. x equals 4.'
    },
    {
      type: 'real_world',
      title: 'Real Life Example',
      scenario: 'Raj has ₹50 in his pocket. He wants to buy pens that cost ₹8 each. He also needs to keep ₹10 for bus fare. How many pens can he buy?',
      equation: '8x + 10 = 50',
      solution: '8x = 40, so x = 5. Raj can buy 5 pens.',
      speak_text: 'Ab dekhte hain real life mein kaise use hota hai. Raj ke paas 50 rupaye hain. Pen ka price 8 rupaye hai aur 10 rupaye bus fare ke liye chahiye. Toh equation banti hai 8x plus 10 equals 50. Solve karne par x equals 5. Matlab Raj 5 pens khareed sakta hai.'
    },
    {
      type: 'practice',
      questions: [
        { question: 'Solve: 5x − 3 = 12', answer: 'x = 3' },
        { question: 'Solve: 2x + 7 = 15', answer: 'x = 4' },
        { question: 'Solve: 4x − 1 = 2x + 9', answer: 'x = 5' }
      ],
      speak_text: 'Ab aapki baari hai! Yeh teen practice questions solve karein.'
    },
    {
      type: 'summary',
      points: [
        'Linear equation has variable with power 1',
        'General form: ax + b = 0',
        'Solve by isolating the variable on one side',
        'Move constants to one side, variables to other',
        'Always verify your answer by substituting back'
      ],
      speak_text: 'Toh aaj humne seekha ki linear equation kya hoti hai, uski general form, aur usse solve kaise karte hain. Yaad rakhein — variable ko isolate karo, constants ko doosri taraf le jaao.'
    }
  ],
  key_terms: ['Variable', 'Constant', 'Coefficient', 'Solution', 'LHS', 'RHS'],
  summary: 'A linear equation is an algebraic equation where the highest power of the variable is 1. We solve them by isolating the variable through arithmetic operations applied to both sides.'
}

export const DEMO_LESSON_PHOTOSYNTHESIS = {
  lesson_id: 'les_demo_002',
  title: 'Photosynthesis',
  subtitle: 'Class 7 · Science',
  sections: [
    {
      type: 'concept',
      title: 'What is Photosynthesis?',
      content: 'Photosynthesis is the process by which green plants make their own food using sunlight, water, and carbon dioxide. It takes place mainly in the leaves of plants.',
      speak_text: 'Aaiye samjhte hain photosynthesis kya hai. Photosynthesis woh process hai jismein green plants sunlight, water, aur carbon dioxide ka use karke apna food khud banate hain. Yeh mainly leaves mein hota hai.'
    },
    {
      type: 'definition',
      term: 'Photosynthesis',
      definition: 'The process by which green plants use sunlight to convert carbon dioxide and water into glucose and oxygen.',
      formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
      speak_text: 'Photosynthesis ki definition: yeh woh process hai jismein green plants sunlight ki madad se carbon dioxide aur water ko glucose aur oxygen mein convert karte hain.'
    },
    {
      type: 'example',
      title: 'How Photosynthesis Works',
      problem: 'Explain the step-by-step process of photosynthesis',
      steps: [
        { step: 1, text: 'Sunlight falls on the leaf', explanation: 'Chlorophyll in leaves absorbs sunlight energy' },
        { step: 2, text: 'Water absorbed by roots reaches leaves', explanation: 'Through xylem vessels in the stem' },
        { step: 3, text: 'CO₂ enters through stomata', explanation: 'Small pores on the leaf surface' },
        { step: 4, text: 'Glucose is produced', explanation: 'Light energy converts CO₂ + H₂O into glucose' },
        { step: 5, text: 'Oxygen is released', explanation: 'O₂ exits through stomata as a byproduct' }
      ],
      answer: 'Plants convert CO₂ + H₂O into Glucose + O₂ using sunlight',
      speak_text: 'Chaliye step by step dekhte hain. Pehle sunlight leaf par padti hai aur chlorophyll use absorb karta hai. Phir roots se water aata hai. CO2 stomata se enter karta hai. Phir glucose banta hai aur oxygen release hoti hai.'
    },
    {
      type: 'real_world',
      title: 'Why Photosynthesis Matters',
      scenario: 'Without photosynthesis, there would be no oxygen for us to breathe. All the food we eat comes directly or indirectly from plants. Even the petrol in cars comes from ancient plants!',
      equation: null,
      solution: 'Photosynthesis is the foundation of all life on Earth.',
      speak_text: 'Socho agar photosynthesis na ho toh? Na oxygen milegi, na khana. Hum jo bhi khaate hain woh directly ya indirectly plants se aata hai.'
    },
    {
      type: 'summary',
      points: [
        'Photosynthesis happens in leaves using chlorophyll',
        'Needs: Sunlight + Water + Carbon Dioxide',
        'Produces: Glucose (food) + Oxygen',
        'Stomata allow CO₂ in and O₂ out',
        'Essential for all life on Earth'
      ],
      speak_text: 'Toh aaj humne seekha ki photosynthesis leaves mein hota hai, iske liye sunlight, water aur CO2 chahiye, aur isse glucose aur oxygen banti hai.'
    }
  ],
  key_terms: ['Chlorophyll', 'Stomata', 'Glucose', 'Carbon Dioxide', 'Oxygen', 'Xylem'],
  summary: 'Photosynthesis is the process where green plants use sunlight, water, and CO₂ to make glucose and release oxygen.'
}

export const DEMO_QUIZ = {
  quiz_id: 'quiz_demo_001',
  topic: 'Linear Equations',
  difficulty: 'medium',
  questions: [
    {
      id: 'q_1',
      question: 'Solve for x: 3x + 2 = 11',
      options: { A: 'x = 2', B: 'x = 3', C: 'x = 4', D: 'x = 5' },
      correct: 'B',
      explanation: '3x = 11 − 2 = 9, so x = 9 ÷ 3 = 3',
      speak_text: 'Question 1. Solve for x: 3x plus 2 equals 11. Option A: x equals 2. Option B: x equals 3. Option C: x equals 4. Option D: x equals 5.'
    },
    {
      id: 'q_2',
      question: 'What is the value of x in: x + 7 = 12?',
      options: { A: 'x = 3', B: 'x = 4', C: 'x = 5', D: 'x = 6' },
      correct: 'C',
      explanation: 'x = 12 − 7 = 5',
      speak_text: 'Question 2. What is the value of x in x plus 7 equals 12?'
    },
    {
      id: 'q_3',
      question: 'Which is a linear equation?',
      options: { A: 'x² + 3 = 0', B: '2x + 5 = 11', C: 'x³ = 8', D: '√x = 4' },
      correct: 'B',
      explanation: '2x + 5 = 11 has variable x with power 1, making it linear.',
      speak_text: 'Question 3. Which of the following is a linear equation?'
    },
    {
      id: 'q_4',
      question: 'Solve: 4x − 8 = 0',
      options: { A: 'x = 1', B: 'x = 2', C: 'x = 3', D: 'x = 4' },
      correct: 'B',
      explanation: '4x = 8, so x = 8 ÷ 4 = 2',
      speak_text: 'Question 4. Solve: 4x minus 8 equals 0.'
    },
    {
      id: 'q_5',
      question: 'If 2x + 3 = x + 7, what is x?',
      options: { A: 'x = 2', B: 'x = 3', C: 'x = 4', D: 'x = 5' },
      correct: 'C',
      explanation: '2x − x = 7 − 3, so x = 4',
      speak_text: 'Question 5. If 2x plus 3 equals x plus 7, what is x?'
    },
    {
      id: 'q_6',
      question: 'The general form of a linear equation in one variable is:',
      options: { A: 'ax² + b = 0', B: 'ax + b = 0', C: 'a/x + b = 0', D: 'ax³ + b = 0' },
      correct: 'B',
      explanation: 'Linear equation has variable with power 1: ax + b = 0',
      speak_text: 'Question 6. The general form of a linear equation in one variable is?'
    },
    {
      id: 'q_7',
      question: 'Solve: 7x − 3 = 2x + 12',
      options: { A: 'x = 2', B: 'x = 3', C: 'x = 4', D: 'x = 5' },
      correct: 'B',
      explanation: '5x = 15, so x = 3',
      speak_text: 'Question 7. Solve: 7x minus 3 equals 2x plus 12.'
    },
    {
      id: 'q_8',
      question: 'A pen costs ₹x. 5 pens cost ₹40. What is x?',
      options: { A: '₹6', B: '₹7', C: '₹8', D: '₹9' },
      correct: 'C',
      explanation: '5x = 40, so x = 8',
      speak_text: 'Question 8. A pen costs x rupees. 5 pens cost 40 rupees. What is x?'
    },
    {
      id: 'q_9',
      question: 'Which value of x satisfies: 6x + 1 = 19?',
      options: { A: 'x = 2', B: 'x = 3', C: 'x = 4', D: 'x = 5' },
      correct: 'B',
      explanation: '6x = 18, so x = 3',
      speak_text: 'Question 9. Which value of x satisfies 6x plus 1 equals 19?'
    },
    {
      id: 'q_10',
      question: 'If x − 5 = 3, then 2x = ?',
      options: { A: '12', B: '14', C: '16', D: '18' },
      correct: 'C',
      explanation: 'x = 8, so 2x = 16',
      speak_text: 'Question 10. If x minus 5 equals 3, then what is 2x?'
    }
  ]
}

export const DEMO_SESSIONS = [
  {
    id: 'sess_001',
    topic: 'Linear Equations',
    subject: 'Mathematics',
    class_level: 8,
    created_at: new Date().toISOString(),
    duration_seconds: 900,
    quiz_score: '8/10'
  },
  {
    id: 'sess_002',
    topic: 'Photosynthesis',
    subject: 'Science',
    class_level: 7,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    duration_seconds: 720,
    quiz_score: '4/5'
  }
]

export const SUGGESTED_TOPICS = [
  { topic: 'Linear Equations', class_level: 8, subject: 'Mathematics' },
  { topic: 'Photosynthesis', class_level: 7, subject: 'Science' },
  { topic: 'Fractions & Decimals', class_level: 6, subject: 'Mathematics' },
  { topic: 'Human Digestive System', class_level: 7, subject: 'Science' },
  { topic: 'Algebraic Expressions', class_level: 8, subject: 'Mathematics' },
  { topic: 'Force and Pressure', class_level: 8, subject: 'Science' },
]

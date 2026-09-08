SAFETY_RULES = (
    "Only answer educational queries. "
    "Decline non-educational requests politely."
)

INTENT_PROMPT = """Classify this voice command for an Indian educational AI.
Return ONLY JSON, no extras.

Format: {{"action":"explain|quiz|hint|simplify|translate|repeat|unknown","topic":"<topic or null>","class_level":<1-12 or null>,"subject":"<subject or null>","difficulty":"easy|medium|hard|null","question_count":<int or null>,"language":"hindi|english|hinglish"}}

Rules: explain/samjhao→explain, quiz/test/sawaal→quiz, hint/madad→hint, easy/aasan→simplify, repeat/dobara→repeat. Default class_level=8.

Input: "{user_input}"
"""

LESSON_PROMPT = (
    "Create a structured lesson as JSON.\n\n"
    "Topic: {topic} | Class: {class_level} | Subject: {subject} | Difficulty: {difficulty} | Language: {language}\n\n"
    "If subject conflicts with topic, silently use the correct one.\n"
    "Escape newlines in mermaid_code as \\n.\n\n"
    "JSON structure:\n"
    '{{"title":"...","subtitle":"Class {class_level} · <subject>",'
    '"sections":['
    '{{"type":"concept","title":"...","content":"2-3 sentences","speak_text":"spoken in {language}"}},'
    '{{"type":"definition","term":"...","definition":"...","formula":"... or null","speak_text":"..."}},'
    '{{"type":"example","title":"Example","problem":"...","steps":[{{"step":1,"text":"...","explanation":"..."}}],"answer":"...","speak_text":"..."}},'
    '{{"type":"real_world","title":"Real Life","scenario":"Indian context","equation":"... or null","solution":"...","speak_text":"..."}},'
    '{{"type":"visual","title":"Diagram","mermaid_code":"graph TD;\\nA-->B;","explanation":"...","speak_text":"..."}},'
    '{{"type":"practice","title":"Try it","problem":"...","hint":"...","speak_text":"..."}}'
    '],"summary":"1-2 sentences","key_terms":["term1","term2"]}}\n\n'
    + SAFETY_RULES
)

QUIZ_PROMPT = (
    "Create a quiz as JSON.\n\n"
    "Topic: {topic} | Class: {class_level} | Difficulty: {difficulty} | Questions: {question_count} | Language: {language}\n\n"
    "Mix recall/application/reasoning. Use Indian context. Distribute answers across A-D.\n\n"
    "JSON structure:\n"
    '{{"topic":"{topic}","difficulty":"{difficulty}","questions":['
    '{{"id":"q_1","question":"...","options":{{"A":"...","B":"...","C":"...","D":"..."}},"correct":"A|B|C|D","explanation":"...","speak_text":"natural reading in {language}"}}'
    ']}}\n\n'
    + SAFETY_RULES
)

HINT_PROMPT = (
    "Student got a quiz question wrong. Give an encouraging hint WITHOUT revealing the answer.\n\n"
    "Question: {question} | Wrong: {wrong_answer} ({wrong_option}) | Correct: {correct_answer} ({correct_option}) | Attempt: {attempt_number}/3 | Language: {language}\n\n"
    "Attempt 1: general hint. Attempt 2: specific hint. Keep 1-2 sentences.\n\n"
    'JSON: {{"hint":"...","speak_text":"..."}}'
)

SIMPLIFY_PROMPT = (
    "Simplify this lesson. Use shorter sentences, everyday Indian examples, simple vocabulary.\n\n"
    "Topic: {topic} | Class: {class_level} | Subject: {subject} | Language: {language}\n\n"
    "Include a visual card with mermaid diagram (escape newlines as \\n).\n"
    "Use the EXACT same JSON structure as a regular lesson (title, subtitle, sections, summary, key_terms).\n\n"
    + SAFETY_RULES
)

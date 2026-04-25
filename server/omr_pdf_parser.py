import sys
import json
import re
import pdfplumber


def parse_answer_key_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = pdf.pages[0].extract_text()

    section = text.split('Darken the bubble completely')[-1]
    lines = [l.strip() for l in section.strip().split('\n') if l.strip()]

    answer_key = {}
    i = 0
    while i < len(lines):
        line = lines[i]
        qpair = re.match(r'(Q\d+)\s+(Q\d+)', line)
        if qpair:
            q_left = int(qpair.group(1)[1:])
            q_right = int(qpair.group(2)[1:])
            if i + 1 < len(lines):
                parts = lines[i + 1].split()
                if len(parts) >= 2 and re.match(r'[ABCD]', parts[0]) and re.match(r'[ABCD]', parts[1]):
                    answer_key[str(q_left)] = parts[0]
                    answer_key[str(q_right)] = parts[1]
        i += 1
    return answer_key


def parse_student_page(text):
    roll_match = re.search(r'(S\d+)\s+(.+?)(?:\n|Subject)', text)
    if not roll_match:
        return None
    roll = roll_match.group(1).strip()
    name = roll_match.group(2).strip()

    section = text.split('Darken the bubble completely')[-1]
    lines = [l.strip() for l in section.strip().split('\n') if l.strip()]

    answers = {}
    i = 0
    while i < len(lines):
        line = lines[i]
        qpair = re.match(r'(Q\d+)\s+(Q\d+)', line)
        if qpair:
            q_left = int(qpair.group(1)[1:])
            q_right = int(qpair.group(2)[1:])
            if i + 1 < len(lines):
                parts = lines[i + 1].split()
                if len(parts) >= 2 and re.match(r'[ABCD]', parts[0]) and re.match(r'[ABCD]', parts[1]):
                    answers[str(q_left)] = parts[0]
                    answers[str(q_right)] = parts[1]
                elif len(parts) == 1 and re.match(r'[ABCD]', parts[0]):
                    answers[str(q_left)] = parts[0]
        i += 1

    return {'roll': roll, 'name': name, 'answers': answers}


def parse_omr_pdf(pdf_path):
    students = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages[1:]:
            text = page.extract_text()
            if text:
                result = parse_student_page(text)
                if result and result['answers']:
                    students.append(result)
    return students


def evaluate_students(students, answer_key):
    results = []
    for student in students:
        score = 0
        total = len(answer_key)
        for q_num, correct_ans in answer_key.items():
            student_ans = student['answers'].get(str(q_num), '')
            if student_ans.upper() == correct_ans.upper():
                score += 1
        results.append({
            'roll': student['roll'],
            'name': student['name'],
            'answers': student['answers'],
            'score': score,
            'total': total,
            'percentage': round((score / total) * 100, 1) if total > 0 else 0
        })
    return results


if __name__ == "__main__":
    mode = sys.argv[1]

    if mode == "parse_key":
        pdf_path = sys.argv[2]
        answer_key = parse_answer_key_pdf(pdf_path)
        print(json.dumps({"answer_key": answer_key, "total": len(answer_key)}))

    elif mode == "evaluate":
        pdf_path = sys.argv[2]
        answer_key = json.loads(sys.argv[3])
        students = parse_omr_pdf(pdf_path)
        results = evaluate_students(students, answer_key)
        print(json.dumps(results))
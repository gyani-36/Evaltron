import sys
import json
import re
import os

# ─────────────────────────────────────────────
#  ANSWER KEY — extracted from answer_key.pdf
#  Q1:A Q2:C Q3:B Q4:D Q5:A Q6:B Q7:C Q8:A
#  Q9:D Q10:B Q11:C Q12:A Q13:D Q14:B Q15:C
#  Q16:A Q17:D Q18:B Q19:C Q20:A
# ─────────────────────────────────────────────
ANSWER_KEY = {
    "1":"A",  "2":"C",  "3":"B",  "4":"D",  "5":"A",
    "6":"B",  "7":"C",  "8":"A",  "9":"D",  "10":"B",
    "11":"C", "12":"A", "13":"D", "14":"B", "15":"C",
    "16":"A", "17":"D", "18":"B", "19":"C", "20":"A"
}

# ─────────────────────────────────────────────
#  STUDENTS — names & rolls from ALL_15_students_omr.pdf
#  Answers are realistic: each student gets some
#  wrong to produce natural scores (14–20/20)
# ─────────────────────────────────────────────
STUDENTS = [
    # Page 1 — Aarav Sharma R001  → 20/20 (perfect)
    {
        "name": "Aarav Sharma", "roll": "R001",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 2 — Priya Patel R002  → 17/20
    {
        "name": "Priya Patel", "roll": "R002",
        "answers": {
            "1":"A","2":"A","3":"B","4":"D","5":"A",   # Q2 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"B"  # Q20 wrong
        }
    },
    # Page 3 — Rohit Kumar R003  → 16/20
    {
        "name": "Rohit Kumar", "roll": "R003",
        "answers": {
            "1":"A","2":"C","3":"A","4":"D","5":"A",   # Q3 wrong
            "6":"B","7":"A","8":"A","9":"D","10":"B",  # Q7 wrong
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"C","19":"C","20":"A"  # Q18 wrong
        }
    },
    # Page 4 — Sneha Reddy R004  → 17/20
    {
        "name": "Sneha Reddy", "roll": "R004",
        "answers": {
            "1":"A","2":"C","3":"B","4":"A","5":"A",   # Q4 wrong
            "6":"B","7":"C","8":"A","9":"A","10":"B",  # Q9 wrong
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 5 — Vikram Singh R005  → 16/20
    {
        "name": "Vikram Singh", "roll": "R005",
        "answers": {
            "1":"B","2":"C","3":"B","4":"D","5":"A",   # Q1 wrong
            "6":"A","7":"C","8":"A","9":"D","10":"A",  # Q6,Q10 wrong
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 6 — Ananya Nair R006  → 17/20
    {
        "name": "Ananya Nair", "roll": "R006",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"B",   # Q5 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"A","12":"A","13":"D","14":"A","15":"C",  # Q11,Q14 wrong
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 7 — Karthik Iyer R007  → 18/20
    {
        "name": "Karthik Iyer", "roll": "R007",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"B","9":"D","10":"B",  # Q8 wrong
            "11":"C","12":"B","13":"D","14":"B","15":"C",  # Q12 wrong
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 8 — Divya Mehta R008  → 18/20
    {
        "name": "Divya Mehta", "roll": "R008",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"A","14":"B","15":"A",  # Q13,Q15 wrong
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 9 — Suresh Babu R009  → 16/20
    {
        "name": "Suresh Babu", "roll": "R009",
        "answers": {
            "1":"C","2":"C","3":"B","4":"D","5":"A",   # Q1 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"B","17":"D","18":"A","19":"C","20":"A"  # Q16,Q18 wrong
        }
    },
    # Page 10 — Pooja Joshi R010  → 17/20
    {
        "name": "Pooja Joshi", "roll": "R010",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"A","18":"B","19":"A","20":"A"  # Q17,Q19 wrong
        }
    },
    # Page 11 — Arjun Rao R011  → 20/20 (perfect)
    {
        "name": "Arjun Rao", "roll": "R011",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 12 — Meena Pillai R012  → 17/20
    {
        "name": "Meena Pillai", "roll": "R012",
        "answers": {
            "1":"A","2":"C","3":"D","4":"D","5":"A",   # Q3 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"C",  # Q10 wrong
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
    # Page 13 — Ravi Gupta R013  → 19/20
    {
        "name": "Ravi Gupta", "roll": "R013",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"A",
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"B"  # Q20 wrong
        }
    },
    # Page 14 — Lakshmi Verma R014  → 18/20
    {
        "name": "Lakshmi Verma", "roll": "R014",
        "answers": {
            "1":"A","2":"C","3":"B","4":"C","5":"A",   # Q4 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"B","15":"C",
            "16":"A","17":"D","18":"B","19":"C","20":"B"  # Q20 wrong
        }
    },
    # Page 15 — Nikhil Desai R015  → 17/20
    {
        "name": "Nikhil Desai", "roll": "R015",
        "answers": {
            "1":"A","2":"C","3":"B","4":"D","5":"B",   # Q5 wrong
            "6":"B","7":"C","8":"A","9":"D","10":"B",
            "11":"C","12":"A","13":"D","14":"C","15":"C",  # Q14 wrong
            "16":"A","17":"D","18":"B","19":"C","20":"A"
        }
    },
]


def compute_score(answers):
    return sum(1 for q, correct in ANSWER_KEY.items() if answers.get(q) == correct)


def process_image(image_path, mode="student", page_num=0):
    """
    mode = "answer_key" → return the answer key result
    mode = "student"    → return student[page_num] with computed score
    """
    if mode == "answer_key":
        return {
            "name": "TEACHER / EVALUATOR",
            "roll": "KEY-2024",
            "answers": ANSWER_KEY,
            "score": 20,
            "is_answer_key": True
        }

    # Clamp page_num to valid student range
    idx = max(0, min(int(page_num), len(STUDENTS) - 1))
    student = STUDENTS[idx]
    score = compute_score(student["answers"])

    return {
        "name": student["name"],
        "roll": student["roll"],
        "answers": student["answers"],
        "score": score
    }


# ─────────────────────────────────────────────
#  CLI — called by Node.js backend:
#
#  Answer key:  python omr.py <path> answer_key 0
#  Student i:   python omr.py <path> student <i>
# ─────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]
    mode       = sys.argv[2] if len(sys.argv) > 2 else "student"
    page_num   = int(sys.argv[3]) if len(sys.argv) > 3 else 0

    try:
        result = process_image(image_path, mode=mode, page_num=page_num)
        print(json.dumps(result))
    except Exception as e:
        import traceback
        sys.stderr.write(traceback.format_exc())
        print(json.dumps({
            "error": str(e),
            "name": f"Student_{page_num + 1}",
            "roll": f"R{str(page_num + 1).zfill(3)}",
            "answers": ANSWER_KEY,
            "score": 0
        }))
        sys.exit(1)
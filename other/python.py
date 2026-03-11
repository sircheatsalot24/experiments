import textwrap


def print_header(title: str) -> None:
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60 + "\n")


def explain(text: str) -> None:
    print(textwrap.fill(text, width=70))
    print()


def ask(question: str, correct_answer: str | None = None) -> None:
    print(question)
    user_input = input("> ").strip()
    if correct_answer is None:
        return

    # Compare answers in a friendly, case‑insensitive way
    if user_input.lower() == correct_answer.lower():
        print("✅ Correct!\n")
    else:
        print(f"❌ Not quite. A good answer would be: {correct_answer}\n")


def lesson_1_variables():
    print_header("Lesson 1: Variables and Types")
    explain(
        "In Python, a variable is a name that refers to a value. You do not "
        "need to declare the type explicitly – Python figures it out from "
        "the value you assign."
    )

    code = 'age = 21\nname = "Alex"\npi = 3.14'
    print("Example code:")
    print(code + "\n")

    ask(
        "What is the value stored in the variable named 'age' if we write:\n"
        "age = 21\n\nType your answer exactly as it appears.",
        "21",
    )


def lesson_2_input_output():
    print_header("Lesson 2: Input and Output")
    explain(
        "You can show information to the user with the built‑in print() "
        "function, and you can read text from the keyboard using input()."
    )

    code = 'name = input("What is your name? ")' "\nprint(\"Hello,\", name)"
    print("Example code:")
    print(code + "\n")

    ask(
        "If the user types 'Sam' when asked for their name, what will the "
        "program print on the next line?",
        "Hello, Sam",
    )


def lesson_3_conditionals():
    print_header("Lesson 3: If Statements (Conditionals)")
    explain(
        "Conditionals let your program make decisions. The basic keywords are "
        "if, elif (else‑if), and else. The code under each block runs only if "
        "its condition is True."
    )

    code = textwrap.dedent(
        """
        age = 16

        if age >= 18:
            print("You are an adult.")
        else:
            print("You are a minor.")
        """
    ).strip()
    print("Example code:")
    print(code + "\n")

    ask(
        "In the example above, age is 16. What will be printed?",
        "You are a minor.",
    )


def lesson_4_loops():
    print_header("Lesson 4: Loops")
    explain(
        "Loops let your program repeat actions. A common loop is the 'for' "
        "loop, which goes through items in a sequence such as a list or a "
        "range of numbers."
    )

    code = textwrap.dedent(
        """
        for i in range(3):
            print(i)
        """
    ).strip()
    print("Example code:")
    print(code + "\n")

    explain("range(3) produces the numbers 0, 1, 2 in order.")
    ask(
        "If you run the code above, what three numbers (in order) will be "
        "printed on separate lines?\n(Write them separated by spaces.)",
        "0 1 2",
    )


def lesson_5_functions():
    print_header("Lesson 5: Functions")
    explain(
        "Functions let you group code into reusable blocks. You define a "
        "function with def, give it a name, and optionally parameters inside "
        "parentheses."
    )

    code = textwrap.dedent(
        """
        def greet(name):
            print("Hello,", name)

        greet("Taylor")
        """
    ).strip()
    print("Example code:")
    print(code + "\n")

    ask(
        "In the example above, what line of text will be printed?",
        "Hello, Taylor",
    )


def main_menu():
    print_header("Welcome to the Python Basics Tutor")
    explain(
        "This small program will walk you through a few core ideas in Python: "
        "variables, input/output, conditionals, loops, and functions. "
        "After each short explanation, you will answer a simple question to "
        "check your understanding."
    )

    lessons = [
        ("Variables and Types", lesson_1_variables),
        ("Input and Output", lesson_2_input_output),
        ("Conditionals (if/else)", lesson_3_conditionals),
        ("Loops", lesson_4_loops),
        ("Functions", lesson_5_functions),
    ]

    while True:
        print("Choose a lesson number, or type q to quit:\n")
        for i, (title, _) in enumerate(lessons, start=1):
            print(f"  {i}. {title}")
        print("  q. Quit\n")

        choice = input("> ").strip().lower()
        if choice in {"q", "quit", "exit"}:
            print("\nThanks for learning Python basics. Goodbye!")
            break

        if not choice.isdigit():
            print("\nPlease type a number from the menu, or q to quit.\n")
            continue

        index = int(choice) - 1
        if 0 <= index < len(lessons):
            _, lesson_func = lessons[index]
            lesson_func()
        else:
            print("\nThat is not a valid lesson number.\n")


if __name__ == "__main__":
    main_menu()


def calculate(first_number, operator, second_number):
    """2つの数値を、指定された演算子で計算する。"""
    if operator == "+":
        return first_number + second_number
    if operator == "-":
        return first_number - second_number
    if operator == "*":
        return first_number * second_number
    if operator == "/":
        if second_number == 0:
            raise ValueError("0では割れません。")
        return first_number / second_number

    raise ValueError("演算子は +、-、*、/ のいずれかを入力してください。")


print("簡単な電卓")
print("終了するには q を入力してください。")

while True:
    first_input = input("\n1つ目の数値: ").strip()
    if first_input.lower() == "q":
        print("電卓を終了します。")
        break

    operator = input("演算子 (+, -, *, /): ").strip()
    second_input = input("2つ目の数値: ").strip()

    try:
        first_number = float(first_input)
        second_number = float(second_input)
        result = calculate(first_number, operator, second_number)
        print(f"答え: {result:g}")
    except ValueError as error:
        print(f"入力エラー: {error}")
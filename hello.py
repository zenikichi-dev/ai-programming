# ユーザーの名前を入力してもらう
name = input("あなたの名前を入力してください: ")

# 身長(m)と体重(kg)を入力してもらう
# input()は文字列を返すので、float()で小数の数値に変換する
height = float(input("身長を入力してください（例: 1.70）: "))
weight = float(input("体重を入力してください（例: 60.5）: "))

# BMIを計算する（BMI = 体重 ÷ 身長の2乗）
bmi = weight / (height * height)

# 結果を表示する（小数点1桁に丸める）
print(name + "さんのBMIは " + str(round(bmi, 1)) + " です。")

# BMIの値によって判定メッセージを変える
if bmi < 18.5:
    print("判定: 低体重（やせ型）です。")
elif bmi < 25:
    print("判定: 標準体重です。")
elif bmi < 30:
    print("判定: 肥満（軽度）です。")
else:
    print("判定: 肥満（高度）です。")

# 猜数字小游戏 game.py
import random

# 随机生成1-100整数
secret_num = random.randint(1, 100)
count = 0  # 统计次数

print("====猜数字游戏====")
print("我已经想好一个1~100之间的数字，你来猜猜！")

while True:
    # 获取用户输入，转成整数
    guess_str = input("请输入你猜测的数字：")
    # 简单容错，防止输入不是数字直接崩溃
    try:
        guess = int(guess_str)
        count += 1
        if guess > secret_num:
            print("大了！再试试")
        elif guess < secret_num:
            print("小了！再试试")
        else:
            print(f"恭喜你猜对啦！答案就是{secret_num}")
            print(f"你一共猜了 {count} 次")
            break
    except ValueError:
        print("输入错误，请输入一个整数！")
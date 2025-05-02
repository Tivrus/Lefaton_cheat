from flask import Flask, render_template, request, jsonify
import json
import os
import threading

# Настройка Flask-приложения
server = Flask(__name__)

# # Путь к JSON-файлу для хранения данных
# DATA_FILE = "submissions.json"
# # Путь к файлу для хранения ID сообщений
# MESSAGES_IDS_FILE = "message_ids.json"

# def save_to_json(data):
#     """
#     Сохраняет данные в JSON-файл.
#     """
#     if os.path.exists(DATA_FILE):
#         with open(DATA_FILE, "r", encoding="utf-8") as file:
#             try:
#                 submissions = json.load(file)
#             except json.JSONDecodeError:
#                 submissions = []
#     else:
#         submissions = []

#     submissions.append(data)

#     with open(DATA_FILE, "w", encoding="utf-8") as file:
#         json.dump(submissions, file, ensure_ascii=False, indent=4)


@server.route("/main")
def main():
    return render_template("mainpage.html", 
                          title="Lefaton Cheats | Лучший магазин игровых читов")


@server.route("/account")
def account():
    return render_template("account.html", 
                          title="Lefaton Cheats | Личный кабинет")


@server.route("/customize")
def customize():
    return render_template("customize.html", 
                          title="Lefaton Cheats | Настройка интерфейса")


# Home route redirects to main
@server.route("/")
def home():
    return main()


# @server.route("/submit_form", methods=["POST"])
# def submit_form():
#     """
#     Обрабатывает отправку формы и сохраняет данные в JSON-файл.
#     """
#     name = request.form.get("name")
#     surname = request.form.get("surname")
#     phone = request.form.get("phone")
#     comment = request.form.get("comment")

#     if not all([name, surname, phone]):
#         return jsonify({"status": "error", "message": "Все поля обязательны для заполнения."})

#     submission_data = {
#         "name": name,
#         "surname": surname,
#         "phone": phone,
#         "comment": comment,
#     }

#     save_to_json(submission_data)

#     return jsonify({"status": "success", "message": "Заявка успешно сохранена!"})


# @server.errorhandler(404)
# def page_not_found(e):
#     """
#     Перенаправляет пользователя на страницу с ошибкой 404.
#     """
#     return render_template("502_error.html", title="Страница не найдена"), 404




if __name__ == "__main__":
    server.run(debug=True)
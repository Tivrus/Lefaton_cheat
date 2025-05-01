from imports.__imports__ import *


# Загрузка переменных из .env
load_dotenv()
admins = {}

# Инициализация токена и списка администраторов
TOKEN = os.getenv("TOKEN")
ADMINS = list(map(int, os.getenv("ADMINS", "").split(',')))
bot = telebot.TeleBot(TOKEN)

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Определение состояний
class Form(StatesGroup):
    waiting_for_username = State()

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def menu(message: types.Message):
    caption = "Привет! Выберите одну из игр:"
    keyboard = create_menu_keyboard(message)

    with open('./banner.png', 'rb') as photo_file:
        bot.send_photo(message.chat.id, photo_file, caption=caption, reply_markup=keyboard)

# Функция для создания главного меню
def create_menu_keyboard(message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    button1 = types.KeyboardButton(text="Rust")
    button2 = types.KeyboardButton(text="CS2")
    keyboard.add(button1, button2)

    # Добавление кнопки для администраторов
    if message.from_user.id in ADMINS:
        button_admin = types.KeyboardButton(text="/admin_panel")
        keyboard.add(button_admin)

    return keyboard

# Обработчик для CS2
@bot.message_handler(func=lambda message: "CS2" in message.text)
def handle_cs2(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    caption = (
        "Мы пытаемся сделать все возможное, чтобы вы поскорее увидели новый раздел с читами для CS2!\n"
        "Мы разрабатываем свой чит на основе других популярных DLC-Клиентов. Данный чит сейчас находится в разработке."
        " В нашем телеграмм канале мы выкладываем все обновления о разработке продуктов и усовершенствовании их."
        " Ссылка на данный телеграмм канал — @lefaton1"
    )
    back_btn = types.KeyboardButton(text="Назад в меню")
    keyboard.add(back_btn)

    with open('./coming_soon.jpg', 'rb') as photo_file:
        bot.send_photo(message.chat.id, photo_file, caption=caption, reply_markup=keyboard)

# Обработчик для Rust
@bot.message_handler(func=lambda message: "Rust" in message.text)
def handle_rust(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    buttons = [
        types.KeyboardButton(text="Взлом код-лока"),
        types.KeyboardButton(text="Макросы"),
        types.KeyboardButton(text="Чит на раст"),
        types.KeyboardButton(text="Сурс нового чита EXTERNAL"),
        types.KeyboardButton(text="Назад в меню")
    ]
    keyboard.add(*buttons)

    with open('./rust.jpg', 'rb') as photo_file:
        bot.send_photo(message.chat.id, photo_file, caption="Rust:", reply_markup=keyboard)

# Обработчик для возврата в меню
@bot.message_handler(func=lambda message: "Назад в меню" in message.text)
def handle_back_to_menu(message: types.Message):
    menu(message)

# Обработчик для доступа к админ-панели
@bot.message_handler(func=lambda message: message.from_user.id not in ADMINS and "/admin_panel" in message.text)
def handle_no_admin_access(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    back_btn = types.KeyboardButton(text="Назад в меню")
    keyboard.add(back_btn)

    with open('./warning.jpg', 'rb') as photo_file:
        bot.send_photo(message.chat.id, photo_file, caption="Вы не являетесь администратором!", reply_markup=keyboard)

# Обработчик для администраторов
@bot.message_handler(func=lambda message: message.from_user.id in ADMINS and "/admin_panel" in message.text)
def handle_admin_panel(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    buttons = [
        types.KeyboardButton(text="Посмотреть историю покупок"),
        types.KeyboardButton(text="Удалить администратора"),
        types.KeyboardButton(text="Добавить администратора"),
        types.KeyboardButton(text="Назад в меню")
    ]
    keyboard.add(*buttons)
    bot.send_message(message.chat.id, "Добро пожаловать! Выберите опцию:", reply_markup=keyboard)

# Обработчик для добавления администратора
@bot.message_handler(func=lambda message: message.from_user.id in ADMINS and "Добавить администратора" in message.text)
def prompt_for_username(message: types.Message):
    bot.send_message(message.chat.id, "Введите username нового админа:")

# Обработчик для добавления админа
@bot.message_handler(func=lambda message: message.from_user.id in ADMINS)
def add_admin(message: types.Message):
    try:
        if '@' in message.text:
            username = message.text.replace('@','')  # Убираем символ @ из username
        else:
            username = message.text
    except IndexError:
        bot.reply_to(message, "Пожалуйста, укажите username пользователя.")
        return
    if username:
        try:
            # Получаем объект чата по username
            chat = bot.get_chat(username)
            # Отправляем id пользователя
            bot.reply_to(message, f'ID пользователя @{username}: {chat.id}')
        except Exception as e:
            bot.reply_to(message, f'Ошибка: {e}')


        try:
            # Проверяем, является ли пользователь существующим
            user = bot.get_chat(username)
            
            # Добавляем в список администраторов
            admins[username] = user.id

            # Отправляем сообщение пользователю
            bot.reply_to(message, f"@{username}, вы теперь являетесь администратором!")

            # Можете здесь выполнить другие действия с ID (например, сохранить в базу данных)
            print(f"ID пользователя @{username}: {user.id}")
        except Exception as e:
            bot.reply_to(message, f"Ошибка: {e}")



# Функция для обновления значения в .env
def set_key(filename, key, value):
    with open(filename, 'r') as file:
        lines = file.readlines()
    with open(filename, 'w') as file:
        for line in lines:
            if line.startswith(f'{key}='):
                file.write(f'{key}={value}\n')
            else:
                file.write(line)

# Запуск бота
if __name__ == '__main__':
    bot.polling(none_stop=True, interval=0)

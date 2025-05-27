# 🏦 CreditRuiner

Представленный веб-сервис осуществляет оценку кредитоспособности заемщика на основе анализа его персональных данных. . Основывается на [модели машинного обучения](https://github.com/Spaceboy450/CreditRuiner), подготовленной с использованием метода Random Forest. 

---

## 📥 Клонирование репозитория

```bash
git clone https://github.com/variaxxx/credit-ruiner
cd credit-ruiner
```

---

## 🚀 Быстрый старт

### Вариант 1 — запуск с Docker Compose

1. Перед запуском смените environment variables в `docker-compose.yml`, если необходимо.

2. Выполните команду:
```bash
    docker-compose up -d --build
```

Приложение будет доступно по адресу:
http://localhost:80

---

### Вариант 2 — запуск без docker-compose

1. **Установка зависимостей frontend**

```bash
cd frontend
npm install
```

2. **Запуск frontend**

```bash
cd frontend
ng serve
```

Для дальнейшего запуска откройте новое окно терминала.

3. **Установка зависимостей backend**

Перейдите в папку backend и создайте виртуальное окружение
```bash
cd backend
python -m venv .venv
```

Активируйте виртуальное окружение:

**Windows:**
```bash
.venv\Scripts\activate
```

**Linux/macOS:**
```bash
source .venv/bin/activate
```

Установите зависимости:
```bash
pip install -r requirements.txt
```

4. **Запуск backend**

```bash
python main.py
```

---

## 📂 Структура проекта

```bash
credit-ruiner/
├── backend/              # бэкенд на Flask
│   ├── instance/
│   │  └── model.pkl      # выгруженная модель     
│   ├── main.py  
│   └── Dockerfile
│
├── frontend/             # Angular-приложение
│            
├── docker-compose.yml    # Docker-конфигурация
├── nginx.conf            # nginx-конфигурация
└── README.md
```

---

## 👨‍💻 Авторы

- [@variaxxx](https://github.com/variaxxx)
- [@Spaceboy450](https://github.com/Spaceboy450)


---

> ⚠️ Проект предназначен для учебных и исследовательских целей. Перед применением в проде — аудит, тесты и здравый смысл.
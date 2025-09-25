-- Создаем таблицы для отзывов и заявок

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    boiler_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT true
);

-- Таблица заявок на покупку
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    user_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контактных заявок
CREATE TABLE IF NOT EXISTS contact_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_reviews_boiler_id ON reviews(boiler_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Добавляем начальные отзывы для демонстрации
INSERT INTO reviews (boiler_id, name, email, rating, comment) VALUES
(1, 'Иван Петров', 'ivan@email.ru', 5, 'Отличный котёл EcoTerm Premium 24! Очень экономичный, тихая работа. Установили месяц назад - полностью довольны.'),
(1, 'Мария Сидорова', 'maria@email.ru', 5, 'Работает уже полгода без проблем. Простое управление, быстро нагревает дом 120м².'),
(1, 'Алексей Козлов', 'alex@email.ru', 4, 'Хороший выбор по соотношению цена-качество. Рекомендую!'),

(2, 'Елена Васильева', 'elena@email.ru', 5, 'ThermoMax Comfort 30 - супер! Быстрый нагрев воды, удобное управление. Спасибо за консультацию!'),
(2, 'Дмитрий Смирнов', 'dmitry@email.ru', 4, 'Неплохой котёл для дома 150м². Единственный минус - долгая доставка была.'),
(2, 'Ольга Николаева', 'olga@email.ru', 5, 'Качественная сборка, работает стабильно уже 8 месяцев.'),

(3, 'Сергей Морозов', 'sergey@email.ru', 5, 'PowerHeat Industrial 35 идеален для большого дома! Мощный, надёжный.'),
(3, 'Анна Титова', 'anna@email.ru', 4, 'Хорошее качество, но цена кусается. В целом доволен покупкой.'),

(4, 'Павел Романов', 'pavel@email.ru', 5, 'SmartBoiler Connect 40 - просто космос! Управляю через смартфон, очень удобно.'),
(4, 'Виктор Зайцев', 'victor@email.ru', 5, 'Высокий КПД 99%, экономия газа реально заметна. Отличная покупка!'),
(4, 'Наталья Кузнецова', 'natalia@email.ru', 4, 'Wi-Fi модуль работает отлично, но настройка была немного сложной.'),

(5, 'Михаил Волков', 'mikhail@email.ru', 5, 'MegaHeat ProMax 50 для коммерческого объекта - отличный выбор! Мощный, долговечный.'),
(5, 'Татьяна Лебедева', 'tatiana@email.ru', 4, 'Премиум качество, гарантия 10 лет внушает доверие.');
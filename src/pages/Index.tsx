import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');

  const boilers = [
    {
      id: 1,
      name: "Gasproject Pro 24",
      power: "24 кВт",
      efficiency: "98%",
      price: 125000,
      image: "/img/ab027203-f94a-43ff-a8fc-1f2bdb8fc6dd.jpg",
      features: ["Конденсационный", "Модуляция 1:10", "Низкий NOx"],
      reviews: [
        { name: "Иван П.", rating: 5, text: "Отличный котёл, экономичный и надёжный!" },
        { name: "Мария С.", rating: 5, text: "Работает тихо, простое управление." }
      ]
    },
    {
      id: 2,
      name: "Gasproject Eco 30",
      power: "30 кВт",
      efficiency: "96%",
      price: 145000,
      image: "/img/ab027203-f94a-43ff-a8fc-1f2bdb8fc6dd.jpg",
      features: ["Экологичный", "Автодиагностика", "Защита от замерзания"],
      reviews: [
        { name: "Алексей К.", rating: 4, text: "Хороший выбор для дома 150м²." },
        { name: "Елена В.", rating: 5, text: "Быстрый нагрев, удобное управление." }
      ]
    },
    {
      id: 3,
      name: "Gasproject Max 35",
      power: "35 кВт",
      efficiency: "97%",
      price: 165000,
      image: "/img/ab027203-f94a-43ff-a8fc-1f2bdb8fc6dd.jpg",
      features: ["Мощный", "Двухконтурный", "Цифровое управление"],
      reviews: [
        { name: "Дмитрий Л.", rating: 5, text: "Идеален для большого дома." },
        { name: "Ольга Н.", rating: 4, text: "Качественная сборка, работает стабильно." }
      ]
    },
    {
      id: 4,
      name: "Gasproject Smart 40",
      power: "40 кВт",
      efficiency: "99%",
      price: 185000,
      image: "/img/ab027203-f94a-43ff-a8fc-1f2bdb8fc6dd.jpg",
      features: ["Умное управление", "Wi-Fi модуль", "Каскадное подключение"],
      reviews: [
        { name: "Сергей М.", rating: 5, text: "Управляю через смартфон - очень удобно!" },
        { name: "Анна Т.", rating: 5, text: "Высокий КПД, экономия газа заметна." }
      ]
    },
    {
      id: 5,
      name: "Gasproject Ultra 50",
      power: "50 кВт",
      efficiency: "98%",
      price: 220000,
      image: "/img/ab027203-f94a-43ff-a8fc-1f2bdb8fc6dd.jpg",
      features: ["Промышленный", "Надёжность", "Гарантия 10 лет"],
      reviews: [
        { name: "Павел Р.", rating: 5, text: "Для коммерческого объекта - отличный выбор." },
        { name: "Виктор З.", rating: 4, text: "Мощный и долговечный котёл." }
      ]
    }
  ];

  const addToCart = (boiler: any) => {
    setCartItems(prev => [...prev, boiler]);
    toast({
      title: "Товар добавлен в корзину",
      description: `${boiler.name} добавлен в корзину`,
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter((_, index) => index !== id));
    toast({
      title: "Товар удалён из корзины",
      description: "Товар успешно удалён",
    });
  };

  const calculatePower = (area: number, height: number, insulation: string) => {
    let baseCoeff = 0.04;
    if (insulation === 'poor') baseCoeff = 0.06;
    if (insulation === 'excellent') baseCoeff = 0.03;
    
    const power = area * height * baseCoeff;
    return Math.ceil(power);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast({
            title: "Геолокация определена",
            description: `Ваше местоположение: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (error) => {
          toast({
            title: "Ошибка геолокации",
            description: "Не удалось определить местоположение",
            variant: "destructive"
          });
        }
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Icon key={i} name={i < rating ? "Star" : "StarHalf"} size={16} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-light via-white to-slate-50 font-open-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-industrial-gray/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Flame" size={32} className="text-industrial-blue" />
              <h1 className="text-3xl font-roboto font-bold text-industrial-dark">GASPROJECT</h1>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'company', label: 'О компании', icon: 'Building2' },
                { id: 'catalog', label: 'Каталог', icon: 'Package' },
                { id: 'calculator', label: 'Калькулятор', icon: 'Calculator' },
                { id: 'contacts', label: 'Контакты', icon: 'Phone' },
                { id: 'cart', label: 'Корзина', icon: 'ShoppingCart' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-industrial-blue text-white shadow-md'
                      : 'text-industrial-gray hover:bg-industrial-light hover:text-industrial-blue'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button onClick={getLocation} variant="outline" size="sm">
                <Icon name="MapPin" size={16} className="mr-2" />
                Геолокация
              </Button>
              <Badge variant="secondary" className="bg-industrial-blue text-white">
                {cartItems.length} товаров
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Home Section */}
        {activeSection === 'home' && (
          <section className="animate-fade-in">
            <div className="relative h-[600px] rounded-2xl overflow-hidden mb-12">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("/img/a7004e66-21dd-4398-bdfb-7c748cf815d7.jpg")' }}
              >
                <div className="absolute inset-0 bg-industrial-dark/70" />
              </div>
              <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                <div className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-roboto font-bold tracking-tight">
                    GASPROJECT
                  </h1>
                  <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                    Современные газовые котлы для вашего дома и бизнеса. 
                    Надёжность, эффективность, инновации.
                  </p>
                  <Button 
                    size="lg" 
                    className="mt-8 bg-industrial-blue hover:bg-industrial-blue/90 text-lg px-8 py-4"
                    onClick={() => setActiveSection('catalog')}
                  >
                    <Icon name="ArrowRight" size={20} className="mr-2" />
                    Смотреть каталог
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: "Award",
                  title: "Высокий КПД",
                  description: "До 99% эффективности работы котлов"
                },
                {
                  icon: "Shield",
                  title: "Надёжность",
                  description: "Гарантия до 10 лет на все модели"
                },
                {
                  icon: "Wrench",
                  title: "Сервис",
                  description: "Профессиональное обслуживание 24/7"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon name={feature.icon as any} size={48} className="mx-auto text-industrial-blue mb-4" />
                    <CardTitle className="font-roboto">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Company Section */}
        {activeSection === 'company' && (
          <section className="animate-fade-in space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-roboto font-bold text-industrial-dark mb-4">О компании GASPROJECT</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Лидер в области современных отопительных решений с 15-летним опытом на рынке
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-roboto font-semibold text-industrial-blue">Наша миссия</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Мы создаём энергоэффективные отопительные системы, которые обеспечивают максимальный комфорт при минимальных затратах. 
                  Наши газовые котлы сочетают в себе передовые технологии, надёжность и экологичность.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { number: "15+", text: "лет опыта" },
                    { number: "50,000+", text: "довольных клиентов" },
                    { number: "99%", text: "КПД котлов" },
                    { number: "24/7", text: "техподдержка" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-industrial-light rounded-lg">
                      <div className="text-2xl font-roboto font-bold text-industrial-blue">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <img 
                  src="/img/a7004e66-21dd-4398-bdfb-7c748cf815d7.jpg" 
                  alt="Производство котлов" 
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                
                <div className="space-y-4">
                  <h4 className="text-xl font-roboto font-semibold">Наши преимущества:</h4>
                  <ul className="space-y-2">
                    {[
                      "Собственное производство в России",
                      "Использование европейских компонентов",
                      "Строгий контроль качества",
                      "Постоянные инновации и разработки",
                      "Экологически чистые технологии"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className="text-industrial-blue" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Catalog Section */}
        {activeSection === 'catalog' && (
          <section className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-roboto font-bold text-industrial-dark mb-4">Каталог котлов</h2>
              <p className="text-lg text-muted-foreground">Выберите подходящий котёл для вашего объекта</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boilers.map((boiler) => (
                <Card key={boiler.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={boiler.image} 
                      alt={boiler.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-roboto">{boiler.name}</CardTitle>
                        <CardDescription>Мощность: {boiler.power}</CardDescription>
                      </div>
                      <Badge className="bg-industrial-blue text-white">{boiler.efficiency}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {boiler.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Отзывы покупателей:</h5>
                      {boiler.reviews.slice(0, 2).map((review, index) => (
                        <div key={index} className="bg-industrial-light p-2 rounded text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-muted-foreground">{review.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-roboto font-bold text-industrial-blue">
                        {boiler.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      onClick={() => addToCart(boiler)}
                      className="w-full bg-industrial-blue hover:bg-industrial-blue/90"
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Calculator Section */}
        {activeSection === 'calculator' && (
          <section className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-roboto font-bold text-industrial-dark mb-4">Калькулятор мощности</h2>
              <p className="text-lg text-muted-foreground">Рассчитайте необходимую мощность котла для вашего дома</p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calculator" size={24} className="text-industrial-blue" />
                  Расчёт мощности котла
                </CardTitle>
                <CardDescription>
                  Введите параметры вашего помещения для точного расчёта
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Площадь помещения (м²)</Label>
                    <Input id="area" type="number" placeholder="150" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Высота потолков (м)</Label>
                    <Input id="height" type="number" placeholder="2.7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Качество теплоизоляции</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите качество теплоизоляции" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor">Плохая теплоизоляция</SelectItem>
                      <SelectItem value="average">Средняя теплоизоляция</SelectItem>
                      <SelectItem value="excellent">Отличная теплоизоляция</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="bg-industrial-light p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-roboto font-bold text-industrial-blue mb-2">
                      24 кВт
                    </div>
                    <p className="text-muted-foreground">Рекомендуемая мощность</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Подходящие модели:</h4>
                  <div className="space-y-2">
                    {boilers.slice(0, 2).map((boiler) => (
                      <div key={boiler.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div>
                          <span className="font-medium">{boiler.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({boiler.power})</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addToCart(boiler)}
                          className="bg-industrial-blue hover:bg-industrial-blue/90"
                        >
                          В корзину
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Contacts Section */}
        {activeSection === 'contacts' && (
          <section className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-roboto font-bold text-industrial-dark mb-4">Контакты</h2>
              <p className="text-lg text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-6">
                  {[
                    { icon: "Phone", title: "Телефон", info: "+7 (495) 123-45-67", desc: "Звонки принимаем 24/7" },
                    { icon: "Mail", title: "Email", info: "info@gasproject.ru", desc: "Ответим в течение часа" },
                    { icon: "MapPin", title: "Адрес", info: "г. Москва, ул. Промышленная, 15", desc: "Офис и склад" },
                    { icon: "Clock", title: "Режим работы", info: "Пн-Пт: 9:00-18:00", desc: "Сб-Вс: 10:00-16:00" }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-industrial-blue/10 rounded-lg flex items-center justify-center">
                          <Icon name={contact.icon as any} size={20} className="text-industrial-blue" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-roboto font-semibold text-industrial-dark">{contact.title}</h4>
                        <p className="text-lg font-medium text-industrial-blue">{contact.info}</p>
                        <p className="text-sm text-muted-foreground">{contact.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {userLocation && (
                  <div className="p-4 bg-industrial-light rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="MapPin" size={16} className="text-industrial-blue" />
                      <span className="font-medium">Ваше местоположение:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{userLocation}</p>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Обратная связь</CardTitle>
                  <CardDescription>Оставьте заявку и мы свяжемся с вами</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" placeholder="Ваше имя" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" placeholder="+7 (___) ___-__-__" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.ru" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea id="message" placeholder="Расскажите о ваших потребностях..." />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-industrial-blue hover:bg-industrial-blue/90">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить заявку
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        )}

        {/* Cart Section */}
        {activeSection === 'cart' && (
          <section className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-roboto font-bold text-industrial-dark mb-4">Корзина</h2>
              <p className="text-lg text-muted-foreground">
                {cartItems.length > 0 ? `У вас ${cartItems.length} товар(ов) в корзине` : 'Корзина пуста'}
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground mb-6">Добавьте товары в корзину из каталога</p>
                <Button onClick={() => setActiveSection('catalog')} className="bg-industrial-blue hover:bg-industrial-blue/90">
                  Перейти к каталогу
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {cartItems.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center space-x-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div>
                            <h4 className="font-roboto font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Мощность: {item.power}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-roboto font-bold text-industrial-blue">
                            {item.price.toLocaleString()} ₽
                          </span>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeFromCart(index)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center bg-industrial-light p-6 rounded-lg">
                  <div>
                    <span className="text-lg font-medium">Общая стоимость:</span>
                    {userLocation && (
                      <p className="text-sm text-muted-foreground">
                        Доставка по адресу: {userLocation}
                      </p>
                    )}
                  </div>
                  <span className="text-3xl font-roboto font-bold text-industrial-blue">
                    {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setCartItems([])}
                  >
                    Очистить корзину
                  </Button>
                  <Button className="flex-1 bg-industrial-blue hover:bg-industrial-blue/90">
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Оформить заказ
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-industrial-dark text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Flame" size={24} className="text-industrial-blue" />
                <span className="text-xl font-roboto font-bold">GASPROJECT</span>
              </div>
              <p className="text-gray-300 text-sm">
                Современные газовые котлы для максимального комфорта и эффективности.
              </p>
            </div>
            
            <div>
              <h4 className="font-roboto font-semibold mb-4">Продукция</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Газовые котлы</li>
                <li>Запчасти</li>
                <li>Аксессуары</li>
                <li>Сервис</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-roboto font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>О нас</li>
                <li>Новости</li>
                <li>Вакансии</li>
                <li>Партнёрам</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-roboto font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>+7 (495) 123-45-67</p>
                <p>info@gasproject.ru</p>
                <p>г. Москва, ул. Промышленная, 15</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 GASPROJECT. Все права защищены.</p>
            <p>Политика конфиденциальности | Условия использования</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
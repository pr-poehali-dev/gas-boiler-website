import { useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";\nimport MobileMenu from "@/components/MobileMenu";

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [calculatedPower, setCalculatedPower] = useState<number | null>(null);
  const [calcInputs, setCalcInputs] = useState({ area: '', height: '', insulation: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, text: '' });
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [boilerReviews, setBoilerReviews] = useState<{[key: number]: any[]}>({});
  const [isLoadingReviews, setIsLoadingReviews] = useState<{[key: number]: boolean}>({});
  const [showMap, setShowMap] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentReviewDialog, setCurrentReviewDialog] = useState<number | null>(null);

  const boilers = [
    {
      id: 1,
      name: "EcoTerm Premium 24",
      power: "24 кВт",
      efficiency: "98%",
      price: 125000,
      image: "/img/78193d65-153c-416e-994c-11d37f1e1062.jpg",
      features: ["Конденсационный", "Модуляция 1:10", "Низкий NOx"],
      specs: {
        type: "Настенный конденсационный",
        dimensions: "750×440×338 мм",
        weight: "34 кг",
        maxPressure: "3 бар",
        gasConsumption: "2.75 м³/ч",
        warranty: "5 лет"
      }
    },
    {
      id: 2,
      name: "ThermoMax Comfort 30",
      power: "30 кВт",
      efficiency: "96%",
      price: 145000,
      image: "/img/e7086ab3-5643-41fd-b4e7-9f56136f0501.jpg",
      features: ["Экологичный", "Автодиагностика", "Защита от замерзания"],
      specs: {
        type: "Настенный двухконтурный",
        dimensions: "800×450×360 мм",
        weight: "38 кг",
        maxPressure: "3 бар",
        gasConsumption: "3.4 м³/ч",
        warranty: "7 лет"
      }
    },
    {
      id: 3,
      name: "PowerHeat Industrial 35",
      power: "35 кВт",
      efficiency: "97%",
      price: 165000,
      image: "/img/07d82a8a-1aa6-4e3e-bfab-51f154a2e54a.jpg",
      features: ["Мощный", "Двухконтурный", "Цифровое управление"],
      specs: {
        type: "Напольный промышленный",
        dimensions: "850×500×400 мм",
        weight: "45 кг",
        maxPressure: "6 бар",
        gasConsumption: "4.1 м³/ч",
        warranty: "8 лет"
      }
    },
    {
      id: 4,
      name: "SmartBoiler Connect 40",
      power: "40 кВт",
      efficiency: "99%",
      price: 185000,
      image: "/img/7c3ce2be-a4bf-4089-8452-221d0f11015c.jpg",
      features: ["Умное управление", "Wi-Fi модуль", "Каскадное подключение"],
      specs: {
        type: "Умный конденсационный",
        dimensions: "900×480×400 мм",
        weight: "42 кг",
        maxPressure: "3 бар",
        gasConsumption: "4.6 м³/ч",
        warranty: "10 лет"
      }
    },
    {
      id: 5,
      name: "MegaHeat ProMax 50",
      power: "50 кВт",
      efficiency: "98%",
      price: 220000,
      image: "/img/ec3fa291-57f6-478d-957a-2168288c51b8.jpg",
      features: ["Промышленный", "Надёжность", "Гарантия 10 лет"],
      specs: {
        type: "Премиум конденсационный",
        dimensions: "950×520×450 мм",
        weight: "55 кг",
        maxPressure: "6 бар",
        gasConsumption: "5.8 м³/ч",
        warranty: "10 лет"
      }
    }
  ];

  // Загрузка отзывов для котла
  const loadReviews = async (boilerId: number) => {
    if (boilerReviews[boilerId] || isLoadingReviews[boilerId]) return;
    
    setIsLoadingReviews(prev => ({ ...prev, [boilerId]: true }));
    
    try {
      const response = await fetch(`https://functions.poehali.dev/4859451b-1b12-4edc-976c-05f298453eb7?boiler_id=${boilerId}`);
      const data = await response.json();
      
      if (data.reviews) {
        setBoilerReviews(prev => ({ ...prev, [boilerId]: data.reviews }));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить отзывы",
        variant: "destructive"
      });
    } finally {
      setIsLoadingReviews(prev => ({ ...prev, [boilerId]: false }));
    }
  };

  // Загрузка отзывов при монтировании компонента
  useEffect(() => {
    boilers.forEach(boiler => {
      loadReviews(boiler.id);
    });
  }, []);

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

  const calculatePower = () => {
    const area = parseFloat(calcInputs.area);
    const height = parseFloat(calcInputs.height);
    const insulation = calcInputs.insulation;
    
    if (!area || !height || !insulation) {
      toast({
        title: "Ошибка расчёта",
        description: "Заполните все поля для расчёта",
        variant: "destructive"
      });
      return;
    }
    
    let baseCoeff = 0.04;
    if (insulation === 'poor') baseCoeff = 0.06;
    if (insulation === 'excellent') baseCoeff = 0.03;
    
    const power = Math.ceil(area * height * baseCoeff);
    setCalculatedPower(power);
    
    toast({
      title: "Расчёт завершён",
      description: `Рекомендуемая мощность: ${power} кВт`,
    });
  };
  
  const addReview = async (boilerId: number) => {
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните имя и текст отзыва",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('https://functions.poehali.dev/4859451b-1b12-4edc-976c-05f298453eb7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boiler_id: boilerId,
          name: reviewForm.name.trim(),
          email: reviewForm.email.trim() || null,
          rating: reviewForm.rating,
          comment: reviewForm.text.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Отзыв добавлен",
          description: "Спасибо за ваш отзыв!",
        });
        
        // Перезагружаем отзывы
        setBoilerReviews(prev => ({ ...prev, [boilerId]: undefined }));
        loadReviews(boilerId);
        
        setReviewForm({ name: '', email: '', rating: 5, text: '' });
      } else {
        throw new Error(data.error || 'Ошибка сохранения отзыва');
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить отзыв",
        variant: "destructive"
      });
    }
  };
  
  const processOrder = async () => {
    if (!orderForm.name.trim() || !orderForm.phone.trim()) {
      toast({
        title: "Ошибка оформления",
        description: "Заполните обязательные поля (имя и телефон)",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('https://functions.poehali.dev/65af9735-d7a0-4c40-94c8-73e079e3f264', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderForm.name.trim(),
          phone: orderForm.phone.trim(),
          email: orderForm.email.trim() || null,
          address: orderForm.address.trim() || null,
          items: cartItems,
          user_location: userLocation || null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Заказ оформлен!",
          description: data.message,
        });
        
        setCartItems([]);
        setOrderForm({ name: '', phone: '', email: '', address: '' });
        setActiveSection('home');
      } else {
        throw new Error(data.error || 'Ошибка оформления заказа');
      }
    } catch (error: any) {
      toast({
        title: "Ошибка оформления",
        description: error.message || "Не удалось оформить заказ",
        variant: "destructive"
      });
    }
  };
  
  const sendContactRequest = async () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('https://functions.poehali.dev/65af9735-d7a0-4c40-94c8-73e079e3f264', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: contactForm.name.trim(),
          phone: contactForm.phone.trim(),
          email: contactForm.email.trim() || null,
          message: contactForm.message.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Заявка отправлена",
          description: data.message,
        });
        setContactForm({ name: '', phone: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Ошибка отправки заявки');
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить заявку",
        variant: "destructive"
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setShowMap(true);
          toast({
            title: "Геолокация определена",
            description: "Показываем карту с вашим местоположением и адресом компании",
          });
        },
        (error) => {
          toast({
            title: "Ошибка геолокации",
            description: "Не удалось определить местоположение",
            variant: "destructive"
          });
          // Показываем карту с адресом компании без геолокации
          setShowMap(true);
        }
      );
    } else {
      setShowMap(true);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Icon key={i} name={i < rating ? "Star" : "StarHalf"} size={16} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  const getRecommendedBoilers = () => {
    if (!calculatedPower) return [];
    
    const recommended = boilers.filter(boiler => {
      const boilerPower = parseInt(boiler.power);
      return Math.abs(boilerPower - calculatedPower) <= 15;
    });
    
    // Сортируем по близости к расчетной мощности
    return recommended.sort((a, b) => {
      const aDiff = Math.abs(parseInt(a.power) - calculatedPower);
      const bDiff = Math.abs(parseInt(b.power) - calculatedPower);
      return aDiff - bDiff;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Компонент карты
  const MapComponent = () => {
    if (!showMap) return null;
    
    const companyAddress = "Москва, ул. Промышленная, 15";
    const companyCoords = "55.7558,37.6176"; // Примерные координаты
    
    return (
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Карта с адресом компании</DialogTitle>
            <DialogDescription>
              Адрес: {companyAddress}
              {userLocation && (
                <div className="mt-2">Ваше местоположение: {userLocation}</div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Icon name="MapPin" size={48} className="mx-auto text-industrial-blue mb-4" />
              <h3 className="text-lg font-semibold">GASPROJECT</h3>
              <p className="text-muted-foreground">{companyAddress}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Телефон: +7 (495) 123-45-67
              </p>
              {userLocation && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium">Ваше местоположение:</p>
                  <p className="text-sm text-muted-foreground">{userLocation}</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => window.open(`https://yandex.ru/maps/?text=${encodeURIComponent(companyAddress)}`, '_blank')}
              className="bg-industrial-blue hover:bg-industrial-blue/90"
            >
              <Icon name="ExternalLink" size={16} className="mr-2" />
              Открыть в Яндекс.Картах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
                Карта
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

                    {/* Отзывы из БД */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm flex items-center gap-2">
                        Отзывы покупателей:
                        {isLoadingReviews[boiler.id] && (
                          <Icon name="Loader2" size={14} className="animate-spin" />
                        )}
                      </h5>
                      
                      {boilerReviews[boiler.id]?.slice(0, 2).map((review, index) => (
                        <div key={index} className="bg-industrial-light p-2 rounded text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      ))}
                      
                      {boilerReviews[boiler.id]?.length === 0 && (
                        <p className="text-sm text-muted-foreground">Пока нет отзывов</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-roboto font-bold text-industrial-blue">
                        {boiler.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="space-y-2">
                    <Button 
                      onClick={() => addToCart(boiler)}
                      className="w-full bg-industrial-blue hover:bg-industrial-blue/90"
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      В корзину
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Icon name="FileText" size={14} className="mr-1" />
                            Характеристики
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{boiler.name} - Характеристики</DialogTitle>
                            <DialogDescription>
                              Подробные технические характеристики котла
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">Тип:</span>
                              <span>{boiler.specs.type}</span>
                              <span className="font-medium">Размеры:</span>
                              <span>{boiler.specs.dimensions}</span>
                              <span className="font-medium">Вес:</span>
                              <span>{boiler.specs.weight}</span>
                              <span className="font-medium">Макс. давление:</span>
                              <span>{boiler.specs.maxPressure}</span>
                              <span className="font-medium">Расход газа:</span>
                              <span>{boiler.specs.gasConsumption}</span>
                              <span className="font-medium">Гарантия:</span>
                              <span>{boiler.specs.warranty}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => loadReviews(boiler.id)}
                          >
                            <Icon name="MessageSquare" size={14} className="mr-1" />
                            Отзыв
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Отзывы о {boiler.name}</DialogTitle>
                            <DialogDescription>
                              Читайте отзывы других покупателей или оставьте свой
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Tabs defaultValue="reviews" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="reviews">Все отзывы</TabsTrigger>
                              <TabsTrigger value="add">Оставить отзыв</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="reviews" className="space-y-4">
                              {isLoadingReviews[boiler.id] ? (
                                <div className="text-center py-8">
                                  <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
                                  <p>Загрузка отзывов...</p>
                                </div>
                              ) : boilerReviews[boiler.id]?.length ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  {boilerReviews[boiler.id].map((review, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <span className="font-semibold">{review.name}</span>
                                          <div className="flex items-center gap-2">
                                            <div className="flex">{renderStars(review.rating)}</div>
                                            <span className="text-sm text-muted-foreground">
                                              {formatDate(review.created_at)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-muted-foreground">{review.comment}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-50" />
                                  <p>Пока нет отзывов. Станьте первым!</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="add" className="space-y-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="reviewName">Ваше имя *</Label>
                                    <Input 
                                      id="reviewName"
                                      value={reviewForm.name}
                                      onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                      placeholder="Введите ваше имя"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="reviewEmail">Email (необязательно)</Label>
                                    <Input 
                                      id="reviewEmail"
                                      type="email"
                                      value={reviewForm.email}
                                      onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                                      placeholder="your@email.ru"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Оценка</Label>
                                  <div className="flex space-x-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                                        className="p-1"
                                      >
                                        <Icon 
                                          name="Star" 
                                          size={20} 
                                          className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="reviewText">Текст отзыва *</Label>
                                  <Textarea 
                                    id="reviewText"
                                    value={reviewForm.text}
                                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                                    placeholder="Расскажите о вашем опыте использования котла..."
                                    rows={4}
                                  />
                                </div>
                                <Button 
                                  onClick={() => addReview(boiler.id)}
                                  className="w-full bg-industrial-blue hover:bg-industrial-blue/90"
                                >
                                  Отправить отзыв
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
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
                    <Input 
                      id="area" 
                      type="number" 
                      placeholder="150"
                      value={calcInputs.area}
                      onChange={(e) => setCalcInputs({...calcInputs, area: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Высота потолков (м)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="2.7"
                      value={calcInputs.height}
                      onChange={(e) => setCalcInputs({...calcInputs, height: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Качество теплоизоляции</Label>
                  <Select value={calcInputs.insulation} onValueChange={(value) => setCalcInputs({...calcInputs, insulation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите качество теплоизоляции" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor">Плохая теплоизоляция (+50% к мощности)</SelectItem>
                      <SelectItem value="average">Средняя теплоизоляция (стандартный расчёт)</SelectItem>
                      <SelectItem value="excellent">Отличная теплоизоляция (-25% к мощности)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculatePower} className="w-full bg-industrial-blue hover:bg-industrial-blue/90">
                  <Icon name="Calculator" size={16} className="mr-2" />
                  Рассчитать мощность
                </Button>

                {calculatedPower && (
                  <>
                    <Separator />
                    <div className="bg-industrial-light p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl font-roboto font-bold text-industrial-blue mb-2">
                          {calculatedPower} кВт
                        </div>
                        <p className="text-muted-foreground">Рекомендуемая мощность котла</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Подходящие модели:</h4>
                      <div className="space-y-3">
                        {getRecommendedBoilers().length > 0 ? (
                          getRecommendedBoilers().map((boiler) => (
                            <Card key={boiler.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img src={boiler.image} alt={boiler.name} className="w-16 h-16 object-cover rounded" />
                                  <div>
                                    <span className="font-semibold">{boiler.name}</span>
                                    <div className="text-sm text-muted-foreground">
                                      Мощность: {boiler.power} | КПД: {boiler.efficiency}
                                    </div>
                                    <div className="text-lg font-bold text-industrial-blue">
                                      {boiler.price.toLocaleString()} ₽
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => addToCart(boiler)}
                                  className="bg-industrial-blue hover:bg-industrial-blue/90"
                                >
                                  В корзину
                                </Button>
                              </div>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Нет точно подходящих моделей. Рекомендуем обратиться за консультацией.</p>
                            <Button 
                              className="mt-4" 
                              onClick={() => setActiveSection('contacts')}
                              variant="outline"
                            >
                              Получить консультацию
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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
                      <Label htmlFor="contactName">Имя *</Label>
                      <Input 
                        id="contactName" 
                        placeholder="Ваше имя"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Телефон *</Label>
                      <Input 
                        id="contactPhone" 
                        placeholder="+7 (___) ___-__-__"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input 
                      id="contactEmail" 
                      type="email" 
                      placeholder="your@email.ru"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactMessage">Сообщение *</Label>
                    <Textarea 
                      id="contactMessage" 
                      placeholder="Расскажите о ваших потребностях..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-industrial-blue hover:bg-industrial-blue/90"
                    onClick={sendContactRequest}
                  >
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
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-industrial-blue hover:bg-industrial-blue/90">
                        <Icon name="CreditCard" size={16} className="mr-2" />
                        Оформить заказ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Оформление заказа</DialogTitle>
                        <DialogDescription>
                          Заполните контактную информацию для оформления заказа
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="orderName">Имя *</Label>
                            <Input 
                              id="orderName"
                              value={orderForm.name}
                              onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                              placeholder="Ваше имя"
                            />
                          </div>
                          <div>
                            <Label htmlFor="orderPhone">Телефон *</Label>
                            <Input 
                              id="orderPhone"
                              value={orderForm.phone}
                              onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                              placeholder="+7 (___) ___-__-__"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="orderEmail">Email</Label>
                          <Input 
                            id="orderEmail"
                            type="email"
                            value={orderForm.email}
                            onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                            placeholder="your@email.ru"
                          />
                        </div>
                        <div>
                          <Label htmlFor="orderAddress">Адрес доставки</Label>
                          <Textarea 
                            id="orderAddress"
                            value={orderForm.address}
                            onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                            placeholder="Укажите адрес для доставки котла"
                          />
                        </div>
                        
                        <div className="bg-industrial-light p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Ваш заказ:</h4>
                          {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span>{item.price.toLocaleString()} ₽</span>
                            </div>
                          ))}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Итого:</span>
                            <span>{cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={processOrder} className="w-full">
                          Подтвердить заказ
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

      {/* Map Component */}
      <MapComponent />
    </div>
  );
};

export default Index;
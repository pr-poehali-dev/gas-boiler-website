import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

const Admin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = () => {
    if (adminToken === 'gasproject_admin_2024') {
      setIsAuthenticated(true);
      loadData();
      toast({
        title: "Авторизация успешна",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Ошибка авторизации",
        description: "Неверный токен доступа",
        variant: "destructive"
      });
    }
  };

  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const headers = { 'X-Admin-Token': adminToken };
      
      // Загрузка заказов
      const ordersResponse = await fetch('https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/orders', { headers });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }
      
      // Загрузка отзывов
      const reviewsResponse = await fetch('https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/reviews', { headers });
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }
      
      // Загрузка контактных заявок
      const contactsResponse = await fetch('https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/contacts', { headers });
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.contacts || []);
      }
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast({
          title: "Статус обновлён",
          description: `Заказ #${orderId} получил статус: ${newStatus}`,
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заказа",
        variant: "destructive"
      });
    }
  };

  const toggleReviewApproval = async (reviewId: number, isApproved: boolean) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/reviews/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        },
        body: JSON.stringify({ 
          review_id: reviewId, 
          is_approved: isApproved 
        })
      });
      
      if (response.ok) {
        toast({
          title: "Отзыв обновлён",
          description: `Отзыв ${isApproved ? 'одобрен' : 'скрыт'}`,
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус отзыва",
        variant: "destructive"
      });
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/a74a38bb-83a0-4ed6-9677-02f8514f23eb/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Token': adminToken
        }
      });
      
      if (response.ok) {
        toast({
          title: "Отзыв удалён",
          description: "Отзыв успешно удалён из системы",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить отзыв",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Icon key={i} name={i < rating ? "Star" : "StarHalf"} size={16} className="fill-yellow-400 text-yellow-400" />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-industrial-light via-white to-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="Shield" size={48} className="text-industrial-blue" />
            </div>
            <CardTitle className="text-2xl font-roboto">Админ-панель GASPROJECT</CardTitle>
            <CardDescription>Введите токен доступа для входа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="token">Токен доступа</Label>
              <Input 
                id="token"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Введите токен"
                onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              />
            </div>
            <Button onClick={authenticate} className="w-full bg-industrial-blue hover:bg-industrial-blue/90">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-light via-white to-slate-50">
      <header className="bg-white border-b border-industrial-gray/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={32} className="text-industrial-blue" />
              <h1 className="text-2xl font-roboto font-bold text-industrial-dark">GASPROJECT Админ</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadData} variant="outline" size="sm" disabled={isLoading}>
                <Icon name={isLoading ? "Loader2" : "RefreshCw"} size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline" size="sm">
                <Icon name="Home" size={16} className="mr-2" />
                На сайт
              </Button>
              <Button onClick={() => setIsAuthenticated(false)} variant="outline" size="sm">
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего заказов</p>
                  <p className="text-3xl font-bold text-industrial-blue">{orders.length}</p>
                </div>
                <Icon name="ShoppingCart" size={32} className="text-industrial-blue/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Новых заказов</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {orders.filter(order => order.status === 'new').length}
                  </p>
                </div>
                <Icon name="Clock" size={32} className="text-blue-600/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Отзывов</p>
                  <p className="text-3xl font-bold text-green-600">{reviews.length}</p>
                </div>
                <Icon name="MessageSquare" size={32} className="text-green-600/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Заявок</p>
                  <p className="text-3xl font-bold text-purple-600">{contacts.length}</p>
                </div>
                <Icon name="Phone" size={32} className="text-purple-600/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Заказы ({orders.length})</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы ({reviews.length})</TabsTrigger>
            <TabsTrigger value="contacts">Контакты ({contacts.length})</TabsTrigger>
          </TabsList>

          {/* Заказы */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Управление заказами</CardTitle>
                <CardDescription>Просматривайте и изменяйте статус заказов</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p>Заказов пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold">Заказ #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                            <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div>
                            <p><strong>Клиент:</strong> {order.name}</p>
                            <p><strong>Телефон:</strong> {order.phone}</p>
                            {order.email && <p><strong>Email:</strong> {order.email}</p>}
                            {order.address && <p><strong>Адрес:</strong> {order.address}</p>}
                            <p><strong>Сумма:</strong> {order.total_amount?.toLocaleString()} ₽</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p><strong>Товары:</strong></p>
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                {item.name} - {item.price?.toLocaleString()} ₽
                              </div>
                            ))}
                            
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Новый</SelectItem>
                                <SelectItem value="processing">В обработке</SelectItem>
                                <SelectItem value="completed">Выполнен</SelectItem>
                                <SelectItem value="cancelled">Отменён</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Отзывы */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Управление отзывами</CardTitle>
                <CardDescription>Модерируйте отзывы клиентов</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p>Отзывов пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className={`p-4 ${!review.is_approved ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            {review.email && <p className="text-sm text-muted-foreground">{review.email}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <Badge variant={review.is_approved ? "default" : "secondary"}>
                                {review.is_approved ? "Опубликован" : "На модерации"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                          
                          <div>
                            <p><strong>Котёл ID:</strong> {review.boiler_id}</p>
                            <p className="mt-2"><strong>Отзыв:</strong></p>
                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                              {review.comment}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              onClick={() => toggleReviewApproval(review.id, !review.is_approved)}
                              variant={review.is_approved ? "outline" : "default"}
                              size="sm"
                              className="w-full"
                            >
                              <Icon name={review.is_approved ? "EyeOff" : "Eye"} size={16} className="mr-2" />
                              {review.is_approved ? "Скрыть" : "Одобрить"}
                            </Button>
                            
                            <Button
                              onClick={() => deleteReview(review.id)}
                              variant="destructive"
                              size="sm"
                              className="w-full"
                            >
                              <Icon name="Trash2" size={16} className="mr-2" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Контактные заявки */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Контактные заявки</CardTitle>
                <CardDescription>Заявки на консультацию и обратную связь</CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Phone" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p>Контактных заявок пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <Card key={contact.id} className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <p><strong>Телефон:</strong> <a href={`tel:${contact.phone}`} className="text-industrial-blue hover:underline">{contact.phone}</a></p>
                            {contact.email && (
                              <p><strong>Email:</strong> <a href={`mailto:${contact.email}`} className="text-industrial-blue hover:underline">{contact.email}</a></p>
                            )}
                            <p className="text-sm text-muted-foreground mt-2">
                              {formatDate(contact.created_at)}
                            </p>
                          </div>
                          
                          <div>
                            <p><strong>Сообщение:</strong></p>
                            <p className="text-sm bg-gray-50 p-3 rounded mt-1">
                              {contact.message}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
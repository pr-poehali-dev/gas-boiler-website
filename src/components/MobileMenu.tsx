import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartItemsCount: number;
  onLocationClick: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  setActiveSection, 
  cartItemsCount, 
  onLocationClick 
}: MobileMenuProps) => {
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Icon name="Flame" size={24} className="text-industrial-blue" />
              <h2 className="text-xl font-roboto font-bold">GASPROJECT</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          <nav className="space-y-2">
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
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-industrial-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon name={item.icon as any} size={20} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'cart' && cartItemsCount > 0 && (
                  <Badge variant="secondary" className="bg-red-500 text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t">
            <Button 
              onClick={() => { onLocationClick(); onClose(); }}
              variant="outline" 
              className="w-full"
            >
              <Icon name="MapPin" size={16} className="mr-2" />
              Показать на карте
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/admin'}
              variant="ghost" 
              className="w-full mt-2"
              size="sm"
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Админ-панель
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
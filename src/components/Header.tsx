import { Search, ShoppingCart, User, Settings, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/Cart";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearchChange: (value: string) => void;
  searchQuery: string;
}

const Header = ({ onSearchChange, searchQuery }: HeaderProps) => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate("/")}
            >
              FreshMart
            </h1>
            <nav className="hidden md:flex gap-6">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Trang chủ
              </a>
              <a href="/#products" className="text-sm font-medium hover:text-primary transition-colors">
                Sản phẩm
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Về chúng tôi
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User className="mr-2 h-4 w-4" />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/about")}>
                  <Info className="mr-2 h-4 w-4" />
                  Thông tin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Cart>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground flex items-center justify-center animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Cart>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

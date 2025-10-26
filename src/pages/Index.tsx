import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { products } from "@/data/products";
import { Leaf, Truck, Shield, HeartHandshake, SlidersHorizontal, Star } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [minRating, setMinRating] = useState(0);

  const categories = ["Tất cả", ...Array.from(new Set(products.map((p) => p.category)))];
  const maxPrice = Math.max(...products.map(p => p.price));

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tất cả" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedCategory, priceRange, minRating]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Thực Phẩm Tươi Ngon
              <br />
              Giao Tận Nơi
            </h1>
            <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-1000">
              100% sản phẩm hữu cơ, tươi sống từ trang trại đến bàn ăn của bạn
            </p>
            <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-medium"
              >
                Mua Ngay
              </Button>
              <Button size="lg" variant="outline">
                Tìm Hiểu Thêm
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Leaf, title: "100% Hữu Cơ", desc: "Không hóa chất" },
              { icon: Truck, title: "Giao Nhanh", desc: "Trong 2h" },
              { icon: Shield, title: "An Toàn", desc: "Đảm bảo chất lượng" },
              { icon: HeartHandshake, title: "Hỗ Trợ 24/7", desc: "Luôn sẵn sàng" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Bộ lọc</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-3 block">Danh mục</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full justify-start"
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-3 block">
                  Khoảng giá: {priceRange[0].toLocaleString("vi-VN")}₫ - {priceRange[1].toLocaleString("vi-VN")}₫
                </Label>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0₫</span>
                  <span>{maxPrice.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Đánh giá tối thiểu</Label>
                <div className="space-y-2">
                  {[0, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      onClick={() => setMinRating(rating)}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <div className="flex items-center gap-2">
                        {rating === 0 ? (
                          "Tất cả"
                        ) : (
                          <>
                            {rating}
                            <Star className="h-3 w-3 fill-secondary text-secondary" />
                            trở lên
                          </>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => {
                  setSelectedCategory("Tất cả");
                  setPriceRange([0, maxPrice]);
                  setMinRating(0);
                }}
              >
                Xóa bộ lọc
              </Button>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Hiển thị <span className="font-semibold text-foreground">{filteredProducts.length}</span> sản phẩm
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ChatBot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 FreshMart. Thực phẩm tươi ngon, an toàn cho gia đình bạn.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Truck, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-lg px-4 py-2">
                  -{discount}%
                </Badge>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-6 py-3">
                    Hết hàng
                  </Badge>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Giao hàng nhanh</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Đảm bảo chất lượng</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Đổi trả 7 ngày</p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < product.rating ? "fill-secondary text-secondary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} sao ({(() => {
                    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
                    return reviews[product.id]?.length || 0;
                  })()} đánh giá)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-lg text-muted-foreground">/{product.unit}</span>
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}₫
                  </span>
                  <Badge variant="secondary">Tiết kiệm {discount}%</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sản phẩm {product.name.toLowerCase()} tươi ngon, được chọn lọc kỹ càng từ các trang trại uy tín. 
                Đảm bảo chất lượng, an toàn vệ sinh thực phẩm. Giàu dinh dưỡng, tốt cho sức khỏe. 
                Giao hàng nhanh trong 2 giờ, giữ nguyên độ tươi.
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Số lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!product.inStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Tổng: <span className="font-bold text-primary text-lg">
                      {(product.price * quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-lg h-14"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14"
                  disabled={!product.inStock}
                >
                  Mua ngay
                </Button>
              </div>

              {!product.inStock && (
                <p className="text-center text-destructive text-sm">
                  Sản phẩm tạm thời hết hàng
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
          <div className="space-y-4">
            {(() => {
              const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
              const productReviews = reviews[product.id] || [];
              
              if (productReviews.length === 0) {
                return (
                  <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    Chưa có đánh giá nào cho sản phẩm này
                  </div>
                );
              }

              return productReviews.map((review: any, index: number) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium line-clamp-2 mb-2">{p.name}</h4>
                  <p className="text-primary font-bold">{p.price.toLocaleString("vi-VN")}₫</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default ProductDetail;

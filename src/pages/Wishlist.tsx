import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchChange={() => {}} searchQuery="" />
      
      <main className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              Sản phẩm yêu thích
            </h1>
            <p className="text-muted-foreground mt-2">
              {wishlist.length} sản phẩm
            </p>
          </div>

          {wishlist.length > 0 && (
            <Button variant="destructive" onClick={clearWishlist}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa tất cả
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">Chưa có sản phẩm yêu thích</h3>
              <p className="text-muted-foreground mb-6">
                Thêm sản phẩm vào danh sách để mua sau
              </p>
              <Button onClick={() => navigate("/")}>
                Khám phá sản phẩm
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <Card key={product.id} className="group relative overflow-hidden">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div
                  className="aspect-square cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3
                      className="font-semibold line-clamp-2 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {product.price.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{product.unit}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;

import { useNavigate } from "react-router-dom";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GitCompare, Star, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

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
              <GitCompare className="h-8 w-8 text-primary" />
              So sánh sản phẩm
            </h1>
            <p className="text-muted-foreground mt-2">
              {compareList.length}/4 sản phẩm
            </p>
          </div>

          {compareList.length > 0 && (
            <Button variant="destructive" onClick={clearCompare}>
              Xóa tất cả
            </Button>
          )}
        </div>

        {compareList.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">Chưa có sản phẩm để so sánh</h3>
              <p className="text-muted-foreground mb-6">
                Thêm sản phẩm vào danh sách so sánh (tối đa 4 sản phẩm)
              </p>
              <Button onClick={() => navigate("/")}>
                Khám phá sản phẩm
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Thông tin</TableHead>
                      {compareList.map((product) => (
                        <TableHead key={product.id} className="text-center min-w-[200px]">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="float-right"
                            onClick={() => removeFromCompare(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Hình ảnh</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full aspect-square object-cover rounded-lg cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Tên sản phẩm</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <div
                            className="font-semibold cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.name}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Danh mục</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Giá</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {product.price.toLocaleString("vi-VN")}₫
                            </div>
                            <div className="text-sm text-muted-foreground">
                              /{product.unit}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                {product.originalPrice.toLocaleString("vi-VN")}₫
                              </div>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Giảm giá</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          {product.originalPrice ? (
                            <Badge variant="secondary">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Đánh giá</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < product.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1 font-medium">{product.rating}</span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Trạng thái</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Thao tác</TableCell>
                      {compareList.map((product) => (
                        <TableCell key={product.id}>
                          <div className="space-y-2">
                            <Button
                              className="w-full"
                              onClick={() => addToCart(product, 1)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Thêm vào giỏ
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Compare;

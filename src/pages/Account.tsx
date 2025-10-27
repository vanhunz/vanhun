import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders, OrderStatus } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Package, XCircle, RotateCcw, Truck, ArrowLeft, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Account = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addReview, userBalance } = useOrders();
  const [reviewDialog, setReviewDialog] = useState<{ orderId: string; productId: number } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Chờ xử lý", variant: "secondary" },
      shipping: { label: "Đang vận chuyển", variant: "default" },
      delivered: { label: "Đã giao", variant: "outline" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
      returned: { label: "Đã hoàn trả", variant: "destructive" },
    };
    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>;
  };

  const filterOrders = (status?: OrderStatus | OrderStatus[]) => {
    if (!status) return orders;
    const statuses = Array.isArray(status) ? status : [status];
    return orders.filter(order => statuses.includes(order.status));
  };

  const handleReview = () => {
    if (!reviewDialog) return;
    addReview(reviewDialog.orderId, reviewDialog.productId, rating, comment);
    toast({
      title: "Đánh giá đã được gửi!",
      description: "Cảm ơn bạn đã đánh giá sản phẩm",
    });
    setReviewDialog(null);
    setRating(5);
    setComment("");
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Đơn hàng #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${item.id}`)}>
                  {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                </p>
                {order.status === "delivered" && !item.reviewed && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setReviewDialog({ orderId: order.id, productId: item.id })}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Đánh giá
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">{item.name}</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-6 w-6 cursor-pointer ${
                                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                                onClick={() => setRating(star)}
                              />
                            ))}
                          </div>
                        </div>
                        <Textarea
                          placeholder="Nhận xét của bạn về sản phẩm..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={handleReview} className="w-full">
                          Gửi đánh giá
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {item.reviewed && (
                  <Badge variant="outline" className="mt-2">
                    Đã đánh giá
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Địa chỉ:</span>
            <span className="text-right">{order.address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Vận chuyển:</span>
            <span>{order.shippingMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Thanh toán:</span>
            <span>{order.paymentMethod}</span>
          </div>
          {order.discount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá:</span>
              <span>-{order.discount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary">{order.total.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>

        {order.status === "pending" && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => updateOrderStatus(order.id, "cancelled")}
            >
              Hủy đơn
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">Số dư:</span>
                <span className="text-primary font-bold">
                  {userBalance.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              Tất cả ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="shipping">
              <Truck className="mr-2 h-4 w-4" />
              Đang vận chuyển ({filterOrders(["pending", "shipping"]).length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              <Package className="mr-2 h-4 w-4" />
              Đã mua ({filterOrders("delivered").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              <XCircle className="mr-2 h-4 w-4" />
              Đã hủy ({filterOrders("cancelled").length})
            </TabsTrigger>
            <TabsTrigger value="returned">
              <RotateCcw className="mr-2 h-4 w-4" />
              Hoàn trả ({filterOrders("returned").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Bạn chưa có đơn hàng nào
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {filterOrders(["pending", "shipping"]).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {filterOrders("delivered").map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterOrders("cancelled").map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="returned" className="space-y-4">
            {filterOrders("returned").map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Account;

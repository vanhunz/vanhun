import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Search, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import Header from "@/components/Header";

const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orders } = useOrders();
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  
  const order = orders.find(o => o.id === searchOrderId);

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: "pending", label: "Đã đặt hàng", icon: Package },
      { key: "shipping", label: "Đang vận chuyển", icon: MapPin },
      { key: "delivered", label: "Đã giao hàng", icon: CheckCircle2 },
    ];

    const statusOrder = ["pending", "shipping", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchChange={() => {}} searchQuery="" />
      
      <main className="container py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/account")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <h1 className="text-3xl font-bold mb-8">Theo dõi đơn hàng</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã đơn hàng..."
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {order ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Đơn hàng #{order.id}</CardTitle>
                  <Badge>
                    {order.status === "pending" && "Chờ xử lý"}
                    {order.status === "shipping" && "Đang vận chuyển"}
                    {order.status === "delivered" && "Đã giao"}
                    {order.status === "cancelled" && "Đã hủy"}
                    {order.status === "returned" && "Đã hoàn trả"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleString("vi-VN")}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline */}
                {(order.status === "pending" || order.status === "shipping" || order.status === "delivered") && (
                  <div className="relative">
                    <div className="flex justify-between mb-12">
                      {getStatusSteps(order.status).map((step, index) => (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                              step.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <step.icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-center">
                            {step.label}
                          </span>
                          {index < getStatusSteps(order.status).length - 1 && (
                            <div
                              className={`absolute top-6 left-1/2 w-full h-0.5 ${
                                step.completed ? "bg-primary" : "bg-muted"
                              }`}
                              style={{ left: "calc(50% + 24px)" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Địa chỉ giao hàng</div>
                      <div className="text-muted-foreground">{order.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Phương thức vận chuyển</div>
                      <div className="text-muted-foreground">{order.shippingMethod}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Thời gian giao hàng dự kiến</div>
                      <div className="text-muted-foreground">
                        {order.status === "pending" && "2-5 ngày làm việc"}
                        {order.status === "shipping" && "1-2 ngày"}
                        {order.status === "delivered" && "Đã giao hàng"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-semibold mb-4">Sản phẩm</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {order.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : searchOrderId ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-muted-foreground">
                Vui lòng kiểm tra lại mã đơn hàng
              </p>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
};

export default OrderTracking;

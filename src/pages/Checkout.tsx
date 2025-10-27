import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Truck, Tag, Wallet, CreditCard, QrCode } from "lucide-react";
import Header from "@/components/Header";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder, userBalance, updateBalance } = useOrders();
  
  const [address, setAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("balance");

  const shippingCost = shippingMethod === "express" ? 50000 : 30000;
  const discount = discountApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice + shippingCost - discount;

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "HUANDZ") {
      setDiscountApplied(true);
      toast({
        title: "Mã giảm giá đã được áp dụng!",
        description: "Giảm 10% tổng giá trị đơn hàng",
      });
    } else {
      toast({
        title: "Mã giảm giá không hợp lệ",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (!address.trim()) {
      toast({
        title: "Vui lòng nhập địa chỉ giao hàng",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "balance" && userBalance < finalTotal) {
      toast({
        title: "Số dư không đủ",
        description: `Bạn cần thêm ${(finalTotal - userBalance).toLocaleString("vi-VN")}₫`,
        variant: "destructive",
      });
      return;
    }

    // Process payment
    if (paymentMethod === "balance") {
      updateBalance(-finalTotal);
    }

    // Create order
    addOrder({
      items,
      total: finalTotal,
      status: "pending",
      address,
      shippingMethod: shippingMethod === "express" ? "Giao hàng nhanh" : "Giao hàng tiêu chuẩn",
      paymentMethod: paymentMethod === "balance" ? "Tài khoản" : "Chuyển khoản QR",
      discount: discountApplied ? discount : undefined,
    });

    clearCart();
    toast({
      title: "Đặt hàng thành công!",
      description: "Cảm ơn bạn đã mua hàng tại FreshMart",
    });
    navigate("/account");
  };

  if (items.length === 0) {
    navigate("/");
    return null;
  }

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

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Nhập địa chỉ đầy đủ của bạn"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Phương thức vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">Giao hàng tiêu chuẩn</div>
                      <div className="text-sm text-muted-foreground">3-5 ngày - 30.000₫</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="font-medium">Giao hàng nhanh</div>
                      <div className="text-sm text-muted-foreground">1-2 ngày - 50.000₫</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Discount */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Mã giảm giá
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={discountApplied}
                  />
                  <Button
                    onClick={applyDiscount}
                    disabled={discountApplied}
                  >
                    {discountApplied ? "Đã áp dụng" : "Áp dụng"}
                  </Button>
                </div>
                {discountApplied && (
                  <p className="text-sm text-green-600 mt-2">
                    Mã "HuanDz" đã được áp dụng - Giảm 10%
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="balance" id="balance" />
                    <Label htmlFor="balance" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Tài khoản FreshMart</div>
                          <div className="text-sm text-muted-foreground">
                            Số dư: {userBalance.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        <div className="font-medium">Chuyển khoản QR</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span>{shippingCost.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá (10%)</span>
                      <span>-{discount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{finalTotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Đặt hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

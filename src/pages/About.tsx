import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  const navigate = useNavigate();

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

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreshMart
            </h1>
            <p className="text-xl text-muted-foreground">
              Cửa hàng thực phẩm tươi sống chất lượng cao
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Về chúng tôi</h2>
                <p className="text-muted-foreground leading-relaxed">
                  FreshMart là cửa hàng chuyên cung cấp thực phẩm tươi sống, 
                  rau củ quả sạch và các sản phẩm organic chất lượng cao. 
                  Chúng tôi cam kết mang đến cho khách hàng những sản phẩm 
                  tốt nhất với giá cả hợp lý và dịch vụ giao hàng nhanh chóng.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Liên hệ</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>123 Đường ABC, Quận 1, TP.HCM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>1900 1234</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>support@freshmart.vn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Mở cửa: 7:00 - 22:00 hàng ngày</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Cam kết của chúng tôi</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Sản phẩm tươi mới 100%</li>
                  <li>✓ Nguồn gốc xuất xứ rõ ràng</li>
                  <li>✓ Giá cả cạnh tranh</li>
                  <li>✓ Giao hàng nhanh chóng</li>
                  <li>✓ Hỗ trợ khách hàng 24/7</li>
                  <li>✓ Hoàn tiền 100% nếu không hài lòng</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Chính sách</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>• <strong>Chính sách đổi trả:</strong> Đổi trả miễn phí trong 7 ngày</p>
                  <p>• <strong>Chính sách bảo mật:</strong> Thông tin khách hàng được bảo mật tuyệt đối</p>
                  <p>• <strong>Chính sách vận chuyển:</strong> Miễn phí ship cho đơn hàng trên 200.000₫</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;

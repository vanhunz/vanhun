import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "./CartContext";

export type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled" | "returned";

export interface OrderItem extends CartItem {
  reviewed?: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  shippingMethod: string;
  paymentMethod: string;
  discount?: number;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addReview: (orderId: string, productId: number, rating: number, comment: string) => void;
  userBalance: number;
  updateBalance: (amount: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [userBalance, setUserBalance] = useState<number>(() => {
    const saved = localStorage.getItem("userBalance");
    return saved ? parseFloat(saved) : 5000000; // 5 triệu VND
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("userBalance", userBalance.toString());
  }, [userBalance]);

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addReview = (orderId: string, productId: number, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === productId ? { ...item, reviewed: true } : item
              ),
            }
          : order
      )
    );

    // Save review to localStorage
    const reviews = JSON.parse(localStorage.getItem("reviews") || "{}");
    if (!reviews[productId]) reviews[productId] = [];
    reviews[productId].push({
      rating,
      comment,
      date: new Date().toISOString(),
      userName: "Khách hàng",
    });
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  const updateBalance = (amount: number) => {
    setUserBalance((prev) => prev + amount);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        addReview,
        userBalance,
        updateBalance,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};

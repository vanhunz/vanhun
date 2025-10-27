import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/components/ProductCard";
import { toast } from "@/hooks/use-toast";

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    const saved = localStorage.getItem("compare");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    setCompareList((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        toast({
          title: "Sản phẩm đã có trong danh sách so sánh",
          variant: "destructive",
        });
        return prev;
      }
      
      if (prev.length >= 4) {
        toast({
          title: "Chỉ có thể so sánh tối đa 4 sản phẩm",
          variant: "destructive",
        });
        return prev;
      }
      
      toast({
        title: "Đã thêm vào so sánh",
        description: product.name,
      });
      
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => prev.filter((item) => item.id !== productId));
    toast({
      title: "Đã xóa khỏi danh sách so sánh",
    });
  };

  const isInCompare = (productId: number) => {
    return compareList.some((item) => item.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
    toast({
      title: "Đã xóa toàn bộ danh sách so sánh",
    });
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
};

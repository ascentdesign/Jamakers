import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Currency = "USD" | "JMD";

export function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem("jammakers-currency");
    return (stored === "USD" || stored === "JMD") ? stored : "USD";
  });

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("jammakers-currency", newCurrency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-testid="button-currency-selector"
          className="gap-2 hover-elevate active-elevate-2"
        >
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleCurrencyChange("USD")}
          data-testid="menu-item-usd"
          className="hover-elevate cursor-pointer"
        >
          <span className="font-medium">USD</span>
          <span className="ml-2 text-muted-foreground">US Dollar</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleCurrencyChange("JMD")}
          data-testid="menu-item-jmd"
          className="hover-elevate cursor-pointer"
        >
          <span className="font-medium">JMD</span>
          <span className="ml-2 text-muted-foreground">Jamaican Dollar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem("jammakers-currency");
    return (stored === "USD" || stored === "JMD") ? stored : "USD";
  });

  return { currency, setCurrency };
}

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

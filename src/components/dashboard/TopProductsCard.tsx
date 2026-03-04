import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { TopProducts } from "@/hook/useDashboardMetrics";

const CATEGORY_COLORS: Record<string, string> = {
  Calçados: "bg-blue-100 text-blue-700",
  Roupas: "bg-purple-100 text-purple-700",
  Acessórios: "bg-amber-100 text-amber-700",
  Eletrônicos: "bg-emerald-100 text-emerald-700",
  Móveis: "bg-rose-100 text-rose-700",
  Esportes: "bg-orange-100 text-orange-700",
};

const currency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );

interface TopProductsCardProps {
  data: TopProducts[];
  isLoading: boolean;
}
export function TopProductsCard({ data, isLoading }: TopProductsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  //Receita máxima para calcular a barra de progresso proporcional
  const maxRevenue = data[0]?.revenue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Produtos</CardTitle>
        <CardDescription>Por receita gerada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((product, index) => (
          <div key={product.name} className="space-y-1 5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {/* Ranking */}
                <span className="text-sm font-bold text-gray-400 w-4 shrink-0">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-xs shrink-0 ${CATEGORY_COLORS[product.category] ?? ""}`}
                >
                  {product.category}
                </Badge>
              </div>
              <span className="text-sm font-bold text-gray-900 shrink-0 ml-2">
                {currency(product.revenue)}
              </span>
            </div>

            {/*Barra de progresso proporcional à receita*/}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {product.total_sold} unidades vendidas
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
    title: string
    value: string
    subtitle?: string
    icon: LucideIcon
    trend?: number //Variação percentual, ex: 0.05 para +5%, -0.03 para -3%
    isLoading?: boolean
    iconColor?: string //Cor personalizada para o ícone, ex: "text-green-500"
    iconBg?: string //Cor de fundo personalizada para o ícone, ex: "bg-green-100"
}

export function KpiCard ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    isLoading,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-150",
}: KpiCardProps) {
    //Estado de loading - mostra skeleton enquanto os dados carregam
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-xl" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-400">{subtitle}</p>
                        )}
                        {trend !== undefined && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                trend >= 0 ? "text-emerald-600" : "text-red-500"
                        )}>
                        <TrendingUp className={cn(
                            "h-3 w-3",
                            trend >= 0 && "rotate-180"
                        )} />
                        {trend >= 0 ? "+" : ""}{(trend * 100).toFixed(1)}% mês anterior
                    </div>
                        )}
                    </div>

                    {/*Ícone com fundo colorido */}
                    <div className={cn(
                        "p-3 rounded-xl",
                        iconBg,
                    )}>
                        <Icon className={cn(
                            "h-6 w-6",
                            iconColor
                        )} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
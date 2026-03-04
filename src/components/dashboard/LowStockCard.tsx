import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface LowStockProps {
    data: { name: string; stock: number}[]
    isLoading?: boolean
}

export function LowStockCard({ data, isLoading }: LowStockProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-5 w-36"/></CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 3}).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={data.length > 0 ? 'border-amber-200' : ''}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${data,length > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                        Estoque baixo
                        {data.length > 0 && (
                            <span className="ml-auto text-xs font-normal bg-amber-100 text-amber-700 px-2 pt-0.5 rounded-full">
                                {data.length} produto{data.length > 1 ? 's' : ''}
                            </span>
                        )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                        ✅ Todos os produtos com estoque saudável
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.map((product) => (
                            <div
                                key={product.name}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50"
                            >
                                <span className="text-sm font-medium text-gray-800 truncate mr-3">
                                    {product.name}
                                </span>
                                <span className={`text-sm font-bold shrink-0 ${product.stock <= 5 ? 'text-red-600' : 'text-red-600'}`}>
                                    {product.stock} un.
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
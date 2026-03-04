import { Badge } from "../ui/badge";
import { OrderStatus } from "@/types/database";

const STATUS_CONFIG: Record<OrderStatus, {label: string; className: string}> = {
    pending:    { label: 'Pendente',    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
    processing: { label: 'Processando', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
    shipped:    { label: 'Enviado',     className: 'bg-purple-100 text-purple-700 hover:bg-purple-100' },
    delivered:  { label: 'Entregue',    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
    canceled:  { label: 'Cancelado',   className: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

//Fallback para status desconhecido
const FALLBACK = { label: 'Desconhecido', className: 'bg-gray-100 text-gray-600'}

export function StatusBadge({ status }: {status: string}) {
    const config = STATUS_CONFIG[status as OrderStatus] ?? FALLBACK
    return (
        <Badge variant="secondary" className={config.className}>
            {config.label}
        </Badge>
    )
}
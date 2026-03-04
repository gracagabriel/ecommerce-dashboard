import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

//Definição dos itens de navegação
//Centralizar aqui facilita adicionar/remover itens no futuro
const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Pedidos",
        href: "/orders",
        icon: ShoppingCart,
    },
    {
        label: "Produtos",
        href: "/products",
        icon: Package,
    },
    {
        label: "Clientes",
        href: "/customers",
        icon: Users,
    },
]

interface SidebarProps {
    onNavigate?: () => void
    //Callback opcional - chamado ao clicar num link (fecha o Sheet no mobile)
}

export function Sidebar({ onNavigate }: SidebarProps) {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/*Logo ou título da aplicação */}
            <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900 text-lg">E-commerce Dashboard</span>
            </div>

            {/*Navegação principal*/}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            cn(
                                //Classe base - aplicada a todos os links
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                //Classes para link ativo
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                            )
                        }
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/*Rodapé da sidebar - pode conter links adicionais ou informações */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">ShopMetrics V1.0.0</p>
            </div>
        </aside>
    )
}
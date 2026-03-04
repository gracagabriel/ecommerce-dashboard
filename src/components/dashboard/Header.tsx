import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";

export function Header() {
    return (

        //flex-1 para empurrar o perfil para a direita mesmo com o botão hamburguer à esqeurda
        <div className="flex items-center justify-between flex-1 ml-2 md:ml-0">
            <div className="hidden md:block">
                <p className="text-sm text-gray-500">Bem-vindo de volta 👋</p>
                <h1 className="text-lg font-semibold text-gray-900">Painel de Controle - Dashboard</h1>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/*Botão de notificação */}
                <Button variant="ghost" className="relative">
                    <Bell className="h-5 w-5 text-gray-500" />
                    {/*Indicador de nova notificação */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                {/*Menu dropdown do perfil */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 h-10 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                                    AD
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">Administrador</p>
                                <p className="text-xs text-gray-500">admin@ecommerce.com</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
                    
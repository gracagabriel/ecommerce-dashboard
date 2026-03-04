import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Button } from '../ui/button'
import { Sheet, SheetContent } from '../ui/sheet'

export function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-50">
            {/*Sidebar desktop - visível apenas em telas md+ */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/*Sidebar mobile - Sheet (gaveta) controlado por estado */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side='left' className='p-0 w-64'>
                    {/*Passamos onNavigate para a Sidebar fechar o Sheet
            quando o usuário clicar em um item de menu no mobile */}
            <Sidebar onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
            </Sheet>

            {/*Área direita */}
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                {/*Header com botão hamburguer no mobile */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
                     {/* Botão hamburguer — só aparece no mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className='md:hidden'
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className='h-5 w-5' />
                    </Button>

                    <Header />
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
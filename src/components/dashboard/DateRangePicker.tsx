import { useState } from "react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

//Atalhos de períodos pré-definidos
const PRESETS = [
    {
        label: "Últimos 7 dias",
        getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    },
    {
        label: "Últimos 30 dias",
        getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    },
    {
        label: "Este mês",
        getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
    },
    {
        label: "Últimos 3 meses",
        getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
    },
    {
        label: "Últimos 6 meses",
        getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
    },
]

interface DateRangePickerProps {
    value: DateRange | undefined
    onChange: (range: DateRange | undefined) => void
    className?: string
}

export function DateRangePicker({ value, onChange, className}: DateRangePickerProps) {
    const [open, setOpen] = useState(false)

    //Formata o label do botão conforme o range selecionado
    function formatLabel() {
        if (!value?.from) return 'Selecionar Período'
        if (!value.to) return format(value.from, 'dd MM yyyy', { locale: ptBR })
            return `${format(value.from, 'dd MM yyyy', { locale: ptBR })} - ${format(value.to, 'dd MM yyyy', { locale: ptBR })}`
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('justify-between font-normal min-w-56', className)}
                >
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className={cn(!value?.from && 'text-gray-400')}>
                            {formatLabel()}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                    {/*Atalhos laterais */}
                    <div className="border-r p-3 space-y-1 min-w-36">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">
                            Atalhos
                        </p>
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => {
                                    onChange(preset.getValue())
                                    setOpen(false)
                                }}
                                className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gay-100 text-gray-700 transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                        {value && (
                            <>
                                <div className="border-t my-1" />
                                <button
                                    onClick={() => { onChange(undefined); setOpen(false) }}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 text-red-500 transition-colors"
                                >
                                    Limpar filtro
                                </button>
                            </>
                        )}
                    </div>

                    {/*Calendário */}
                    <Calendar 
                        mode="range"
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={2}
                        locale={ptBR}
                        disabled={{ after: new Date() }}
                        //Impede adicionar datas futuras
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
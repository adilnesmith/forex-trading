export interface Symbol {
    symbol: string;
    display_name: string;
    subgroup: string;
    symbol_type: string;
    quote?: number;
    change?: number;
}

export interface ActiveSymbolsResponse {
    active_symbols: Symbol[];
}

export interface TickResponse {
    tick: {
        symbol: string;
        quote: number;
    };
}
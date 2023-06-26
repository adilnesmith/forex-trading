import React, { useEffect, useState } from 'react';
import { w3cwebsocket, IMessageEvent } from 'websocket';
import { Symbol, TickResponse, ActiveSymbolsResponse } from 'lib/@types'
import styles from './Forex.module.css';
import { APP_ID, WEBSOCKET } from '@/lib/general-config';

const Forex: React.FC = () => {
    const [symbols, setSymbols] = useState<Symbol[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const client = new w3cwebsocket(`${WEBSOCKET}?app_id=${APP_ID}`)
        const subscribeToSymbols = (symbols: Symbol[]) => {
            symbols.forEach((symbol) => {
                const payload = {
                    ticks: symbol.symbol,
                    subscribe: 1
                };
                client.send(JSON.stringify(payload));
            });
        };

        const updateTickPrice = (symbol: string, quote: number) => {
            setSymbols((prevSymbols) => {
                return prevSymbols.map((s) => {
                    if (s.symbol === symbol) {
                        const change = calculate24hChange(s.quote, quote);
                        return {
                            ...s,
                            quote,
                            change
                        };
                    }
                    return s;
                });
            });
        };

        const calculate24hChange = (prevQuote: number | undefined, currentQuote: number): number => {
            if (prevQuote !== undefined) {
                return currentQuote - prevQuote;
            }
            return 0;
        };

        const handleMessage = (message: IMessageEvent) => {
            const data = message.data;

            if (typeof data === 'string') {
                const response: ActiveSymbolsResponse | TickResponse = JSON.parse(data);
                if ('active_symbols' in response) {
                    const activeSymbols = response.active_symbols;
                    setSymbols(activeSymbols);
                    subscribeToSymbols(activeSymbols);
                } else if ('tick' in response) {
                    const { symbol, quote } = response.tick;
                    updateTickPrice(symbol, quote);
                }
            }
        };

        const handleOpen = () => {
            console.log('WebSocket client connected');
            const payload = {
                active_symbols: 'brief',
                product_type: 'basic'
            };
            client.send(JSON.stringify(payload));
        };

        const handleClose = () => {
            console.log('WebSocket client disconnected');
        };

        client.onopen = handleOpen;
        client.onclose = handleClose;
        client.onmessage = handleMessage;

        return () => {
            client.close();
        };
    }, []);

    useEffect(() => {
        setIsLoading(symbols.length === 0);
    }, [symbols]);

    return (
        <div className={styles.wrapper}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className={styles['symbol-table']}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last price</th>
                            <th>24h change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {symbols.map((symbol: Symbol, index: number) => {
                            if (symbol.subgroup === 'none' && symbol.symbol_type === 'forex') {
                                return (
                                    <tr key={index}>
                                        <td>{symbol.display_name}</td>
                                        <td>{symbol.quote}</td>
                                        <td>{symbol.change}</td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Forex;

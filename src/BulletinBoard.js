import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const BulletinBoard = () => {
    const [data, setData] = useState([]);
    // const [cart, setCart] = useState([]);

    const handleAddToCart = (event, id, code, name, type, oran) => {
        let cartItem = new Object();
        cartItem.id = id;
        cartItem.mbs = 4;
        cartItem.code = code;
        cartItem.name = name;
        cartItem.type = type;
        cartItem.oran = oran;


        let cart = localStorage.getItem('storedCart');
        if(!cart){
            cart = new Object();
        }else{
            cart = JSON.parse(cart);
        }
        if(cart[id] && cart[id].type == type){
            delete cart[id];
        }else{
            cart[id] = cartItem;
        }
        
        localStorage.setItem('storedCart', JSON.stringify(cart));
        
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = localStorage.getItem('cachedData');
                if (storedData) {
                    setData(JSON.parse(storedData));
                } else {
                    const response = await fetch('https://nesine-case-study.onrender.com/bets');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData = await response.json();
                    localStorage.setItem('cachedData', JSON.stringify(jsonData));
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        if (data.length === 0) {
            fetchData();
        }
    }, [data]);

    const renderRows = useMemo(() => {
        return () => {
            return Object.values(data).map((item) => (
                <React.Fragment key={item.NID}>
                    <TableRow>
                        <TableCell>{item.D} {item.DAY} {item.LN}</TableCell>
                        <TableCell>Yorumlar</TableCell>
                        <TableCell>{item.MBS}</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>x</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>Alt</TableCell>
                        <TableCell>Üst</TableCell>
                        <TableCell>H1</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>x</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>H2</TableCell>
                        <TableCell>1-X</TableCell>
                        <TableCell>1-2</TableCell>
                        <TableCell>X-2</TableCell>
                        <TableCell>Var</TableCell>
                        <TableCell>Yok</TableCell>
                        <TableCell>+99</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{item.C} {item.T} {item.N}</TableCell>
                        <TableCell>Yorumlar</TableCell>
                        <TableCell>{item.OCG[1].MBS}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, '1', item.OCG[1].OC[0].O)}>{item.OCG[1].OC[0].O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, 'x', item.OCG[1].OC[1].O)}>{item.OCG[1].OC[1].O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, '2', item.OCG[1].OC[2]?.O)}>{item.OCG[1].OC[2]?.O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, 'Alt', item.OCG[5].OC[25].O)}>{item.OCG[5].OC[25].O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, 'Üst', item.OCG[5].OC[26].O)}>{item.OCG[5].OC[26].O}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, '1-X', item.OCG[2].OC[3].O)}>{item.OCG[2].OC[3].O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, '1-2', item.OCG[2].OC[4].O)}>{item.OCG[2].OC[4].O}</TableCell>
                        <TableCell onClick={(e) => handleAddToCart(e, item.NID, item.C, item.N, 'X-2', item.OCG[2].OC[5].O)}>{item.OCG[2].OC[5].O}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>3</TableCell>
                    </TableRow>
                </React.Fragment>
            ));
        };
    }, [data]);

    return (
        <div>
            <h2>Bulletin Board</h2>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Event Count: 3000</TableCell>
                        <TableCell>Yorumlar</TableCell>
                        <TableCell>MBS</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>x</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>Alt</TableCell>
                        <TableCell>Üst</TableCell>
                        <TableCell>H1</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>x</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>H2</TableCell>
                        <TableCell>1-X</TableCell>
                        <TableCell>1-2</TableCell>
                        <TableCell>X-2</TableCell>
                        <TableCell>Var</TableCell>
                        <TableCell>Yok</TableCell>
                        <TableCell>+99</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderRows()}</TableBody>
            </Table>
        </div>
    );
};

export default BulletinBoard;

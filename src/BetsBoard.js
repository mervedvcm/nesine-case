import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const BetsBoard = () => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState({});

  const slugify = (str) =>
    String(str)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const changeColor = () => {
    let storedCart = JSON.parse(localStorage.getItem('storedCart')) || {};

    for (const [id, cartItem] of Object.entries(storedCart)) {
      let cell = document.getElementById(id + '_' + slugify(cartItem.type));
      if (cell) {
        cell.classList.add('active');
      }
    }
  };

  const showCart = () => {
    return Object.values(cart).map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.code}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.type}</TableCell>
        <TableCell>{item.oran}</TableCell>
        {/* Add more table cells as needed */}
      </TableRow>
    ));
  };

  const handleAddToCart = (event, id, oran, code, name, type) => {
    const cartItem = {
      id,
      mbs: 4,
      oran,
      code,
      name,
      type,
    };

    let storedCart = JSON.parse(localStorage.getItem('storedCart')) || {};

    if (storedCart[id]) {
      let cell = document.getElementById(id + '_' + slugify(storedCart[id].type));
      if (cell) {
        cell.classList.remove('active');
      }
    }

    if (storedCart[id] && storedCart[id].type === type) {
      delete storedCart[id];
    } else {
      storedCart[id] = cartItem;
    }

    localStorage.setItem('storedCart', JSON.stringify(storedCart));
    setCart(storedCart);
    changeColor();

    let total = 1;
    for (const [id, cartItem] of Object.entries(storedCart)) {
      total *= cartItem.oran;
    }
    let storedTotal = new Object();
    storedTotal.total = total;
    localStorage.setItem('storedTotal', JSON.stringify(storedTotal));
    setTotal(storedTotal);
    // Renk değişikliklerini eşzamanlı olarak yap
  };

  const cellStyle = {
    borderRight: '1px solid #ddd',
    padding: '8px',
  };

  window.addEventListener('beforeunload', () => {
    let cart = localStorage.getItem('storedCart');
    if (cart) {
      // localStorage'da cart varsa, sıfırla
      localStorage.removeItem('storedCart');
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem('cachedData');
        if (!storedData) {
          const response = await fetch('https://nesine-case-study.onrender.com/bets?limit=100');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          localStorage.setItem('cachedData', JSON.stringify(jsonData));
          setData(jsonData);
        } else {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchCartAndTotal = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('storedCart')) || {};
        setCart(storedCart);
        let total = 1;
        for (const [id, cartItem] of Object.entries(storedCart)) {
          total *= cartItem.oran;
        }
        let storedTotal = new Object();
        storedTotal.total = total;
        localStorage.setItem("storedTotal", JSON.stringify(storedTotal));
        setTotal(storedTotal);
      } catch (error) {
        console.error('Error fetching cart and total:', error);
      }
    };

    fetchData();
    fetchCartAndTotal();
  }, []);

  const showCartVisible = () => {
    if (cart && Object.keys(cart).length > 0)
      return (
        <Card style={{ position: 'fixed', bottom: 0, right: 0, width: 400 }}>
          <CardContent>
            <Table size="small">
              <TableBody>
                {showCart()}
                <TableRow>
                  <TableCell className='totalStyle' colSpan={4}><strong>Toplam Oran: {Number.parseFloat(total.total).toFixed(2)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    return '';
  };

  const renderRows = useMemo(() => {
    const storedCart = JSON.parse(localStorage.getItem('storedCart')) || {};
    return () => {
      return Object.values(data).map((item) => (
        <React.Fragment key={item.NID}>
          <TableRow>
            <TableCell style={cellStyle}><strong>{item.D} {item.DAY} {item.LN}</strong></TableCell>
            <TableCell style={cellStyle}><strong>Yorumlar</strong></TableCell>
            <TableCell style={cellStyle}><strong>{item.MBS}</strong></TableCell>
            <TableCell style={cellStyle}><strong>1</strong></TableCell>
            <TableCell style={cellStyle}><strong>x</strong></TableCell>
            <TableCell style={cellStyle}><strong>2</strong></TableCell>
            <TableCell style={cellStyle}><strong>Alt</strong></TableCell>
            <TableCell style={cellStyle}><strong>Üst</strong></TableCell>
            <TableCell style={cellStyle}><strong>H1</strong></TableCell>
            <TableCell style={cellStyle}><strong>1</strong></TableCell>
            <TableCell style={cellStyle}><strong>x</strong></TableCell>
            <TableCell style={cellStyle}><strong>2</strong></TableCell>
            <TableCell style={cellStyle}><strong>H2</strong></TableCell>
            <TableCell style={cellStyle}><strong>1-X</strong></TableCell>
            <TableCell style={cellStyle}><strong>1-2</strong></TableCell>
            <TableCell style={cellStyle}><strong>X-2</strong></TableCell>
            <TableCell style={cellStyle}><strong>Var</strong></TableCell>
            <TableCell style={cellStyle}><strong>Yok</strong></TableCell>
            <TableCell style={cellStyle}><strong>+99</strong></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={cellStyle}>{item.C} {item.T} {item.N}</TableCell>
            <TableCell style={cellStyle}>Yorumlar</TableCell>
            <TableCell style={cellStyle}>{item.OCG[1].MBS}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == '1' ? 'active' : ''} id={item.NID + '_1'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[1].OC[0].O, item.C, item.N, '1')}>{item.OCG[1].OC[0].O}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == 'x' ? 'active' : ''} id={item.NID + '_x'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[1].OC[1].O, item.C, item.N, 'x')}>{item.OCG[1].OC[1].O}</TableCell>
            <TableCell style={cellStyle} className={storedCart[item.NID] && storedCart[item.NID].type == '2' ? 'active' : ''} id={item.NID + '_2'} /*onClick={(e) => handleAddToCart(e, item.NID, item.OCG[1].OC[2]?.O, item.C, item.N, '2')}*/ >{item.OCG[1].OC[2]?.O}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == 'Alt' ? 'active' : ''} id={item.NID + '_alt'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[5].OC[25].O, item.C, item.N, 'Alt')}>{item.OCG[5].OC[25].O}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == 'Üst' ? 'active' : ''} id={item.NID + '_ust'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[5].OC[26].O, item.C, item.N, 'Üst')}>{item.OCG[5].OC[26].O}</TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == '1-X' ? 'active' : ''} id={item.NID + '_1-x'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[2].OC[3].O, item.C, item.N, '1-X')}>{item.OCG[2].OC[3].O}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == '1-2' ? 'active' : ''} id={item.NID + '_1-2'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[2].OC[4].O, item.C, item.N, '1-2')}>{item.OCG[2].OC[4].O}</TableCell>
            <TableCell style={{...cellStyle, cursor: 'pointer' }} className={storedCart[item.NID] && storedCart[item.NID].type == 'X-2' ? 'active' : ''} id={item.NID + '_x-2'} onClick={(e) => handleAddToCart(e, item.NID, item.OCG[2].OC[5].O, item.C, item.N, 'X-2')}>{item.OCG[2].OC[5].O}</TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}></TableCell>
            <TableCell style={cellStyle}>3</TableCell>
          </TableRow>
        </React.Fragment>
      ));
    };
  }, [data]);

  return (
    <div>
      <Table size="small" style={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell style={cellStyle}><strong>Event Count: 3000</strong></TableCell>
            <TableCell style={cellStyle}><strong>Yorumlar</strong></TableCell>
            <TableCell style={cellStyle}><strong>MBS</strong></TableCell>
            <TableCell style={cellStyle}><strong>1</strong></TableCell>
            <TableCell style={cellStyle}><strong>x</strong></TableCell>
            <TableCell style={cellStyle}><strong>2</strong></TableCell>
            <TableCell style={cellStyle}><strong>Alt</strong></TableCell>
            <TableCell style={cellStyle}><strong>Üst</strong></TableCell>
            <TableCell style={cellStyle}><strong>H1</strong></TableCell>
            <TableCell style={cellStyle}><strong>1</strong></TableCell>
            <TableCell style={cellStyle}><strong>x</strong></TableCell>
            <TableCell style={cellStyle}><strong>2</strong></TableCell>
            <TableCell style={cellStyle}><strong>H2</strong></TableCell>
            <TableCell style={cellStyle}><strong>1-X</strong></TableCell>
            <TableCell style={cellStyle}><strong>1-2</strong></TableCell>
            <TableCell style={cellStyle}><strong>X-2</strong></TableCell>
            <TableCell style={cellStyle}><strong>Var</strong></TableCell>
            <TableCell style={cellStyle}><strong>Yok</strong></TableCell>
            <TableCell style={cellStyle}><strong>+99</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>

      </Table>
      {showCartVisible()}
    </div>
  );
};

export default BetsBoard;

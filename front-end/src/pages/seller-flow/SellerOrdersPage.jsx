import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import { getAllSales } from '../../axios';
import DeliveryContext from '../../context/DeliveryContext';
import ClientNavBar from '../components/ClientNavBar';

const formatedDate = require('../utils');

function OrdersPage() {
  const { orders, setSale, setOrders, delivery } = useContext(DeliveryContext);
  const history = useHistory();
  const socket = io('http://localhost:3001');

  const getSales = async () => {
    const salesList = await getAllSales();
    setOrders(salesList.data);
  };

  useEffect(() => {
    getSales();
  }, []);

  useEffect(() => {
    socket.on('refreshDelivery', (saleSocket) => {
      const getIndex = orders.findIndex((object) => object.id === saleSocket.id);
      if (orders[getIndex]) {
        orders[getIndex].status = 'Entregue';
        setOrders(orders);
      }
    });
    getSales();
  }, [delivery]);

  return (
    <>
      <ClientNavBar />
      {orders.map((order, index) => (
        <div
          key={ index }
          className="productsTable"
          aria-hidden="true"
          onClick={ () => {
            setSale(order);
            history.push(`/seller/orders/${order.id}`);
          } }
        >
          <h3 data-testid={ `seller_orders__element-order-id-${order.id}` }>
            {`Pedido: ${order.id}`}
          </h3>
          <p data-testid={ `seller_orders__element-delivery-status-${order.id}` }>
            {order.status}
          </p>
          <p data-testid={ `seller_orders__element-order-date-${order.id}` }>
            {formatedDate(order.sale_date)}
          </p>
          <p data-testid={ `seller_orders__element-card-price-${order.id}` }>
            {'R$ '}
            {order.total_price.replace('.', ',')}
          </p>
          <p data-testid={ `seller_orders__element-card-address-${order.id}` }>
            {order.delivery_address}
          </p>
        </div>
      ))}
    </>
  );
}

export default OrdersPage;

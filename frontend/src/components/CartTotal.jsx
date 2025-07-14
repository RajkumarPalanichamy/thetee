import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const { currency, delivery_fee, calculateCartTotals } = useContext(ShopContext);
    const [cartSummary, setCartSummary] = useState({
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        discountApplied: false,
        discountMessage: ''
    });

    useEffect(() => {
        setCartSummary(calculateCartTotals());
    }, [calculateCartTotals]);

    return (
        <div className='w-full'>
            <div className='text-xl font-bold'>
                <h1>Cart Total</h1>
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {cartSummary.subtotal.toFixed(2)}</p>
                </div>
                <hr />
                {cartSummary.discountApplied && (
                    <div className='flex justify-between text-green-600 font-medium'>
                        <p>Discount</p>
                        <p>-{currency} {cartSummary.discountAmount.toFixed(2)}</p>
                    </div>
                )}
                {cartSummary.discountApplied && <hr />}
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency} {delivery_fee.toFixed(2)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency} {(cartSummary.total + delivery_fee).toFixed(2)}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
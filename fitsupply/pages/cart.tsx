import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeFromCart, updateQty } from "@/store/slices/cartSlice";

export default function CartPage() {
  const { items } = useSelector((s: RootState) => s.cart);
  const dispatch = useDispatch<AppDispatch>();
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold'>My Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className='grid gap-4'>
          {items.map((it) => (
            <div
              key={it.productId}
              className='flex items-center justify-between border p-3 rounded'>
              <div>
                <div className='font-semibold'>{it.name}</div>
                <div className='text-sm'>${it.price}</div>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  value={it.qty}
                  min={1}
                  onChange={(e) =>
                    dispatch(
                      updateQty({
                        id: it.productId,
                        qty: Number(e.target.value),
                      })
                    )
                  }
                  className='w-16 border rounded p-1'
                />
                <button
                  className='text-red-600'
                  onClick={() => dispatch(removeFromCart(it.productId))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className='text-right font-bold'>
            Subtotal: ${subtotal.toFixed(2)}
          </div>
          <div className='text-right'>
            <a
              href='/checkout'
              className='bg-black text-white px-4 py-2 rounded'>
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

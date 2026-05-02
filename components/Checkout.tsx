"use client";

import { useMemo, useState } from "react";
import { useCart } from "../store/cart";
import { useOrders } from "../store/orders";
import { useInventory } from "../store/inventory";
import PaymentMethods from "./PaymentMethods";
import BankTransferInfo from "./BankTransferInfo";
import OrderSuccess from "./OrderSuccess";
import { bankAccount } from "../data/bank";
import { trackCheckoutStarted, trackPurchase } from "../lib/analytics";
import { createPaymentSession, redirectToPayment } from "../lib/paymentClient";
import { validateStock } from "../lib/stockValidation";

function itemKey(item: any) {
  return `${item.id}-${item.size}-${item.fit || "Regular"}`;
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Checkout() {
  const items = useCart((state) => state.items);
  const removeFromCart = useCart((state) => state.removeFromCart);
  const clearCart = useCart((state) => state.clearCart);
  const addOrder = useOrders((state) => state.addOrder);
  const reduceStock = useInventory((state) => state.reduceStock);
  const stock = useInventory((state) => state.stock);

  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    city: "",
    notes: "",
  });

  const orderReference = useMemo(
    () => `${bankAccount.referencePrefix}-${Date.now().toString().slice(-6)}`,
    []
  );

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 70 ? 0 : 4.99;
  const total = subtotal + shipping;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const isValid =
    customer.name.trim() &&
    validEmail(customer.email) &&
    customer.address.trim() &&
    customer.zip.trim() &&
    customer.city.trim();

  function openCheckout() {
    trackCheckoutStarted({
      items: count,
      value: total,
      currency: "EUR",
    });

    setOpen(true);
  }

  async function submitOrder() {
    if (!isValid) {
      alert("Bitte alle Pflichtfelder korrekt ausfüllen.");
      return;
    }

    const stockCheck = validateStock(items, stock);

    if (!stockCheck.valid) {
      alert("Nicht genug Bestand:\n" + stockCheck.problems.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const order = {
        id: crypto.randomUUID(),
        reference: orderReference,
        customer,
        items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        status: paymentMethod === "bank_transfer" ? "offen" : "produktion",
        createdAt: new Date().toISOString(),
      };

      const paymentSession = await createPaymentSession(order);

      const finalOrder = {
        ...order,
        paymentSessionId: paymentSession.id,
        paymentProvider: paymentSession.provider,
        paymentStatus: paymentSession.status,
      };

      addOrder(finalOrder as any);
      trackPurchase(finalOrder);

      items.forEach((item) => {
        reduceStock(item.id, item.size, item.quantity);
      });

      setSuccessOrder(finalOrder);
      clearCart();
      setOpen(false);

      redirectToPayment(paymentSession);
    } catch (error) {
      alert("Payment konnte nicht vorbereitet werden.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !successOrder) return null;

  return (
    <>
      {items.length > 0 && (
        <button
          onClick={openCheckout}
          className="fixed bottom-5 left-5 right-5 z-50 sm:left-auto sm:w-96 bg-black text-white py-4 rounded-2xl font-black shadow-2xl active:scale-[0.98]"
        >
          Checkout · {count} Artikel · {total.toFixed(2)} €
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white text-black w-full sm:w-[520px] max-h-[92vh] overflow-auto rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-black">Checkout</h2>
              <button onClick={() => setOpen(false)} className="text-3xl font-black">×</button>
            </div>

            {items.map((item) => (
              <div key={itemKey(item)} className="mb-4 border-b border-neutral-200 pb-4">
                <p className="font-black">{item.name}</p>
                <p className="text-sm text-neutral-600">Größe: {item.size}</p>
                <p className="text-sm text-neutral-600">Passform: Regular</p>
                <p className="text-sm text-neutral-600">{item.quantity} x {item.price} €</p>

                <button onClick={() => removeFromCart(itemKey(item))} className="mt-2 text-red-600 text-sm font-black">
                  Entfernen
                </button>
              </div>
            ))}

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span>Zwischensumme</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Versand</span>
                <span>{shipping === 0 ? "Kostenlos" : shipping.toFixed(2) + " €"}</span>
              </div>

              <div className="flex justify-between text-xl font-black border-t border-neutral-200 pt-3">
                <span>Gesamt</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <input placeholder="Name *" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <input placeholder="E-Mail *" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            <input placeholder="Telefon" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <input placeholder="Adresse *" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />

            <div className="grid grid-cols-[120px_1fr] gap-2">
              <input placeholder="PLZ *" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.zip} onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
              <input placeholder="Stadt *" className="w-full mb-2 p-3 rounded-xl bg-neutral-50 border border-neutral-300" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            </div>

            <textarea placeholder="Notiz zur Bestellung" className="w-full mb-4 p-3 rounded-xl bg-neutral-50 border border-neutral-300 min-h-24" value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} />

            <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />

            {paymentMethod === "bank_transfer" && (
              <BankTransferInfo orderReference={orderReference} />
            )}

            <button
              onClick={submitOrder}
              disabled={loading}
              className={`mt-5 w-full py-4 rounded-2xl font-black active:scale-[0.98] ${
                isValid && !loading ? "bg-black text-white" : "bg-neutral-300 text-neutral-500"
              }`}
            >
              {loading ? "Payment wird vorbereitet..." : "Bestellung abschicken"}
            </button>

            <button onClick={clearCart} className="mt-2 w-full bg-red-600 text-white py-4 rounded-2xl font-black">
              Warenkorb leeren
            </button>
          </div>
        </div>
      )}

      <OrderSuccess order={successOrder} onClose={() => setSuccessOrder(null)} />
    </>
  );
}

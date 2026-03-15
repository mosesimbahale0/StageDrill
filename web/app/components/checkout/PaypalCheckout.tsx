import React, { useState, useEffect } from "react";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// Link from remixrun/react
import { Link } from "@remix-run/react";

// GraphQL Mutation for creating PayPal records
const CREATE_USER_PAYPAL_RECORDS = `
  mutation CreateUserPaypalRecords($input: createUserPaypalRecordsInput!) {
    createUserPaypalRecords(input: $input) {
      _id
      _paypal_ids {
        _paypal_id
      }
      _uid
    }
  }
`;

interface PaypalCheckoutProps {
  propsData: {
    _id: string;
    _uid: string;
  };
}

const PaypalCheckout: React.FC<PaypalCheckoutProps> = ({ propsData }) => {
  const _account_id = propsData._id;
  const _uid = propsData._uid;

  // State management
  const [count, setCount] = useState(200);
  const baseTokenPrice = 0.01;
  const orderTotal = () => count * baseTokenPrice;

  useEffect(() => {
    localStorage.setItem("orderTotal", orderTotal().toFixed(2));
  }, [count]);

  const [{ isPending }] = usePayPalScriptReducer();
  const [paypalDetails, setPaypalDetails] = useState<any>(null);

  // Handle PayPal order creation
  const onCreateOrder = (data: any, actions: any) => {
    const storedOrderTotal = localStorage.getItem("orderTotal");
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: storedOrderTotal || "0" },
        },
      ],
    });
  };

  // Handle PayPal order approval
  const onApproveOrder = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      setPaypalDetails(details);
    });
  };

  // Effect to trigger the mutation after PayPal approval
  useEffect(() => {
    if (paypalDetails) {
      const paypalMutation = async () => {
        try {
          const response = await fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: CREATE_USER_PAYPAL_RECORDS,
              variables: {
                input: {
                  customer: {
                    _uid,
                    _paypal_ids: [{ _paypal_id: paypalDetails.payer.payer_id }],
                  },
                  notification: {
                    _account_id,
                    _paypal_id: paypalDetails.payer.payer_id,
                    _paypal_transaction_id: paypalDetails.id,
                    transaction_status: "Completed",
                    is_read: false,
                    text: `You have successfully purchased ${count} tokens.`,
                    from: "System",
                  },
                  transaction: {
                    _account_id,
                    _paypal_id: paypalDetails.payer.payer_id,
                    _paypal_transaction_id: paypalDetails.id,
                    transaction_status: "Completed",
                  },
                },
              },
            }),
          });

          if (!response.ok) {
            throw new Error("Error in creating PayPal records");
          }

          const result = await response.json();
          console.log("Mutation Result:", result);
        } catch (error) {
          console.error("Mutation Error:", error);
        }
      };

      paypalMutation();
    }
  }, [paypalDetails, _uid, _account_id, count]);

  // Render the component
  return (
    <div className="  min-h-screen text-text w-full  py-10 container mx-auto flex flex-col items-center justify -center">
      <section className="w-full lg:w-1/2">
        <div className="w-full">
          <div className="flex flex-wrap">
            <div className="w-full h-full lg:w-8/12 mb-8 lg:mb-0 px-4">
              <h2 className="mb-10 text-2xl font-medium font-heading">
                Buy Credits
              </h2>

              {/* Quantity and Pricing */}
              <div className="mb-12 py-6 border-dashed border-t border-b border-text3">
                <div className="flex flex-wrap items-center -mx-4 mb-6 md:mb-3">
                  <div className="w-full lg:w-1/2 px-4 flex flex-col items-center gap-4">
                    <button
                      onClick={() => setCount((prev) => prev + 100)}
                      className="h-12 w-12 rounded-full bg-accent text-xl text-text "
                    >
                      +
                    </button>
                    <input
                      className="p-4 bg-background border-2 border-text3 text-text3 rounded-full w-32 text-sm active:border-accent active:border-2 focus: outline-none focus:border-2 focus:border-accent "
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                    />
                    <button
                      onClick={() =>
                        setCount((prev) => (prev > 0 ? prev - 100 : prev))
                      }
                      className="h-12 w-12 rounded-full bg-accent text-xl text-text "
                    >
                      -
                    </button>
                  </div>

                  {/* Cart Summary */}
                  <div className="w-full lg:w-1/2 px-4  text-text">
                    {" "}
                    <div className="gap-4 my-8 flex flex-col items-left text-md font-medium">
                      <p className="">
                        $0.01/
                        <span className="text-xs no-underline">Credit</span>
                      </p>
                      <p className="">
                        Credits -<span className="text-warning"> {count}</span>
                      </p>
                      <p className=" font-medium">
                        <span>Cart total - </span>
                        <span className="text-success">
                          ${orderTotal().toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Section */}
              <div className="bg-primary  p-2">
                {isPending ? (
                  <>Loading...</>
                ) : (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={onCreateOrder}
                    onApprove={onApproveOrder}
                  />
                )}
              </div>

              <div className="mt-8">
                <p className="  text-xs font-light text-text2">
                  If the payment options aren't displaying above, simply refresh
                  the page or reach out to our support team for immediate
                  assistance. Your seamless experience is our priority!
                </p>
              </div>

              <Link
                to="/support"
                className=" bg-accent text-buttontext  hover:bg-complementary px-10 py-4 rounded-full  group inline-flex text-sm my-10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaypalCheckout;

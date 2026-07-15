// =========================
// PRELOADED BLINKIT CART
// =========================

const cart = [

    {
        item: "Amul Gold Milk",
        price: 66,
        quantity: 2
    },

    {
        item: "Tata Salt",
        price: 32,
        quantity: 1
    },

    {
        item: "Maggi",
        price: 15,
        quantity: 3
    },

    {
        item: "Lay's Chips",
        price: 20,
        quantity: 2
    }

];

// Display Cart Automatically

displayCart();

function displayCart() {

    let cartHTML = "";
    let total = 0;

    cart.forEach(product => {

        let amount = product.price * product.quantity;

        total += amount;

        cartHTML += `

        <div class="cart-item">

            <span>${product.item} (x${product.quantity})</span>

            <span>₹${amount}</span>

        </div>

        `;

    });

    document.getElementById("cartItems").innerHTML = cartHTML;

    document.getElementById("cartTotal").innerHTML = `₹${total}`;

}

// ==================================
// BILL GENERATOR
// ==================================

function generateBill() {

    console.time("Bill Generation Time");

    // var Example
    var customerName = document.getElementById("name").value;

    // let Example
    let phone = document.getElementById("phone").value;

    let address = document.getElementById("address").value;

    let coupon = Number(document.getElementById("coupon").value);

    let tip = Number(document.getElementById("tip").value);

    let payment = document.getElementById("payment").value;

    // Validation

    if (
        customerName == "" ||
        phone == "" ||
        address == ""
    ) {

        alert("⚠ Please enter all delivery details before proceeding.");

        return;

    }

    let itemsTotal = 0;

    cart.forEach(product => {

        itemsTotal += product.price * product.quantity;

    });

    // const Example

    const DELIVERY_FEE = 25;

    const HANDLING_CHARGE = 8;

    const GST_RATE = 0.05;

    let smallCartFee = itemsTotal < 200 ? 30 : 0;

    let gst = itemsTotal * GST_RATE;

    let totalPay =

        itemsTotal +

        DELIVERY_FEE +

        HANDLING_CHARGE +

        smallCartFee +

        gst +

        tip -

        coupon;

    // Object

    const bill = {

        customerName,

        phone,

        address,

        itemsTotal,

        DELIVERY_FEE,

        HANDLING_CHARGE,

        smallCartFee,

        gst,

        coupon,

        tip,

        payment,

        totalPay

    };

    // Object Destructuring

    const {

        customerName: name,

        itemsTotal: subtotal,

        DELIVERY_FEE: delivery,

        HANDLING_CHARGE: handling,

        smallCartFee: cartFee,

        gst: gstAmount,

        coupon: discount,

        totalPay: finalAmount

    } = bill;

    // Success Notification

    alert(
        "🎉 Bill Generated Successfully!\n\nThank you for shopping with Blinkit.\nYour order has been placed successfully."
    );

    // Console Methods

    console.group("Blinkit Order Details");

    console.table([
        {
            Customer: name,
            Phone: phone,
            Payment: payment,
            "Items Total": subtotal,
            "Final Amount": finalAmount.toFixed(2)
        }
    ]);

    console.log(`Customer Name : ${name}`);

    console.log(`Phone Number : ${phone}`);

    console.log(`Delivery Address : ${address}`);

    console.log(`Payment Method : ${payment}`);

    console.log(`Final Bill : ₹${finalAmount.toFixed(2)}`);

    console.groupEnd();

    console.timeEnd("Bill Generation Time");

    // Template Literal

    document.getElementById("output").innerHTML = `

        <div class="receipt">

            <h2>🛒 Blinkit Order Summary</h2>

            <p><b>Customer :</b> ${name}</p>

            <p><b>Phone :</b> ${phone}</p>

            <p><b>Address :</b> ${address}</p>

            <hr><br>

            <div class="bill-row">
                <span>Items Total</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>

            <div class="bill-row">
                <span>Delivery Fee</span>
                <span>₹${delivery}</span>
            </div>

            <div class="bill-row">
                <span>Handling Charge</span>
                <span>₹${handling}</span>
            </div>

            <div class="bill-row">
                <span>Small Cart Fee</span>
                <span>₹${cartFee}</span>
            </div>

            <div class="bill-row">
                <span>GST (5%)</span>
                <span>₹${gstAmount.toFixed(2)}</span>
            </div>

            <div class="bill-row">
                <span>Coupon Discount</span>
                <span>- ₹${discount}</span>
            </div>

            <div class="bill-row">
                <span>Tip</span>
                <span>₹${tip}</span>
            </div>

            <hr><br>

            <div class="bill-row total">

                <span>TO PAY</span>

                <span>₹${finalAmount.toFixed(2)}</span>

            </div>

            <br>

            <p><b>Payment Method :</b> ${payment}</p>

            <p>⚡ Estimated Delivery : <b>10 Minutes</b></p>

            <p style="color:#0c831f;font-weight:bold;margin-top:15px;">
            ✔ Order Placed Successfully
            </p>

        </div>

    `;

}

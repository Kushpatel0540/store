const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
app.listen(5000, () => {
  console.log('Server listening on http://localhost:5000/');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/checkout', (req, res) => {
  const { name, address, city, province, phone, email, product, quantity } = req.body;

  // Validation of mandatory fields
  if (!name || !address || !city || !province) {
    return res.status(400).send('Please fill in all mandatory fields');
  }

  // Validation of phone number
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).send('Please enter a valid phone number');
  }

  // Validation of email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send('Please enter a valid email address');
  }

  // Calculation of total cost
  const product1Price = 3.99;
  const product2Price = 4.99;
  
  const product1Quantity = parseInt(req.body.product1);
  const product2Quantity = parseInt(req.body.product2);
  
  const total = product1Price * product1Quantity + product2Price * product2Quantity;
  
  if (total < 10) {
    res.send('Minimum purchase amount is $10');
    return;
  }

  // Calculation of tax
  const taxRates = {
    'AB': 0.05,
    'BC': 0.12,
    'MB': 0.13,
    'NB': 0.15,
    'NL': 0.15,
    'NT': 0.05,
    'NS': 0.15,
    'NU': 0.05,
    'ON': 0.13,
    'PE': 0.15,
    'QC': 0.14975,
    'SK': 0.11,
    'YT': 0.05
  };
  
  const taxRate = taxRates[province] || 0;
  const taxAmount = total * taxRate;
  
  // Printing the receipt
  const receipt = `<p>Eddie's Online Store</p>
  <p>Thank you for shopping.</p>
  <p>Name: ${name}</p>
  <p>Address: ${address}</p>
  <p>City: ${city}</p>
  <p>Province: ${province}</p>
  <p>Phone: ${phone}</p>
  <p>Email: ${email}</p>
  <p>Products:</p>
  <p>- Product 1 x ${product1Quantity} = ${product1Price * product1Quantity}</p>
  <p>- Product 2 x ${product2Quantity} = ${product2Price * product2Quantity}</p>
  <p>Total: ${total.toFixed(2)}</p>
  <p>Tax (${(taxRate * 100).toFixed(2)}%): ${taxAmount.toFixed(2)}</p>
  <p>Grand Total: ${(total + taxAmount).toFixed(2)}</p>`;
  
  res.send(receipt);
  
});

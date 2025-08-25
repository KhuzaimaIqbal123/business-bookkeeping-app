// src/components/BillBook.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "./roznamcha/pic.png";

export default function BillBook({ setAuth }) {
  const printRef = useRef();
  const [logoDataUrl, setLogoDataUrl] = useState("");

  // Convert image to data URL for printing
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = logo;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setLogoDataUrl(canvas.toDataURL("image/png"));
    };
  }, [logo]);

  const [billInfo, setBillInfo] = useState({
    date: "",
    billNo: "",
    customerName: "",
  });

  const initialRows = Array.from({ length: 10 }, () => ({
    quantity: "",
    description: "",
    rate: "",
    amount: "",
  }));
  const [items, setItems] = useState(initialRows);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = qty * rate ? (qty * rate).toFixed(2) : "";
    }

    setItems(updatedItems);

    if (
      index === items.length - 1 &&
      (updatedItems[index].quantity ||
        updatedItems[index].description ||
        updatedItems[index].rate)
    ) {
      setItems((prev) => [
        ...prev,
        { quantity: "", description: "", rate: "", amount: "" },
      ]);
    }
  };

  const handleBillInfoChange = (field, value) => {
    setBillInfo((prev) => ({ ...prev, [field]: value }));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

 const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    
    // Replace all inputs with spans for printing
    printContent.querySelectorAll("input").forEach((input) => {
      const span = document.createElement("span");
      span.textContent = input.value;
      span.style.display = "inline-block";
      span.style.minWidth = "100px";
      span.style.padding = "2px 5px";
    });

    // Update logo src to data URL for printing
    const logoImg = printContent.querySelector("img");
    if (logoImg && logoDataUrl) {
      logoImg.src = logoDataUrl;
    }

    // Remove empty rows
    const tableBody = printContent.querySelector("tbody");
    if (tableBody) {
      Array.from(tableBody.querySelectorAll("tr")).forEach((tr) => {
        if (!tr.classList.contains("total-row")) {
          const tds = tr.querySelectorAll("td");
          const hasValue = Array.from(tds).some(
            (td) => td.textContent.trim() !== ""
          );
          if (!hasValue) tr.remove();
        }
      });
    }

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;

    const printDocument = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Bill</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            margin: 0;
            background-color: #f5f5f5;
          }
          .bill-container {
            width: 900px;
            background: #f5f5f5;
            padding: 30px;
            border: 2px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin: 0 auto;
          }
          .bill-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px; 
            font-weight: bold; 
          }
          .bill-info div { 
            display: flex; 
            flex-direction: column; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 15px; 
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #ccc; 
            padding: 10px; 
            text-align: center; 
          }
          th { 
            background-color: #2c3e50; 
            color: white; 
          }
          .total-row td { 
            font-weight: bold; 
            background-color: #f0f0f0; 
          }
          .signature { 
            margin-top: 30px; 
            display: flex; 
            justify-content: space-between; 
            font-weight: bold; 
          }
          .brand-section { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #ffcd18ff; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
          }
          .brand-section img {
            width: 200px; 
            height: 200px; 
            margin-top: -10px;
          }
          .brand-info {
            flex: 1; 
            text-align: right; 
            padding-left: 20px;
          }
          .print-actions {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
          }
          @media print {
            .print-actions {
              display: none;
            }
            body {
              background-color: white;
            }
            .bill-container {
              box-shadow: none;
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          ${printContent.innerHTML}
        </div>
        <div class="print-actions">
          <button onclick="window.print()" style="padding: 10px 20px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Bill
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
        <script>
          // Auto-print when window loads
          window.onload = function() {
            // Focus the window for better printing experience
            window.focus();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printDocument);
    printWindow.document.close();
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar setAuth={setAuth} />

      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#021f37ff",
        }}
      >
        <div
          style={{
            width: "900px",
            background: "#f5f5f5",
            padding: "30px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          ref={printRef}
        >
          {/* Brand Section with Yellow Background */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor:  "#ffcd18ff",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {/* Left Side - Logo */}
            <div style={{ flexShrink: 0 }}>
              <img
                src={logo}
                alt="Shop Logo"
                style={{ width: "200px", height: "200px", marginTop: "-10px" }}
              />
            </div>

            {/* Right Side */}
            <div style={{ flex: 1, textAlign: "right", paddingLeft: "20px" }}>
              {/* Contacts */}
              <div style={{ marginBottom: "8px" }}>
                <p style={{ marginBottom: "3px", marginTop: "-20px",color: "#050303ff ",  fontWeight: "bold", fontSize: "15px" }}>
                  M. Hassaan Chishti: <span style={{ fontWeight: "normal" }}>0322-7006574</span>
                </p>
                <p style={{ margin: "3px 0", fontWeight: "bold", fontSize: "15px" }}>
                  M. Zeeshan Yousaf: <span style={{ fontWeight: "normal" }}>0315-6635950</span>
                </p>
                <p style={{ fontStyle: "italic", marginBottom:"0px", paddingBottom:"30px", fontWeight: "bold", color: "#555", fontSize: "13px" }}>
                  Deals In All Kind of Replica & Digital Base
                </p>
              </div>

              {/* Shop Info */}
              <div>
                <h2 style={{ fontSize: "33px", fontWeight: "bold", color: "#a52d2dff", marginTop:"-10px" }}>
                  Ghosia Fabrics | By Hassaan & Zeeshan
                </h2>
                <p style={{ marginBottom: "3px", marginTop:"30px", fontSize: "14px",color: "#7b4d07ff",fontWeight : "bold" }}>
                  Wakeelan Wali Gali # 7 Madni Center Basement Shop # 9,10 | Faisalabad
                </p>
                <p style={{ margin: "3px 0", fontWeight: "bold", fontSize: "14px",color : "#741414ff" }}>
                  Ph: 041-2637434
                </p>
              </div>
            </div>
          </div>

          {/* Bill Info */}
          <div
            className="bill-info"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            <div>
              <label>Date:</label>
              <input
                type="date"
                value={billInfo.date}
                onChange={(e) => handleBillInfoChange("date", e.target.value)}
                style={{ marginTop: "4px", marginLeft: "10px" }}
              />
            </div>
            <div>
              <label>Bill No:</label>
              <input
                type="text"
                value={billInfo.billNo}
                onChange={(e) => handleBillInfoChange("billNo", e.target.value)}
                style={{ marginTop: "4px", marginLeft: "10px" }}
              />
            </div>
            <div>
              <label>Customer Name:</label>
              <input
                type="text"
                value={billInfo.customerName}
                onChange={(e) =>
                  handleBillInfoChange("customerName", e.target.value)
                }
                style={{ marginTop: "4px", marginLeft: "10px" }}
              />
            </div>
          </div>

          {/* Bill Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
            <thead>
              <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                <th>Quantity</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(idx, "quantity", e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        outline: "none",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleChange(idx, "description", e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        outline: "none",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleChange(idx, "rate", e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        outline: "none",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      outline: "none",
                      width: "20%",
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {item.amount}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="3" style={{ textAlign: "right", paddingRight: "100px", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Total
                </td>
                <td style={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#f0f0f0" }}>
                  {totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Area */}
          <div
            className="signature"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
              fontWeight: "bold",
            }}
          >
            <div>Signature: __________</div>
            <div>Thanks for shopping with us!</div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div 
        style={{ 
          textAlign: "center",
          backgroundColor: "#021f37ff",
          padding: "30px",
          width: "100%",
        }}
      >
        <button
          onClick={handlePrint}
          style={{
            padding: "12px 28px",
            backgroundColor: "#276fb7ff",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1b4e85";
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#276fb7ff";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          Print Bill
        </button>
      </div>

      <Footer />
    </div>
  );
}
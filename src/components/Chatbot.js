import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Hello! I'm here to help. You can ask me about delivery, returns, payments, Gold membership, or how to contact support.",
          sender: 'bot'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getBotResponse = (userInput) => {
    const text = userInput.toLowerCase();

    const responses = [
      { keywords: ['hello', 'hi', 'hey'], reply: "👋 Hello! How can I assist you today?" },
      { keywords: ['refund', 'money back'], reply: "💸 Refunds are processed within 7 working days after we verify the returned item. You'll receive the amount via your original payment method." },
      { keywords: ['return', 'exchange'], reply: "🔄 You can return or exchange items within 30 days. Visit 'My Orders' to start the process. Items must be unused and in original packaging." },
      { keywords: ['delivery', 'shipping', 'track'], reply: "🚚 Standard delivery takes 3–5 business days. Gold members get priority delivery in 1–2 days. Track your order in 'My Orders'." },
      { keywords: ['payment', 'card', 'upi', 'wallet'], reply: "💳 We accept credit/debit cards, UPI, net banking, and wallets like Paytm, PhonePe, and Google Pay." },
      { keywords: ['gold', 'membership', 'premium'], reply: "🌟 Gold members enjoy up to 30% off, faster delivery, and early access to sales. Join via the 'Join Gold' button in the header." },
      { keywords: ['cancel', 'order'], reply: "🛑 You can cancel your order from 'My Orders' if it hasn't shipped yet. If it's already shipped, you can initiate a return after delivery." },
      { keywords: ['invoice', 'bill', 'gst'], reply: "🧾 You can download your invoice from 'My Orders'. For GST invoices, ensure your business details are added before checkout." },
      { keywords: ['damaged', 'wrong item', 'broken'], reply: "😔 We're sorry! Please initiate a return from 'My Orders' and select the reason. We'll resolve it quickly." },
      { keywords: ['support', 'help', 'contact'], reply: "📞 You can reach our support team at support@quantumcart.com or call 1800-123-4567 (Mon–Sat, 9 AM–6 PM IST)." },
      { keywords: ['offers', 'discounts', 'sale', 'deal'], reply: "🔥 Check out our Flash Sale section for limited-time deals. Gold members get extra discounts too!" },
      { keywords: ['account', 'login', 'signup'], reply: "🔐 You can log in or sign up using your email or mobile number. If you forgot your password, use the 'Forgot Password' link." },
      { keywords: ['wishlist', 'save item'], reply: "💖 You can add items to your wishlist by clicking the heart icon. Access your wishlist anytime from your account menu." },
      { keywords: ['app', 'mobile', 'download'], reply: "📱 Our mobile app is available on the Play Store and App Store. Search for 'QuantumCart' and download for a smoother shopping experience." },
      { keywords: ['language', 'hindi', 'tamil'], reply: "🌐 You can change your language preference from the footer or account settings. We support English, Hindi, Tamil, and more." },
      { keywords: ['location', 'pin code', 'area'], reply: "📍 Please enter your pin code during checkout to check delivery availability and estimated time." },
      { keywords: ['gift', 'wrap', 'message'], reply: "🎁 We offer gift wrapping and custom messages at checkout. Just select 'Gift Options' before placing your order." },
      { keywords: ['newsletter', 'unsubscribe'], reply: "📩 You can manage your email preferences from your account settings. Click 'Unsubscribe' in any email to opt out." },
      { keywords: ['feedback', 'suggestion'], reply: "🗣️ We'd love to hear from you! Share your feedback via the 'Contact Us' page or email feedback@quantumcart.com." }
    ];

    for (const item of responses) {
      if (item.keywords.some(keyword => text.includes(keyword))) {
        return item.reply;
      }
    }

    return "🤖 I'm not sure I understand that yet. I can help with delivery, returns, payments, Gold membership, and order issues. Try asking about one of those!";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isTyping) return;

    const userMessage = { text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    const botReply = getBotResponse(inputValue);
    const delay = Math.min(1500, 400 + botReply.length * 10);

    setTimeout(() => {
      setMessages([...newMessages, { text: botReply, sender: 'bot' }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setIsOpen(!isOpen)} aria-label="Open Chatbot">
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Support Chat</h3>
            <button onClick={() => setIsOpen(false)}>_</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping}>Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
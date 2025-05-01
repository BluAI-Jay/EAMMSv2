"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const [copyrightText, setCopyrightText] = useState("BluAI Private Ltd.");

  useEffect(() => {
    axios.get('https://eamms.bluai.ai/api/copyright', {
        headers: {
            Authorization: localStorage.getItem("token"), // Adjust if not using token-based auth
        }
    })
    .then(response => {
        if (response.data && response.data.data) {
            setCopyrightText(response.data.data.copyright_text);
        }
    })
    .catch(err => {
        console.error('Error fetching copyright:', err);
    });
  }, []);

  return (
    <footer className="w-full h-full py-4 bg-gray-100 text-center border-t border-gray-300 content-center">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {copyrightText}
      </p>
    </footer>
  );
};

export default Footer;
